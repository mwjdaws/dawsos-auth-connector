
/**
 * Build Helper Utility
 * 
 * This helper provides functions to programmatically work with different
 * TypeScript configurations in the project.
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

/**
 * Runs a TypeScript build using the specified tsconfig file
 * 
 * @param configPath Path to the tsconfig file
 * @param additionalArgs Additional arguments to pass to tsc
 * @returns Output from the build process
 */
export function runTsBuild(configPath: string, additionalArgs: string = ''): string {
  try {
    const command = `tsc -p ${configPath} ${additionalArgs}`;
    console.log(`Running: ${command}`);
    
    const output = execSync(command, { encoding: 'utf-8' });
    console.log('Build completed successfully');
    return output;
  } catch (error) {
    console.error('Build failed:', error);
    throw error;
  }
}

/**
 * Helper function to read and parse a tsconfig file
 * 
 * @param configPath Path to the tsconfig file
 * @returns Parsed tsconfig object
 */
export function readTsConfig(configPath: string): any {
  try {
    const configFile = path.resolve(process.cwd(), configPath);
    const configContent = fs.readFileSync(configFile, 'utf-8');
    return JSON.parse(configContent);
  } catch (error) {
    console.error(`Failed to read tsconfig at ${configPath}:`, error);
    throw error;
  }
}

/**
 * Example usage in a Node.js script:
 * 
 * ```
 * // Build using production configuration
 * runTsBuild('./tsconfig.build.json');
 * 
 * // Read the production config
 * const prodConfig = readTsConfig('./tsconfig.build.json');
 * console.log('Production config:', prodConfig);
 * ```
 */
