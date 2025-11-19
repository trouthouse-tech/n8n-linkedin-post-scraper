import { WorkflowNode, WorkflowEnvironment } from './types';

/**
 * Generates all nodes for the workflow
 * Environment-specific values are passed as parameters
 */
export const createNodes = (env: WorkflowEnvironment): WorkflowNode[] => {
  return [
    // 1. Manual Trigger Node
    {
      parameters: {},
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: [0, 0],
      id: generateNodeId('manual-trigger'),
      name: "When clicking 'Execute workflow'",
    },

    // 2. HTTP Request to Apify API
    {
      parameters: {
        method: 'POST',
        url: env.apifyToken 
          ? `https://api.apify.com/v2/acts/apimaestro~linkedin-profile-posts/run-sync-get-dataset-items?token=${env.apifyToken}`
          : 'https://api.apify.com/v2/acts/apimaestro~linkedin-profile-posts/run-sync-get-dataset-items?token=YOUR_APIFY_TOKEN',
        sendBody: true,
        bodyParameters: {
          parameters: [
            {
              name: 'username',
              value: env.linkedinUsername || 'YOUR_LINKEDIN_USERNAME',
            },
          ],
        },
        options: {},
      },
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [208, 0],
      id: generateNodeId('http-request'),
      name: 'HTTP Request',
    },

    // 3. Google Sheets Append Node
    {
      parameters: {
        operation: 'append',
        documentId: {
          __rl: true,
          value: env.googleSheetId || 'YOUR_GOOGLE_SHEET_ID',
          mode: 'id',
        },
        sheetName: {
          __rl: true,
          value: 'gid=0',
          mode: 'list',
          cachedResultName: env.googleSheetName || 'Data',
          cachedResultUrl: env.googleSheetId 
            ? `https://docs.google.com/spreadsheets/d/${env.googleSheetId}/edit#gid=0`
            : 'https://docs.google.com/spreadsheets/d/YOUR_GOOGLE_SHEET_ID/edit#gid=0',
        },
        columns: {
          mappingMode: 'defineBelow',
          value: {
            Date: '={{ $json.posted_at.date }}',
            URL: '={{ $json.url }}',
            Text: '={{ $json.text }}',
            Id: '={{ $json.full_urn }}',
          },
          matchingColumns: [],
          schema: [
            {
              id: 'Id',
              displayName: 'Id',
              required: false,
              defaultMatch: false,
              display: true,
              type: 'string',
              canBeUsedToMatch: true,
            },
            {
              id: 'Date',
              displayName: 'Date',
              required: false,
              defaultMatch: false,
              display: true,
              type: 'string',
              canBeUsedToMatch: true,
            },
            {
              id: 'Text',
              displayName: 'Text',
              required: false,
              defaultMatch: false,
              display: true,
              type: 'string',
              canBeUsedToMatch: true,
            },
            {
              id: 'URL',
              displayName: 'URL',
              required: false,
              defaultMatch: false,
              display: true,
              type: 'string',
              canBeUsedToMatch: true,
            },
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
        options: {},
      },
      type: 'n8n-nodes-base.googleSheets',
      typeVersion: 4.7,
      position: [448, 0],
      id: generateNodeId('google-sheets-append'),
      name: 'Append row in sheet',
      credentials: env.googleCredentialId && env.googleCredentialName
        ? {
            googleSheetsOAuth2Api: {
              id: env.googleCredentialId,
              name: env.googleCredentialName,
            },
          }
        : undefined,
    },
  ];
};

/**
 * Generates a deterministic node ID based on a seed
 * In production, you might want to use actual UUIDs
 */
function generateNodeId(seed: string): string {
  // Simple hash function for demonstration
  // In production, use crypto.randomUUID() or a proper UUID library
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `node-${Math.abs(hash).toString(16)}`;
}

