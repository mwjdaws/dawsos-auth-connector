
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
        externalSourceUrl={externalSourceUrl}
        editable={false}
        contentId="test-id"
        lastCheckedAt="2023-01-01T00:00:00Z"
        needsExternalReview={false}
      />
    );
    
    // Assert
    expect(screen.getByText(externalSourceUrl)).toBeInTheDocument();
  });
  
  it('displays "No external source" when URL is not provided', () => {
    // Act
    render(
      <ExternalSourceSection 
        externalSourceUrl={null}
        editable={false}
        contentId="test-id"
        lastCheckedAt={null}
        needsExternalReview={false}
      />
    );
    
    // Assert
    expect(screen.getByText('No external source')).toBeInTheDocument();
  });
  
  it('shows edit buttons when editable is true', () => {
    // Act
    render(
      <ExternalSourceSection 
        externalSourceUrl="https://example.com/source"
        editable={true}
        contentId="test-id"
        lastCheckedAt="2023-01-01T00:00:00Z"
        needsExternalReview={false}
      />
    );
    
    // Assert
    expect(screen.getByLabelText('Edit external source')).toBeInTheDocument();
  });
  
  it('hides edit buttons when editable is false', () => {
    // Act
    render(
      <ExternalSourceSection 
        externalSourceUrl="https://example.com/source"
        editable={false}
        contentId="test-id"
        lastCheckedAt="2023-01-01T00:00:00Z"
        needsExternalReview={false}
      />
    );
    
    // Assert
    expect(screen.queryByLabelText('Edit external source')).not.toBeInTheDocument();
  });
});
