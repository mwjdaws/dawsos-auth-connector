import { useCallback, useState } from 'react';
import { useNoteLinks } from './useNoteLinks';

/**
 * Hook for processing and managing wikilinks in content
 */
export function useWikiLinks(
  sourceId?: string,
  onContentChange?: (updatedContent: string) => void
) {
  const [processingLinks, setProcessingLinks] = useState(false);
  const { createNoteLink, findSourcesByTitle } = useNoteLinks();

  /**
   * Extract wikilinks from content
   */
  const extractWikilinks = useCallback((content: string) => {
    const wikiLinkPattern = /\[\[(.*?)\]\]/g;
    const links: string[] = [];
    let match;

    while ((match = wikiLinkPattern.exec(content)) !== null) {
      links.push(match[1]);
    }

    return [...new Set(links)]; // Remove duplicates
  }, []);

  /**
   * Process wikilinks in content and save to database
   */
  const processWikilinks = useCallback(async (content: string) => {
    if (!sourceId) return;
    
    setProcessingLinks(true);
    try {
      const links = extractWikilinks(content);
      
      // For each wikilink, find matching sources or create if needed
      for (const linkText of links) {
        const matches = await findSourcesByTitle(linkText);
        
        if (matches.length > 0) {
          // If exact match found, create a link
          const exactMatch = matches.find(m => m.title.toLowerCase() === linkText.toLowerCase());
          if (exactMatch) {
            await createNoteLink(sourceId, exactMatch.id, 'wikilink');
          } else if (matches[0]) {
            // Otherwise use the closest match
            await createNoteLink(sourceId, matches[0].id, 'wikilink');
          }
        }
        // Future enhancement: Option to create new sources for wikilinks that don't match
      }
    } catch (error) {
      console.error('Error processing wikilinks:', error);
    } finally {
      setProcessingLinks(false);
    }
  }, [sourceId, extractWikilinks, findSourcesByTitle, createNoteLink]);

  /**
   * Add a wikilink to the content
   */
  const addWikilink = useCallback((linkText: string) => {
    if (!onContentChange) return;
    
    // Fix: Pass a string instead of a function
    const newContent = `[[${linkText}]]`;
    onContentChange(newContent);
  }, [onContentChange]);

  return {
    processWikilinks,
    extractWikilinks,
    addWikilink,
    processingLinks
  };
}
