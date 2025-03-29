
/**
 * This is an entry point for MetadataPanel tests.
 * Each test concern has been split into its own file/directory.
 * 
 * This file doesn't contain tests itself, but imports the test files
 * to ensure they're included in the test run.
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
