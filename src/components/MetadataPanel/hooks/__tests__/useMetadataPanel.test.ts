
import { renderHook, act } from "@testing-library/react-hooks";
import { useMetadataPanel } from "../useMetadataPanel";
import { useMetadataQuery } from "@/hooks/metadata/useMetadataQuery";
import { useTagsQuery } from "@/hooks/metadata/useTagsQuery";
import { useTagMutations } from "@/hooks/metadata/useTagMutations";
import { useOntologyTermsQuery } from "@/hooks/metadata/useOntologyTermsQuery";
import { basicTag, typedTag } from "../../__tests__/setup/test-types";

// Mock the hooks we're using inside useMetadataPanel
jest.mock("@/hooks/metadata/useMetadataQuery", () => ({
  useMetadataQuery: jest.fn()
}));

jest.mock("@/hooks/metadata/useTagsQuery", () => ({
  useTagsQuery: jest.fn()
}));

jest.mock("@/hooks/metadata/useTagMutations", () => ({
  useTagMutations: jest.fn()
}));

jest.mock("@/hooks/metadata/useOntologyTermsQuery", () => ({
  useOntologyTermsQuery: jest.fn()
}));

describe("useMetadataPanel", () => {
  beforeEach(() => {
    // Default mocks for all hooks
    (useMetadataQuery as jest.Mock).mockReturnValue({
      data: {
        title: "Test Content",
        external_source_url: "https://example.com",
        needs_external_review: false,
        external_source_checked_at: "2023-01-01T00:00:00Z"
      },
      isLoading: false,
      error: null
    });
    
    (useTagsQuery as jest.Mock).mockReturnValue({
      data: [basicTag, typedTag],
      isLoading: false,
      error: null
    });
    
    (useTagMutations as jest.Mock).mockReturnValue({
      addTag: jest.fn(),
      deleteTag: jest.fn(),
      isAddingTag: false,
      isDeletingTag: false
    });
    
    (useOntologyTermsQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    });
  });
  
  it("initializes with correct state", () => {
    const { result } = renderHook(() => 
      useMetadataPanel({ contentId: "test-123" })
    );
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.contentId).toBe("test-123");
    expect(result.current.tags.length).toBe(2);
    expect(result.current.isCollapsed).toBe(false);
  });
  
  it("uses initialCollapsed prop correctly", () => {
    const { result } = renderHook(() => 
      useMetadataPanel({ 
        contentId: "test-123", 
        isCollapsible: true,
        initialCollapsed: true 
      })
    );
    
    expect(result.current.isCollapsed).toBe(true);
  });
  
  it("updates state when content is loading", () => {
    (useMetadataQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    });
    
    const { result } = renderHook(() => 
      useMetadataPanel({ contentId: "test-123" })
    );
    
    expect(result.current.isLoading).toBe(true);
  });
  
  it("updates newTag state", () => {
    const { result } = renderHook(() => 
      useMetadataPanel({ contentId: "test-123" })
    );
    
    act(() => {
      result.current.setNewTag("test tag");
    });
    
    expect(result.current.newTag).toBe("test tag");
  });
  
  it("handles tag addition", () => {
    const mockAddTag = jest.fn();
    (useTagMutations as jest.Mock).mockReturnValue({
      addTag: mockAddTag,
      deleteTag: jest.fn(),
      isAddingTag: false,
      isDeletingTag: false
    });
    
    const { result } = renderHook(() => 
      useMetadataPanel({ contentId: "test-123" })
    );
    
    act(() => {
      result.current.handleAddTag("new tag");
    });
    
    expect(mockAddTag).toHaveBeenCalledWith({
      contentId: "test-123",
      name: "new tag",
      display_order: 2 // Should be the index after the existing tags
    });
  });
});
