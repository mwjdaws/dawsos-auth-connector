
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import { HeaderSection } from '../../sections/HeaderSection';
import { ExternalSourceSection } from '../../sections/ExternalSourceSection';
import { TagsSection } from '../../sections/TagsSection';
import { OntologySection } from '../../sections/OntologySection';
import { ContentIdSection } from '../../sections/ContentIdSection';
import { DomainSection } from '../../sections/DomainSection';
import { 
  HeaderSectionTestProps,
  ExternalSourceSectionTestProps,
  TagsSectionTestProps,
  OntologySectionTestProps,
  ContentIdSectionTestProps,
  DomainSectionTestProps,
  TestTag,
  toTag
} from '@/utils/test-types';

describe('MetadataPanel Basic Rendering', () => {
  // Test HeaderSection rendering
  describe('HeaderSection', () => {
    const renderHeaderSection = ({
      title,
      handleRefresh,
      setIsCollapsed,
      isCollapsed,
      needsExternalReview
    }: HeaderSectionTestProps) => {
      return render(
        <HeaderSection
          title={title}
          handleRefresh={handleRefresh}
          setIsCollapsed={setIsCollapsed}
          isCollapsed={isCollapsed}
          needsExternalReview={needsExternalReview}
        />
      );
    };

    test('should render the refresh button', () => {
      renderHeaderSection({
        title: "Content Metadata",
        handleRefresh: vi.fn(),
        setIsCollapsed: vi.fn(),
        isCollapsed: false
      });
      expect(screen.getByLabelText(/refresh metadata/i)).toBeInTheDocument();
    });
  });

  // Test ExternalSourceSection rendering
  describe('ExternalSourceSection', () => {
    const renderExternalSourceSection = ({
      externalSourceUrl,
      editable,
      contentId,
      lastCheckedAt,
      needsExternalReview
    }: Omit<ExternalSourceSectionTestProps, 'url'>) => {
      return render(
        <ExternalSourceSection
          externalSourceUrl={externalSourceUrl}
          editable={editable}
          contentId={contentId}
          lastCheckedAt={lastCheckedAt}
          needsExternalReview={needsExternalReview}
        />
      );
    };

    test('should display external source URL when provided', () => {
      renderExternalSourceSection({
        externalSourceUrl: 'https://example.com',
        editable: false,
        contentId: 'content-123'
      });
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
    });
  });

  // Test TagsSection rendering
  describe('TagsSection', () => {
    const tags: TestTag[] = [
      { id: '1', name: 'React', content_id: 'content-123', type_id: 'type-1' },
      { id: '2', name: 'TypeScript', content_id: 'content-123', type_id: 'type-2' }
    ];

    const renderTagsSection = ({
      tags,
      editable,
      newTag,
      setNewTag,
      onAddTag,
      onDeleteTag,
      contentId
    }: TagsSectionTestProps) => {
      return render(
        <TagsSection
          tags={tags}
          editable={editable}
          newTag={newTag}
          setNewTag={setNewTag}
          onAddTag={onAddTag}
          onDeleteTag={onDeleteTag}
          contentId={contentId}
        />
      );
    };

    test('should render tag list', () => {
      renderTagsSection({
        tags: tags.map(tag => toTag(tag)),
        editable: false,
        newTag: '',
        setNewTag: vi.fn(),
        onAddTag: vi.fn().mockResolvedValue(undefined),
        onDeleteTag: vi.fn().mockResolvedValue(undefined),
        contentId: 'content-123'
      });
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });
  });

  // Test OntologySection rendering
  describe('OntologySection', () => {
    const terms = [
      { id: 'term-1', term: 'React', description: 'A JavaScript library' },
      { id: 'term-2', term: 'TypeScript', description: 'JavaScript with types' }
    ];
    
    const renderOntologySection = ({
      terms,
      sourceId,
      editable
    }: OntologySectionTestProps) => {
      return render(
        <OntologySection
          terms={terms}
          sourceId={sourceId}
          editable={editable}
        />
      );
    };

    test('should render the ontology section', () => {
      renderOntologySection({
        terms,
        sourceId: 'source-123',
        editable: false
      });
      expect(screen.getByText(/ontology terms/i)).toBeInTheDocument();
    });
  });

  // Test ContentIdSection rendering
  describe('ContentIdSection', () => {
    const renderContentIdSection = ({
      contentId
    }: ContentIdSectionTestProps) => {
      return render(
        <ContentIdSection
          contentId={contentId}
        />
      );
    };

    test('should render the content ID', () => {
      renderContentIdSection({
        contentId: 'content-123'
      });
      expect(screen.getByText(/content-123/i)).toBeInTheDocument();
    });
  });

  // Test DomainSection rendering
  describe('DomainSection', () => {
    const renderDomainSection = ({
      domain
    }: DomainSectionTestProps) => {
      return render(
        <DomainSection
          domain={domain}
        />
      );
    };

    test('should render the domain when provided', () => {
      renderDomainSection({
        domain: 'Web Development'
      });
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    test('should display "None" when domain is null', () => {
      renderDomainSection({
        domain: null
      });
      expect(screen.getByText('None')).toBeInTheDocument();
    });
  });
});
