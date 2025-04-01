
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { HeaderSection } from '../../sections/HeaderSection';
import { vi } from 'vitest';

describe('HeaderSection', () => {
  it('calls handleRefresh when refresh button is clicked', () => {
    // Arrange
    const handleRefresh = vi.fn();
    const setIsCollapsed = vi.fn();
    
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
    
    // Find the refresh button
    const refreshButton = screen.getByLabelText('Refresh metadata');
    
    // Click the refresh button
    fireEvent.click(refreshButton);
    
    // Assert
    expect(handleRefresh).toHaveBeenCalledTimes(1);
  });
  
  it('toggles collapse state when collapse button is clicked', () => {
    // Arrange
    const handleRefresh = vi.fn();
    const setIsCollapsed = vi.fn();
    
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
    
    // Find and click the collapse button
    const collapseButton = screen.getByLabelText('Toggle panel');
    fireEvent.click(collapseButton);
    
    // Assert
    expect(setIsCollapsed).toHaveBeenCalledWith(true);
  });
  
  it('displays review required badge when needsExternalReview is true', () => {
    // Arrange
    const handleRefresh = vi.fn();
    const setIsCollapsed = vi.fn();
    
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
