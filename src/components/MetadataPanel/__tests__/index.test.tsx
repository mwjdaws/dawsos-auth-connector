
import React from 'react';
import { vi, describe, test, expect } from 'vitest';

/**
 * This is an entry point for MetadataPanel tests.
 * Each test concern has been split into its own file/directory to maintain
 * a clean and organized test structure.
 * 
 * Benefits of this approach:
 * - Better organization of test cases by concern
 * - Easier maintenance when specific aspects need updates
 * - Improved readability by grouping related tests
 * - Facilitates parallel test execution
 */

// Import all test files to ensure they're included in the test run
import './rendering/BasicRendering.test';
import './states/LoadingErrorStates.test';
import './interactions/UserInteractions.test';
import './props/PropsBehavior.test';

// This is just an empty test to satisfy some test runners
describe('MetadataPanel Tests', () => {
  test('tests are imported', () => {
    expect(true).toBeTruthy();
  });
});
