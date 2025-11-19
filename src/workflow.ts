import { Workflow, WorkflowEnvironment } from './types';
import { workflowConfig } from './config';
import { createNodes } from './nodes';
import { connections } from './connections';

/**
 * Generates a complete n8n workflow JSON
 * @param env - Environment-specific configuration (API keys, IDs, etc.)
 * @returns Complete workflow object ready for n8n import
 */
export const generateWorkflow = (env: WorkflowEnvironment = {}): Workflow => {
  return {
    name: workflowConfig.name,
    nodes: createNodes(env),
    pinData: {},
    connections,
    active: workflowConfig.active,
    settings: workflowConfig.settings,
  };
};

/**
 * Exports the workflow as a JSON string
 * @param env - Environment-specific configuration
 * @returns JSON string ready to be saved to a file
 */
export const exportWorkflowJSON = (env: WorkflowEnvironment = {}): string => {
  return JSON.stringify(generateWorkflow(env), null, 2);
};

