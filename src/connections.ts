import { WorkflowConnections } from './types';

/**
 * Defines the connections between nodes in the workflow
 * This is generic and doesn't require environment-specific values
 */
export const connections: WorkflowConnections = {
  "When clicking 'Execute workflow'": {
    main: [
      [
        {
          node: 'HTTP Request',
          type: 'main',
          index: 0,
        },
      ],
    ],
  },
  'HTTP Request': {
    main: [
      [
        {
          node: 'Append row in sheet',
          type: 'main',
          index: 0,
        },
      ],
    ],
  },
  'Append row in sheet': {
    main: [[]],
  },
};

