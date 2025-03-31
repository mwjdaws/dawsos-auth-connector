
import React from 'react';
import { render, screen } from '@testing-library/react';
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
  TestTag
} from '@/utils/test-types';

describe('MetadataPanel Basic Rendering', () => {
  // Test HeaderSection rendering
  describe('HeaderSection', () => {
    const renderHeaderSection = ({
      handleRefresh,
      setIsCollapsed,
      isCollapsed
    }: HeaderSectionTestProps) => {
      return render(
        <HeaderSection
          handleRefresh={handleRefresh}
          setIsCollapsed={setIsCollapsed}
          isCollapsed={isCollapsed}
        />
      );
    };

    it('should render the refresh button', () => {
      renderHeaderSection({
        handleRefresh: jest.fn(),
        setIsCollapsed: jest.fn(),
        isCollapsed: false
      });
      expect(screen.getByLabelText(/refresh metadata/i)).toBeInTheDocument();
    });
  });

  // Test ExternalSourceSection rendering
  describe('ExternalSourceSection', () => {
    const renderExternalSourceSection = ({
      externalSourceUrl,
      editable
    }: ExternalSourceSectionTestProps) => {
      return render(
        <ExternalSourceSection
          externalSourceUrl={externalSourceUrl}
          editable={editable}
          contentId="content-123"
        />
      );
    };

    it('should display external source URL when provided', () => {
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
      { id: '1', name: 'React', content_id: 'content-123' },
      { id: '2', name: 'TypeScript', content_id: 'content-123' }
    ];

    const renderTagsSection = ({
      tags,
      editable,
      newTag,
      setNewTag,
      onAddTag,
      onDeleteTag
    }: TagsSectionTestProps) => {
      return render(
        <TagsSection
          tags={tags}
          editable={editable}
          newTag={newTag}
          setNewTag={setNewTag}
          onAddTag={onAddTag}
          onDeleteTag={onDeleteTag}
        />
      );
    };

    it('should render tag list', () => {
      renderTagsSection({
        tags,
        editable: false,
        newTag: '',
        setNewTag: jest.fn(),
        onAddTag: jest.fn().mockResolvedValue(undefined),
        onDeleteTag: jest.fn().mockResolvedValue(undefined)
      });
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });
  });

  // Test OntologySection rendering
  describe('OntologySection', () => {
    const renderOntologySection = ({
      sourceId,
      editable
    }: OntologySectionTestProps) => {
      return render(
        <OntologySection
          sourceId={sourceId}
          editable={editable}
        />
      );
    };

    it('should render the ontology section', () => {
      renderOntologySection({
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

    it('should render the content ID', () => {
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

    it('should render the domain when provided', () => {
      renderDomainSection({
        domain: 'Web Development'
      });
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });
  });
});
