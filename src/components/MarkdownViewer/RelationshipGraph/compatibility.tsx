
/**
 * Additional compatibility utilities for RelationshipGraph
 * 
 * These functions provide compatibility with React JSX components.
 */

import React from 'react';
import { sanitizeGraphData } from './compatibility';
import { GraphData } from './types';

/**
 * Validates and ensures graph data is in the correct format
 * 
 * This is a wrapper around sanitizeGraphData for backward compatibility
 */
export const ensureValidGraphData = (data: any): GraphData => {
  return sanitizeGraphData(data);
};

/**
 * Renders graph loading state
 */
export const GraphLoadingComponent = () => (
  <div className="flex items-center justify-center h-96 w-full bg-gray-50 rounded-md">
    <div className="text-gray-500">
      <svg className="animate-spin h-8 w-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p>Loading graph data...</p>
    </div>
  </div>
);

/**
 * Renders graph error state
 */
export const GraphErrorComponent = ({ error }: { error: string }) => (
  <div className="flex items-center justify-center h-96 w-full bg-gray-50 rounded-md">
    <div className="text-red-500 text-center p-6">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-medium mb-2">Error Loading Graph</h3>
      <p className="text-sm text-gray-600">{error}</p>
    </div>
  </div>
);

/**
 * Renders empty graph state
 */
export const EmptyGraphComponent = () => (
  <div className="flex items-center justify-center h-96 w-full bg-gray-50 rounded-md">
    <div className="text-gray-500 text-center p-6">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 className="text-lg font-medium mb-2">No Graph Data</h3>
      <p className="text-sm text-gray-600">There are no relationships to display.</p>
    </div>
  </div>
);
