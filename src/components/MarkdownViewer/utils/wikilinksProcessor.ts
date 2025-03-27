
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
 * Renders wikilinks as clickable spans
 */
export const renderWikiLinks = (text: string, handleWikiLinkClick: (linkText: string) => void) => {
  const wikiLinkPattern = /\[\[(.*?)\]\]/g;
  const parts = [];
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
        className="text-blue-500 cursor-pointer hover:underline"
        onClick={() => handleWikiLinkClick(linkText)}
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
