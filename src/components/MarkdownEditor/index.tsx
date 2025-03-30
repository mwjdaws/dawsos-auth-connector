
// Export the main components without circular dependencies
import MarkdownEditor from './MarkdownEditor';
import MarkdownContent from './MarkdownContent';
import MarkdownPreview from './MarkdownPreview';

// Re-export components individually
export { default as MarkdownEditor } from './MarkdownEditor';
export { default as MarkdownContent } from './MarkdownContent';
export { default as MarkdownPreview } from './MarkdownPreview';
export { default as EditorHeader } from './EditorHeader';
export { default as EditorActions } from './EditorActions';
export { default as VersionHistoryModal } from './VersionHistoryModal';
export { default as SplitEditor } from './SplitEditor';
export { default as FullscreenEditor } from './FullscreenEditor';
export { default as EditorToolbar } from './EditorToolbar';
export { default as OntologySuggestionsPanel } from './OntologySuggestionsPanel';

// Default export
export default MarkdownEditor;
