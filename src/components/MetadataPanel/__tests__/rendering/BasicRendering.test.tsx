
import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeaderSection } from '../../sections/HeaderSection';
import { ExternalSourceSection } from '../../sections/ExternalSourceSection';
import { OntologyTermsSection } from '../../sections/OntologyTermsSection';
import { OntologyTerm } from '@/types/ontology';

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
    const externalUrl = 'https://example.com/source';
    
    // Act
    render(
      <ExternalSourceSection 
        contentId="test-id"
        externalSource={{
          external_source_url: externalUrl,
          needs_external_review: false,
          external_source_checked_at: "2023-01-01T00:00:00Z"
        }}
        editable={false}
      />
    );
    
    // Assert
    expect(screen.getByText(externalUrl)).toBeInTheDocument();
  });
  
  it('renders "No external source" when URL is null', () => {
    // Act
    render(
      <ExternalSourceSection 
        contentId="test-id"
        externalSource={{
          external_source_url: null,
          needs_external_review: false,
          external_source_checked_at: null
        }}
        editable={false}
      />
    );
    
    // Assert
    expect(screen.getByText(/No external source URL specified/i)).toBeInTheDocument();
  });
  
  it('renders checked date when lastCheckedAt is provided', () => {
    // Arrange
    const lastCheckedAt = '2023-01-01T00:00:00Z';
    
    // Act
    render(
      <ExternalSourceSection 
        contentId="test-id"
        externalSource={{
          external_source_url: "https://example.com/source",
          needs_external_review: false,
          external_source_checked_at: lastCheckedAt
        }}
        editable={false}
      />
    );
    
    // Assert
    expect(screen.getByText(/Last checked/)).toBeInTheDocument();
  });
});

describe('OntologyTermsSection Rendering', () => {
  const mockOntologyTerms: OntologyTerm[] = [
    { 
      id: "term1", 
      term: "React", 
      description: "JavaScript library", 
      domain: "Programming",
      review_required: false
    },
    { 
      id: "term2", 
      term: "TypeScript", 
      description: "Typed JavaScript", 
      domain: "Programming",
      review_required: false
    }
  ];

  it('renders terms when provided', () => {
    // Act
    render(
      <OntologyTermsSection 
        contentId="test-id"
        editable={false}
        ontologyTerms={mockOntologyTerms}
      />
    );
    
    // Assert
    expect(screen.getByText('Ontology Terms')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });
  
  it('renders loading state correctly', () => {
    // Act
    render(
      <OntologyTermsSection 
        contentId="test-id"
        editable={false}
        ontologyTerms={[]}
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
        ontologyTerms={[]}
        error={new Error('Test error')}
      />
    );
    
    // Assert
    expect(screen.getByText('Ontology Terms')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
  
  it('shows add button when editable is true', () => {
    // Act
    render(
      <OntologyTermsSection 
        contentId="test-id"
        editable={true}
        ontologyTerms={[]}
        showCreateTerm={true}
      />
    );
    
    // Assert
    expect(screen.getByText('Add Term')).toBeInTheDocument();
  });
});
