
import React, { useCallback, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GraphNode {
  id: string;
  name: string;
  type: 'source' | 'term';
  val?: number;
  color?: string;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
  value?: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface RelationshipGraphProps {
  startingNodeId?: string;
  width?: number;
  height?: number;
}

export function RelationshipGraph({ startingNodeId, width = 800, height = 600 }: RelationshipGraphProps) {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchGraphData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch knowledge sources
      const { data: sources, error: sourcesError } = await supabase
        .from('knowledge_sources')
        .select('id, title')
        .limit(100);
      
      if (sourcesError) throw sourcesError;
      
      // Fetch note links
      const { data: links, error: linksError } = await supabase
        .from('note_links')
        .select('source_id, target_id, link_type')
        .limit(200);
      
      if (linksError) throw linksError;
      
      // Fetch ontology terms
      const { data: terms, error: termsError } = await supabase
        .from('ontology_terms')
        .select('id, term, domain')
        .limit(100);
      
      if (termsError) throw termsError;
      
      // Fetch ontology relationships
      const { data: termRelationships, error: termRelError } = await supabase
        .from('ontology_relationships')
        .select('term_id, related_term_id, relation_type')
        .limit(200);
      
      if (termRelError) throw termRelError;
      
      // Fetch knowledge source to ontology term relationships
      const { data: sourceTerms, error: sourceTermsError } = await supabase
        .from('knowledge_source_ontology_terms')
        .select('knowledge_source_id, ontology_term_id')
        .limit(200);
      
      if (sourceTermsError) throw sourceTermsError;
      
      // Prepare graph data
      const nodes: GraphNode[] = [
        // Knowledge source nodes
        ...sources.map(source => ({
          id: source.id,
          name: source.title,
          type: 'source' as const,
          val: 2,
          color: '#4299e1' // blue
        })),
        
        // Ontology term nodes
        ...terms.map(term => ({
          id: term.id,
          name: `${term.domain ? `${term.domain}: ` : ''}${term.term}`,
          type: 'term' as const,
          val: 1.5,
          color: '#68d391' // green
        }))
      ];
      
      const graphLinks: GraphLink[] = [
        // Note links
        ...links.map(link => ({
          source: link.source_id,
          target: link.target_id,
          type: link.link_type,
          value: 1
        })),
        
        // Term relationships
        ...termRelationships.map(rel => ({
          source: rel.term_id,
          target: rel.related_term_id,
          type: rel.relation_type,
          value: 0.7
        })),
        
        // Source to term relationships
        ...sourceTerms.map(st => ({
          source: st.knowledge_source_id,
          target: st.ontology_term_id,
          type: 'has_term',
          value: 0.5
        }))
      ];
      
      setGraphData({ 
        nodes,
        links: graphLinks
      });
    } catch (err) {
      console.error('Error fetching graph data:', err);
      setError('Failed to load relationship data');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);
  
  const handleNodeClick = useCallback((node: GraphNode) => {
    if (node.type === 'source') {
      navigate(`/source/${node.id}`);
    } else {
      // Could show term details in a modal/sidebar
      console.log('Term clicked:', node);
    }
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading relationship graph...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
        <Button onClick={fetchGraphData}>Retry</Button>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="p-2 border-b bg-muted/20 flex justify-between items-center">
        <h3 className="text-sm font-medium">Knowledge Relationship Graph</h3>
        <div className="text-xs text-muted-foreground">
          {graphData.nodes.length} nodes, {graphData.links.length} connections
        </div>
      </div>
      <div style={{ height }}>
        <ForceGraph2D
          graphData={graphData}
          nodeAutoColorBy="type"
          nodeLabel={node => node.name}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkLabel={link => link.type as string}
          linkColor={() => "#999"}
          onNodeClick={handleNodeClick}
          width={width}
          height={height}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.name as string;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
            
            // Node circle
            ctx.fillStyle = node.color as string;
            ctx.beginPath();
            ctx.arc(node.x as number, node.y as number, node.val as number * 2, 0, 2 * Math.PI);
            ctx.fill();
            
            // Text background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(
              (node.x as number) - bckgDimensions[0] / 2,
              (node.y as number) + 6,
              bckgDimensions[0],
              bckgDimensions[1]
            );
            
            // Text
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#222';
            ctx.fillText(label, node.x as number, (node.y as number) + 6 + fontSize / 2);
          }}
          cooldownTicks={100}
          minZoom={0.5}
          maxZoom={5}
        />
      </div>
    </div>
  );
}
