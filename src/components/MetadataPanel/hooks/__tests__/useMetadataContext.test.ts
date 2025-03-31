
import { renderHook } from "@testing-library/react-hooks";
import { useMetadataContext, MetadataProvider } from "../useMetadataContext";
import { mockMetadataContext } from "../../__tests__/setup/test-types";
import React from "react";

describe("useMetadataContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MetadataProvider value={mockMetadataContext}>
      {children}
    </MetadataProvider>
  );

  it("returns the metadata context", () => {
    const { result } = renderHook(() => useMetadataContext(), { wrapper });
    
    expect(result.current).toEqual(mockMetadataContext);
  });

  it("throws an error when used outside of a MetadataProvider", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useMetadataContext());
    }).toThrow("useMetadataContext must be used within a MetadataProvider");
    
    consoleError.mockRestore();
  });

  it("warns when contentId doesn't match the requested contentId", () => {
    const consoleWarn = jest.spyOn(console, "warn").mockImplementation(() => {});
    
    renderHook(() => useMetadataContext("different-content-id"), { wrapper });
    
    expect(consoleWarn).toHaveBeenCalledWith(
      "useMetadataContext: requested contentId different-content-id doesn't match context contentId test-content-123"
    );
    
    consoleWarn.mockRestore();
  });

  it("calls refreshMetadata when available", () => {
    const { result } = renderHook(() => useMetadataContext(), { wrapper });
    
    if (result.current.refreshMetadata) {
      result.current.refreshMetadata();
      expect(mockMetadataContext.refreshMetadata).toHaveBeenCalled();
    }
  });
  
  it("calls handleRefresh when available", async () => {
    const { result } = renderHook(() => useMetadataContext(), { wrapper });
    
    if (result.current.handleRefresh) {
      await result.current.handleRefresh();
      expect(mockMetadataContext.handleRefresh).toHaveBeenCalled();
    }
  });
  
  it("calls fetchTags when available", async () => {
    const { result } = renderHook(() => useMetadataContext(), { wrapper });
    
    if (result.current.fetchTags) {
      await result.current.fetchTags();
      expect(mockMetadataContext.fetchTags).toHaveBeenCalled();
    }
  });
});
