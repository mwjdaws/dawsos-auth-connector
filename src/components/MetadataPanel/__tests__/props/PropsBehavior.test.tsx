
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExternalSourceSection } from '../../sections/ExternalSourceSection';

describe('ExternalSourceSection Props Behavior', () => {
  it('displays external source URL when provided', () => {
    // Arrange
    const externalSourceUrl = 'https://example.com/source';
    
    // Act
    render(
      <ExternalSourceSection 
        externalSource={{
          external_source_url: externalSourceUrl,
          needs_external_review: false,
          external_source_checked_at: "2023-01-01T00:00:00Z"
        }}
        editable={false}
        contentId="test-id"
      />
    );
    
    // Assert
    expect(screen.getByText(externalSourceUrl)).toBeInTheDocument();
  });
  
  it('displays "No external source" when URL is not provided', () => {
    // Act
    render(
      <ExternalSourceSection 
        externalSource={{
          external_source_url: null,
          needs_external_review: false,
          external_source_checked_at: null
        }}
        editable={false}
        contentId="test-id"
      />
    );
    
    // Assert
    expect(screen.getByText(/No external source URL specified/i)).toBeInTheDocument();
  });
  
  it('shows edit buttons when editable is true', () => {
    // Act
    render(
      <ExternalSourceSection 
        externalSource={{
          external_source_url: "https://example.com/source",
          needs_external_review: false,
          external_source_checked_at: "2023-01-01T00:00:00Z"
        }}
        editable={true}
        contentId="test-id"
      />
    );
    
    // Assert
    expect(screen.getByText('Edit URL')).toBeInTheDocument();
  });
  
  it('hides edit buttons when editable is false', () => {
    // Act
    render(
      <ExternalSourceSection 
        externalSource={{
          external_source_url: "https://example.com/source", 
          needs_external_review: false,
          external_source_checked_at: "2023-01-01T00:00:00Z"
        }}
        editable={false}
        contentId="test-id"
      />
    );
    
    // Assert
    expect(screen.queryByText('Edit URL')).not.toBeInTheDocument();
  });
});
