
import React from 'react';
import { Link } from 'react-router-dom';
import { ensureString } from '@/utils/validation/compatibility';

// Regex to match wikilinks in formats like [[link]], [[link|text]]
const wikilinkPattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

interface ProcessedLink {
  title: string;
  displayText: string;
  hasContent: boolean;
}

/**
 * Process wikilink format to extract link information
 */
function processWikilink(match: string): ProcessedLink | null {
  const parts = match.slice(2, -2).split('|');
  
  if (!parts[0]) return null;
  
  return {
    title: parts[0].trim(),
    displayText: (parts[1] || parts[0]).trim(),
    hasContent: true // Assume content exists by default
  };
}

/**
 * Component to render a wikilink
 */
export function WikiLink({ link }: { link: ProcessedLink }) {
  const baseUrl = '/content/';
  const url = `${baseUrl}${encodeURIComponent(link.title)}`;
  
  return (
    <Link 
      to={url}
      className={`wikilink ${link.hasContent ? 'has-content' : 'no-content'}`}
    >
      {link.displayText}
    </Link>
  );
}

/**
 * Processes markdown content to transform wikilinks into React components
 */
export function processWikilinks(content: string): React.ReactNode[] {
  if (!content) return [content];
  
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  
  const safeContent = ensureString(content);
  
  while ((match = wikilinkPattern.exec(safeContent)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      result.push(safeContent.slice(lastIndex, match.index));
    }
    
    // Process the wikilink
    const link = processWikilink(match[0]);
    
    // Add the wikilink component if valid
    if (link) {
      result.push(<WikiLink key={`wikilink-${match.index}`} link={link} />);
    } else {
      // Just add the original text if processing failed
      result.push(match[0]);
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining content
  if (lastIndex < safeContent.length) {
    result.push(safeContent.slice(lastIndex));
  }
  
  return result;
}
