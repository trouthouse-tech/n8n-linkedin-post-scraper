# n8n LinkedIn Post Scraper

A **generic, modular n8n workflow** for scraping LinkedIn posts and saving them to Google Sheets.

This workflow is designed to be environment-agnostic with all sensitive keys and IDs externalized.

## 🎯 Features

- **Modular Structure**: Separated into types, config, nodes, and connections
- **Environment Variables**: No hardcoded API keys or IDs
- **TypeScript**: Full type safety and autocompletion
- **Reusable**: Easy to adapt for different use cases
- **Version Control Friendly**: Sensitive data stays out of git

## 📁 Project Structure

```
├── src/
│   ├── types.ts         # TypeScript type definitions
│   ├── config.ts        # Workflow-level configuration
│   ├── nodes.ts         # Node definitions (parameterized)
│   ├── connections.ts   # Connection definitions
│   ├── workflow.ts      # Main workflow generator
│   └── index.ts         # Exports
├── generate.ts          # CLI script to generate workflow JSON
├── .env.example         # Environment variables template
├── existing.json        # Original workflow (for reference)
├── workflow.json        # Generated workflow (gitignored)
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
APIFY_TOKEN=apify_api_YourTokenHere
GOOGLE_SHEET_ID=1MobvUIVaufSx2a2otH0bkz1Fm_DNwwEy...
GOOGLE_SHEET_NAME=Data
GOOGLE_CREDENTIAL_ID=DYYHNCStmXqBErXM
GOOGLE_CREDENTIAL_NAME=Google Sheets account 2
```

### 3. Generate the Workflow

```bash
npm run generate
```

This will create a `workflow.json` file that you can import into n8n.

### 4. Import into n8n

1. Open your n8n instance
2. Go to **Workflows** → **Import from File**
3. Select the generated `workflow.json`
4. Verify credentials and connections
5. Activate the workflow

## 🛠️ Development

### Modifying the Workflow

Each component is in a separate file for easy maintenance:

- **Add/Remove Nodes**: Edit `src/nodes.ts`
- **Change Connections**: Edit `src/connections.ts`
- **Update Workflow Settings**: Edit `src/config.ts`
- **Add New Environment Variables**: Update `src/types.ts` and `generate.ts`

### Using Programmatically

You can also use this as a library:

```typescript
import { generateWorkflow, WorkflowEnvironment } from './src';

const env: WorkflowEnvironment = {
  apifyToken: 'your-token',
  googleSheetId: 'your-sheet-id',
  // ...
};

const workflow = generateWorkflow(env);
console.log(JSON.stringify(workflow, null, 2));
```

## 📝 Workflow Overview

This workflow consists of three nodes:

1. **Manual Trigger**: Start the workflow manually
2. **HTTP Request**: Fetch LinkedIn posts from Apify API
3. **Google Sheets**: Append posts to a Google Sheet

### Data Flow

```
Manual Trigger → HTTP Request (Apify) → Google Sheets Append
```

## 🔐 Security Notes

- **Never commit** `.env` or `workflow.json` with sensitive data
- The `existing.json` contains your original workspace-specific IDs - keep it private
- Use environment variables for all sensitive configuration
- Consider using n8n's built-in credential management

## 🤝 Contributing

Feel free to modify this workflow for your needs. The modular structure makes it easy to:

- Add new nodes
- Change data sources
- Modify data transformations
- Add error handling
- Implement retry logic

## 📄 License

MIT
