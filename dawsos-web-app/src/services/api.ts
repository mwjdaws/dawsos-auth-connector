import { supabase } from './supabaseClient';

export const fetchKnowledgeSources = async () => {
    const { data, error } = await supabase
        .from('knowledge_sources')
        .select('*');
    if (error) throw new Error(error.message);
    return data;
};

export const createKnowledgeSource = async (source) => {
    const { data, error } = await supabase
        .from('knowledge_sources')
        .insert([source]);
    if (error) throw new Error(error.message);
    return data;
};

export const updateKnowledgeSource = async (id, updates) => {
    const { data, error } = await supabase
        .from('knowledge_sources')
        .update(updates)
        .eq('id', id);
    if (error) throw new Error(error.message);
    return data;
};

export const deleteKnowledgeSource = async (id) => {
    const { data, error } = await supabase
        .from('knowledge_sources')
        .delete()
        .eq('id', id);
    if (error) throw new Error(error.message);
    return data;
};