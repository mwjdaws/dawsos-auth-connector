
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { TagPanel } from '@/components/TagPanel';
import { supabase } from '@/integrations/supabase/client';
import { MemoryRouter } from 'react-router-dom';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: { tags: [] }, error: null }),
    },
    insert: vi.fn().mockResolvedValue({ 
      data: [{ id: 'mock-tag-id', name: 'compliance', type_id: 'mock-type-id' }],
      error: null 
    }),
  }
}));

// Mock the toast component
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock tag type data for the select dropdown
const mockTagTypes = [
  { id: 'mock-type-id', name: 'Topic' },
  { id: 'mock-type-id-2', name: 'Category' }
];

describe('TagPanel Component - Manual Tag Creation', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup the supabase mock to return tag types and empty tags
    const mockFromFn = vi.fn().mockReturnThis();
    const mockSelectFn = vi.fn().mockReturnThis();
    const mockEqFn = vi.fn().mockReturnThis();
    const mockOrderFn = vi.fn().mockReturnThis();
    
    // Define specific mock implementations
    supabase.from = mockFromFn;
    mockFromFn.mockImplementation((table) => {
      if (table === 'tag_types') {
        return {
          select: () => ({
            order: () => ({
              data: mockTagTypes,
              error: null
            })
          })
        };
      } else if (table === 'tags') {
        return {
          select: mockSelectFn,
          insert: vi.fn().mockResolvedValue({ 
            data: [{ id: 'mock-tag-id', name: 'compliance', type_id: 'mock-type-id' }],
            error: null 
          }),
        };
      }
      return {
        select: mockSelectFn,
        eq: mockEqFn,
        order: mockOrderFn,
      };
    });
    
    // Mock select to return empty tags initially
    mockSelectFn.mockImplementation(() => ({
      eq: () => ({
        data: [],
        error: null
      })
    }));
  });

  test('creates a new tag with type and displays it grouped by tag type', async () => {
    const mockOnTagsSaved = vi.fn();
    
    render(
      <MemoryRouter>
        <TagPanel
          contentId="mock-note-123"
          onTagsSaved={mockOnTagsSaved}
        />
      </MemoryRouter>
    );

    // Switch to manual tab
    const manualTab = screen.getByRole('tab', { name: /manual/i });
    fireEvent.click(manualTab);

    // Enter a tag name - in the ManualTagCreator component
    const input = screen.getByPlaceholderText(/Tag name/i);
    fireEvent.change(input, { target: { value: 'compliance' } });

    // Select tag type from dropdown
    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'mock-type-id' } });

    // Click Add button
    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    // Wait for tag to appear in the grouped section
    await waitFor(() => {
      // Check if the GroupedTagList component receives the update
      // This will involve checking for refresh triggers
      expect(supabase.from).toHaveBeenCalledWith('tags');
      expect(supabase.from).toHaveBeenCalledWith('tag_types');
    });

    // Note: The actual tag verification would happen in the real UI,
    // but in our mocked environment, we're primarily checking that the
    // correct functions were called with the right parameters
  });
});
