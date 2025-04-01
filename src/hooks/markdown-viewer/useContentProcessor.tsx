
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * Hook for processing markdown content in the viewer component
 */
export function useContentProcessor(initialContent: string = '') {
  const [content, setContent] = useState(initialContent);
  const [processedContent, setProcessedContent] = useState<string>(initialContent);

  // Process the content whenever it changes
  useEffect(() => {
    if (!content) {
      setProcessedContent('');
      return;
    }

    // For now, we're just setting the content directly
    // In the future, additional processing can be added here
    setProcessedContent(content);
  }, [content]);

  // Render the markdown to React nodes
  const renderMarkdown = () => {
    if (!processedContent) return null;
    
    return <ReactMarkdown>{processedContent}</ReactMarkdown>;
  };

  return {
    content,
    setContent,
    processedContent,
    renderMarkdown
  };
}

export default useContentProcessor;
