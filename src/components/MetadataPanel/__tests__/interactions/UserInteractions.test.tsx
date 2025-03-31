
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import { HeaderSection } from '../../sections/HeaderSection';
import { TagsSection } from '../../sections/TagsSection';
import { HeaderSectionTestProps, TagsSectionTestProps, TestTag, toTag } from '@/utils/test-types';

describe('MetadataPanel User Interactions', () => {
  // Test HeaderSection interactions
  describe('HeaderSection', () => {
    const renderHeaderSection = ({
      title,
      handleRefresh,
      setIsCollapsed,
      isCollapsed
    }: HeaderSectionTestProps) => {
      return render(
        <HeaderSection
          title={title}
          handleRefresh={handleRefresh}
          setIsCollapsed={setIsCollapsed}
          isCollapsed={isCollapsed}
        />
      );
    };

    test('should call setIsCollapsed when collapse button is clicked', () => {
      const setIsCollapsed = vi.fn();
      renderHeaderSection({
        title: "Content Metadata",
        handleRefresh: vi.fn(),
        setIsCollapsed,
        isCollapsed: false
      });

      const collapseButton = screen.getByLabelText(/toggle panel/i);
      fireEvent.click(collapseButton);

      expect(setIsCollapsed).toHaveBeenCalledWith(true);
    });
  });

  // Test TagsSection interactions
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

    test('should update newTag when input value changes', () => {
      const setNewTag = vi.fn();
      renderTagsSection({
        tags: tags.map(tag => toTag(tag)),
        editable: true,
        newTag: '',
        setNewTag,
        onAddTag: vi.fn().mockResolvedValue(undefined),
        onDeleteTag: vi.fn().mockResolvedValue(undefined),
        contentId: 'content-123'
      });

      const input = screen.getByPlaceholderText(/add a tag/i);
      fireEvent.change(input, { target: { value: 'New Tag' } });

      expect(setNewTag).toHaveBeenCalledWith('New Tag');
    });
  });
});
