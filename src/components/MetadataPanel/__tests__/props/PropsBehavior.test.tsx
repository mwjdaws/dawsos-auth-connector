
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import { ExternalSourceSection } from '../../sections/ExternalSourceSection';
import { DomainSection } from '../../sections/DomainSection';
import { 
  ExternalSourceSectionTestProps,
  DomainSectionTestProps
} from '@/utils/test-types';

describe('MetadataPanel Props Behavior', () => {
  // Test ExternalSourceSection prop behaviors
  describe('ExternalSourceSection', () => {
    const renderExternalSourceSection = ({
      externalSourceUrl,
      editable,
      contentId,
      lastCheckedAt,
      needsExternalReview
    }: ExternalSourceSectionTestProps) => {
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

    test('should show edit button when editable is true', () => {
      renderExternalSourceSection({
        externalSourceUrl: 'https://example.com',
        editable: true,
        contentId: 'content-123'
      });
      expect(screen.getByLabelText(/edit external source/i)).toBeInTheDocument();
    });

    test('should not show edit button when editable is false', () => {
      renderExternalSourceSection({
        externalSourceUrl: 'https://example.com',
        editable: false,
        contentId: 'content-123'
      });
      expect(screen.queryByLabelText(/edit external source/i)).not.toBeInTheDocument();
    });
  });

  // Test DomainSection prop behaviors
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

    test('should display "None" when domain is null', () => {
      renderDomainSection({
        domain: null
      });
      expect(screen.getByText('None')).toBeInTheDocument();
    });

    test('should display domain name when provided', () => {
      renderDomainSection({
        domain: 'Web Development'
      });
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });
  });
});
