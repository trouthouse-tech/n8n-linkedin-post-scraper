// Type definitions for n8n workflow structure

export interface WorkflowNode {
  parameters: Record<string, any>;
  type: string;
  typeVersion: number;
  position: [number, number];
  id: string;
  name: string;
  credentials?: Record<string, {
    id: string;
    name: string;
  }>;
}

export interface Connection {
  node: string;
  type: string;
  index: number;
}

export interface WorkflowConnections {
  [nodeName: string]: {
    main: Connection[][];
  };
}

export interface WorkflowConfig {
  name: string;
  active: boolean;
  settings: {
    executionOrder: string;
  };
}

export interface Workflow {
  name: string;
  nodes: WorkflowNode[];
  pinData: Record<string, any>;
  connections: WorkflowConnections;
  active: boolean;
  settings: {
    executionOrder: string;
  };
}

// Environment-specific configuration
export interface WorkflowEnvironment {
  apifyToken?: string;
  linkedinUsername?: string;
  googleSheetId?: string;
  googleSheetName?: string;
  googleCredentialId?: string;
  googleCredentialName?: string;
}

