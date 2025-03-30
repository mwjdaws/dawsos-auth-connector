
export interface GraphRenderStyles {
  backgroundColor: string;
  emptyStateStyle: string;
  emptyStateText: string;
}

export function useGraphRenderStyles(): GraphRenderStyles {
  // Theme-aware styles for the graph renderer
  return {
    backgroundColor: '#ffffff', // Light theme default
    emptyStateStyle: 'flex items-center justify-center h-full text-muted-foreground',
    emptyStateText: 'No data available to display'
  };
}
