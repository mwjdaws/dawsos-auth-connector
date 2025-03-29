
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Helper functions for processing wikilinks in markdown content
 */

/**
 * Processes [[wikilinks]] in the markdown content and converts them to markdown links
 */
export const processWikilinks = (content: string): string => {
  // Replace [[wikilinks]] with a link format
  return content.replace(/\[\[(.*?)\]\]/g, (match, linkText) => {
    return `[${linkText}](#/wiki/${encodeURIComponent(linkText)})`;
  });
};

/**
 * Hook for handling wikilink clicks
 */
export const useWikiLinkNavigation = () => {
  const navigate = useNavigate();
  
  const handleWikiLinkClick = (linkText: string) => {
    navigate(`/wiki/${encodeURIComponent(linkText)}`);
  };
  
  return { handleWikiLinkClick };
};

/**
 * Renders wikilinks as clickable spans
 */
export const renderWikiLinks = (text: string, handleWikiLinkClick: (linkText: string) => void) => {
  const wikiLinkPattern = /\[\[(.*?)\]\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = wikiLinkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    const linkText = match[1];
    parts.push(
      <span 
        key={match.index} 
        className="text-blue-500 cursor-pointer hover:underline font-medium"
        onClick={() => handleWikiLinkClick(linkText)}
        data-wikilink={linkText}
      >
        {linkText}
      </span>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return <>{parts}</>;
};

/**
 * Component for displaying a link preview tooltip
 */
export const WikiLinkPreview: React.FC<{
  title: string;
  isLoading?: boolean;
  error?: any;
  children: React.ReactNode;
}> = ({ title, isLoading, error, children }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="invisible group-hover:visible absolute z-50 w-64 bg-white dark:bg-gray-800 p-3 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 text-sm left-0 mt-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
            <span>Loading preview...</span>
          </div>
        ) : error ? (
          <div className="text-red-500">Error loading preview</div>
        ) : (
          <>
            <h4 className="font-medium mb-1">{title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Click to view full content</p>
          </>
        )}
      </div>
    </div>
  );
};
