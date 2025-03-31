
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeaderSection } from '../../sections/HeaderSection';
import { TagsSection } from '../../sections/TagsSection';
import { HeaderSectionTestProps, TagsSectionTestProps, TestTag } from '@/utils/test-types';

describe('MetadataPanel User Interactions', () => {
  // Test HeaderSection interactions
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

    it('should call setIsCollapsed when collapse button is clicked', () => {
      const setIsCollapsed = jest.fn();
      renderHeaderSection({
        handleRefresh: jest.fn(),
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

    it('should update newTag when input value changes', () => {
      const setNewTag = jest.fn();
      renderTagsSection({
        tags,
        editable: true,
        newTag: '',
        setNewTag,
        onAddTag: jest.fn().mockResolvedValue(undefined),
        onDeleteTag: jest.fn().mockResolvedValue(undefined)
      });

      const input = screen.getByPlaceholderText(/add a tag/i);
      fireEvent.change(input, { target: { value: 'New Tag' } });

      expect(setNewTag).toHaveBeenCalledWith('New Tag');
    });
  });
});
