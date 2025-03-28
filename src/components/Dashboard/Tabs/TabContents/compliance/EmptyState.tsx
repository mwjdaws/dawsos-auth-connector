
import React from "react";

export function EmptyState() {
  return (
    <div className="text-center py-8 border rounded-md bg-gray-50">
      <p className="text-gray-500">No items flagged for external review.</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <p className="mt-2 text-gray-500">Loading review items...</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: string, onRetry: () => void }) {
  return (
    <div className="p-4 text-sm border rounded-md bg-red-50 border-red-200 text-red-800">
      {error}
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="ml-2 underline hover:text-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
