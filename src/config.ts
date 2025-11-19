import { WorkflowConfig } from './types';

/**
 * Workflow-level configuration
 * These are generic settings that can be used across different instances
 */
export const workflowConfig: WorkflowConfig = {
  name: 'Get LinkedIn and Twitter Posts',
  active: false,
  settings: {
    executionOrder: 'v1',
  },
};

