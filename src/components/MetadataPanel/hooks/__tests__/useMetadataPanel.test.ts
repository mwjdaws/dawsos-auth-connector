
import { renderHook, act } from "@testing-library/react-hooks";
import { useMetadataPanel } from "../useMetadataPanel";
import { useMetadataQuery } from "@/hooks/metadata/useMetadataQuery";
import { useTagsQuery } from "@/hooks/metadata/useTagsQuery";
import { useTagOperations } from "../tag-operations/useTagOperations"; 
import { useOntologyTermsQuery } from "@/hooks/metadata/useOntologyTermsQuery";
import { basicTag, typedTag } from "../__tests__/setup/test-types";

// Mock the context hook to provide expected values
jest.mock("../useMetadataContext", () => ({
  useMetadataContext: jest.fn(() => ({
    contentId: "test-123",
    tags: [basicTag, typedTag],
    ontologyTerms: [],
    isEditable: true,
    isLoading: false,
    error: null,
    refetchAll: jest.fn()
  }))
}));

// Mock the hooks we're using inside useMetadataPanel
jest.mock("@/hooks/metadata/useMetadataQuery", () => ({
  useMetadataQuery: jest.fn()
}));

jest.mock("@/hooks/metadata/useTagsQuery", () => ({
  useTagsQuery: jest.fn()
}));

jest.mock("../tag-operations/useTagOperations", () => ({
  useTagOperations: jest.fn()
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
    
    (useTagOperations as jest.Mock).mockReturnValue({
      tags: [basicTag, typedTag],
      isLoading: false,
      error: null,
      newTag: "",
      setNewTag: jest.fn(),
      handleAddTag: jest.fn(),
      handleDeleteTag: jest.fn(),
      handleReorderTags: jest.fn()
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
    jest.spyOn(require("../useMetadataContext"), "useMetadataContext").mockReturnValue({
      contentId: "test-123",
      tags: [basicTag, typedTag],
      ontologyTerms: [],
      isEditable: true,
      isLoading: true,
      error: null,
      refetchAll: jest.fn()
    });
    
    const { result } = renderHook(() => 
      useMetadataPanel({ contentId: "test-123" })
    );
    
    expect(result.current.isLoading).toBe(true);
  });

  it("handles refresh", () => {
    const mockRefetchAll = jest.fn();
    jest.spyOn(require("../useMetadataContext"), "useMetadataContext").mockReturnValue({
      contentId: "test-123",
      tags: [basicTag, typedTag],
      ontologyTerms: [],
      isEditable: true,
      isLoading: false,
      error: null,
      refetchAll: mockRefetchAll
    });
    
    const mockMetadataChange = jest.fn();
    
    const { result } = renderHook(() => 
      useMetadataPanel({ 
        contentId: "test-123", 
        onMetadataChange: mockMetadataChange 
      })
    );
    
    act(() => {
      result.current.handleRefresh();
    });
    
    expect(mockRefetchAll).toHaveBeenCalled();
    expect(mockMetadataChange).toHaveBeenCalled();
  });
});
