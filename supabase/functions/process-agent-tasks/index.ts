
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Connect to Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Available agent types that can be processed
const AGENT_TYPES = {
  'ontology-enrichment': processOntologyEnrichment,
  'tag-suggestion': processTagSuggestion,
  'external-source-validator': processExternalSourceValidator,
  'content-summarizer': processContentSummarizer
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing agent tasks...');
    
    // Fetch next pending task
    const { data: task, error } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('status', 'pending')
      .lte('next_attempt_at', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No tasks found (empty result)
        return new Response(
          JSON.stringify({ message: 'No pending tasks found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw error;
    }
    
    if (!task) {
      return new Response(
        JSON.stringify({ message: 'No pending tasks found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Processing task ${task.id} for agent ${task.agent_name}`);
    
    // Mark task as in-progress to prevent concurrent processing
    await supabase
      .from('agent_tasks')
      .update({
        status: 'processing',
        last_attempt_at: new Date().toISOString(),
        retry_count: task.retry_count + 1
      })
      .eq('id', task.id);
    
    // Process the task based on agent type
    const processor = AGENT_TYPES[task.agent_name];
    
    if (!processor) {
      await markTaskFailed(task.id, `Unknown agent type: ${task.agent_name}`);
      return new Response(
        JSON.stringify({ message: `Unknown agent type: ${task.agent_name}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Execute the processor function
    const result = await processor(task);
    
    // Update agent action log
    await logAgentAction(task, result);
    
    return new Response(
      JSON.stringify({ 
        message: 'Task processed successfully', 
        taskId: task.id,
        result 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing tasks:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

// Process ontology enrichment tasks
async function processOntologyEnrichment(task) {
  try {
    // Call the ontology enrichment edge function
    const { data, error } = await supabase.functions.invoke('suggest-ontology-terms', {
      body: {
        sourceId: task.knowledge_source_id,
        applyOntologyTerms: task.payload?.applyOntologyTerms === true
      }
    });
    
    if (error) {
      await markTaskFailed(task.id, error.message);
      return { success: false, error: error.message };
    }
    
    await markTaskCompleted(task.id, data);
    return { success: true, data };
  } catch (error) {
    await markTaskFailed(task.id, error.message);
    return { success: false, error: error.message };
  }
}

// Process tag suggestion tasks
async function processTagSuggestion(task) {
  try {
    // Get content from the knowledge source
    const { data: source, error: sourceError } = await supabase
      .from('knowledge_sources')
      .select('content, title')
      .eq('id', task.knowledge_source_id)
      .single();
    
    if (sourceError) {
      await markTaskFailed(task.id, sourceError.message);
      return { success: false, error: sourceError.message };
    }
    
    // Call the tag generation edge function
    const { data, error } = await supabase.functions.invoke('generate-tags', {
      body: {
        content: source.content,
        save: true,
        contentId: task.knowledge_source_id
      }
    });
    
    if (error) {
      await markTaskFailed(task.id, error.message);
      return { success: false, error: error.message };
    }
    
    await markTaskCompleted(task.id, data);
    return { success: true, data };
  } catch (error) {
    await markTaskFailed(task.id, error.message);
    return { success: false, error: error.message };
  }
}

// Process external source validator tasks
async function processExternalSourceValidator(task) {
  try {
    // Call the external source validator edge function
    const { data, error } = await supabase.functions.invoke('check-external-source', {
      body: { knowledgeSourceId: task.knowledge_source_id }
    });
    
    if (error) {
      await markTaskFailed(task.id, error.message);
      return { success: false, error: error.message };
    }
    
    await markTaskCompleted(task.id, data);
    return { success: true, data };
  } catch (error) {
    await markTaskFailed(task.id, error.message);
    return { success: false, error: error.message };
  }
}

// Process content summarizer tasks
async function processContentSummarizer(task) {
  try {
    // Placeholder for content summarization
    // In a real implementation, this would call an LLM or a specific edge function
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = {
      summary: "This is a placeholder summary generated by the background task processor",
      confidence: 0.85
    };
    
    await markTaskCompleted(task.id, result);
    return { success: true, data: result };
  } catch (error) {
    await markTaskFailed(task.id, error.message);
    return { success: false, error: error.message };
  }
}

// Helper function to mark a task as completed
async function markTaskCompleted(taskId, result) {
  return supabase
    .from('agent_tasks')
    .update({
      status: 'completed',
      updated_at: new Date().toISOString(),
      payload: { ...result, completed_at: new Date().toISOString() }
    })
    .eq('id', taskId);
}

// Helper function to mark a task as failed
async function markTaskFailed(taskId, errorMessage) {
  const { data: task } = await supabase
    .from('agent_tasks')
    .select('retry_count, max_retries')
    .eq('id', taskId)
    .single();
  
  const reachedMaxRetries = task && task.retry_count >= task.max_retries;
  const status = reachedMaxRetries ? 'failed' : 'pending';
  
  // Calculate next attempt time with exponential backoff
  const backoffMinutes = Math.pow(2, task.retry_count);
  const nextAttemptAt = reachedMaxRetries 
    ? null 
    : new Date(Date.now() + backoffMinutes * 60 * 1000).toISOString();
  
  return supabase
    .from('agent_tasks')
    .update({
      status,
      error_message: errorMessage,
      updated_at: new Date().toISOString(),
      next_attempt_at: nextAttemptAt
    })
    .eq('id', taskId);
}

// Log the agent action to the agent_actions table
async function logAgentAction(task, result) {
  return supabase
    .from('agent_actions')
    .insert({
      knowledge_source_id: task.knowledge_source_id,
      agent_name: task.agent_name,
      action: task.payload?.action || 'background-process',
      success: result.success,
      confidence: result.data?.confidence,
      error: result.error,
      metadata: {
        task_id: task.id,
        retry_count: task.retry_count,
        result: result.data,
        processed_at: new Date().toISOString()
      }
    });
}
