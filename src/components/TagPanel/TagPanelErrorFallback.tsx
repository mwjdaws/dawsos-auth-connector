
import React from "react";

export function TagPanelErrorFallback() {
  return (
    <div className="p-4 border border-red-300 bg-red-50 rounded-md">
      <h3 className="text-red-700 font-medium mb-2">Something went wrong with the tag generator</h3>
      <p className="text-sm text-red-600 mb-4">
        We encountered an error while processing your request. Please try again or contact support.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
      >
        Reload Page
      </button>
    </div>
  );
}
