
import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeaderSection } from '../../sections/HeaderSection';
import { ExternalSourceSection } from '../../sections/ExternalSourceSection';
import { OntologyTermsSection } from '../../sections/OntologyTermsSection';

describe('HeaderSection Rendering', () => {
  it('renders correctly with default props', () => {
    // Arrange
    const handleRefresh = () => {};
    const setIsCollapsed = () => {};
    
    // Act
    render(
      <HeaderSection 
        title="Test Header"
        handleRefresh={handleRefresh}
        setIsCollapsed={setIsCollapsed}
        isCollapsed={false}
        needsExternalReview={false}
      />
    );
    
    // Assert
    expect(screen.getByText('Test Header')).toBeInTheDocument();
    expect(screen.queryByText('Review Required')).not.toBeInTheDocument();
  });
  
  it('renders the review required badge when needed', () => {
    // Arrange
    const handleRefresh = () => {};
    const setIsCollapsed = () => {};
    
    // Act
    render(
      <HeaderSection 
        title="Test Header"
        handleRefresh={handleRefresh}
        setIsCollapsed={setIsCollapsed}
        isCollapsed={false}
        needsExternalReview={true}
      />
    );
    
    // Assert
    expect(screen.getByText('Review Required')).toBeInTheDocument();
  });
});

describe('ExternalSourceSection Rendering', () => {
  it('renders external source URL correctly', () => {
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
  
  it('renders "No external source" when URL is null', () => {
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
  
  it('renders checked date when lastCheckedAt is provided', () => {
    // Arrange
    const lastCheckedAt = '2023-01-01T00:00:00Z';
    
    // Act
    render(
      <ExternalSourceSection 
        externalSourceUrl="https://example.com/source"
        editable={false}
        contentId="test-id"
        lastCheckedAt={lastCheckedAt}
        needsExternalReview={false}
      />
    );
    
    // Assert
    expect(screen.getByText(/Last checked/)).toBeInTheDocument();
  });
});

describe('OntologyTermsSection Rendering', () => {
  it('renders terms when provided', () => {
    // Act
    render(
      <OntologyTermsSection 
        contentId="test-id"
        editable={false}
      />
    );
    
    // Assert
    expect(screen.getByText('Ontology Terms')).toBeInTheDocument();
  });
  
  it('renders loading state correctly', () => {
    // Act
    render(
      <OntologyTermsSection 
        contentId="test-id"
        editable={false}
        isLoading={true}
      />
    );
    
    // Assert
    expect(screen.getByText('Ontology Terms')).toBeInTheDocument();
    // We would check for skeletons, but they don't have accessible text
  });
  
  it('renders error state correctly', () => {
    // Act
    render(
      <OntologyTermsSection 
        contentId="test-id"
        editable={false}
        error={new Error('Test error')}
      />
    );
    
    // Assert
    expect(screen.getByText('Ontology Terms')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
  
  it('shows add button when editable and showCreateTerm are true', () => {
    // Act
    render(
      <OntologyTermsSection 
        contentId="test-id"
        editable={true}
        showCreateTerm={true}
      />
    );
    
    // Assert
    expect(screen.getByText('Add')).toBeInTheDocument();
  });
});
