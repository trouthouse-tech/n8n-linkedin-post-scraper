#!/usr/bin/env ts-node

import { writeFileSync } from 'fs';
import { join } from 'path';
import { exportWorkflowJSON } from './src/workflow';
import { WorkflowEnvironment } from './src/types';

/**
 * Script to generate the workflow JSON file
 * Usage: ts-node generate.ts
 * 
 * Set environment variables or modify the config below
 */

// Load environment-specific configuration
// You can also use process.env to read from environment variables
const environment: WorkflowEnvironment = {
  apifyToken: process.env.APIFY_TOKEN || undefined,
  linkedinUsername: process.env.LINKEDIN_USERNAME || undefined,
  googleSheetId: process.env.GOOGLE_SHEET_ID || undefined,
  googleSheetName: process.env.GOOGLE_SHEET_NAME || 'Data',
  googleCredentialId: process.env.GOOGLE_CREDENTIAL_ID || undefined,
  googleCredentialName: process.env.GOOGLE_CREDENTIAL_NAME || undefined,
};

// Generate the workflow
const workflowJSON = exportWorkflowJSON(environment);

// Write to file
const outputPath = join(process.cwd(), 'workflow.json');
writeFileSync(outputPath, workflowJSON, 'utf-8');

console.log(`✅ Workflow generated successfully: ${outputPath}`);
console.log('\n📝 Next steps:');
console.log('1. Set your environment variables (APIFY_TOKEN, LINKEDIN_USERNAME, GOOGLE_SHEET_ID, etc.)');
console.log('2. Run: npm run generate');
console.log('3. Import workflow.json into n8n');

