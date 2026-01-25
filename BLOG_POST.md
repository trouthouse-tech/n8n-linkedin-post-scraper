# Basic n8n Template: Scraping LinkedIn Profile Posts

**Stop hardcoding API keys in your n8n workflows.** Learn how to build a maintainable, code-driven n8n workflow that scrapes LinkedIn posts and saves them to Google Sheets—without exposing your secrets.

---

## The Problem with Traditional n8n Workflows

I love n8n, but let's be honest: managing workflows as JSON files is painful.

You export a workflow, and you get this:

```json
{
  "parameters": {
    "url": "https://api.example.com?token=sk_live_ABC123SECRET"
  }
}
```

Now you're stuck with:
- ❌ API keys committed to git
- ❌ Can't reuse across dev/staging/prod
- ❌ Difficult to review code changes
- ❌ Can't share workflows publicly

**There has to be a better way.**

## The Solution: Code-Driven n8n Workflows

What if you could write your n8n workflows in TypeScript, with:
- ✅ Environment variables for secrets
- ✅ Full type safety
- ✅ Modular, testable code
- ✅ Clean git diffs

That's exactly what I built with this LinkedIn post scraper template.

## What Does This Workflow Do?

This workflow is dead simple:

1. **Trigger**: Click a button (or schedule it)
2. **Fetch**: Get LinkedIn posts from a profile via Apify API
3. **Save**: Append posts to a Google Sheet

```
Manual Trigger → Apify API → Google Sheets
```

Perfect for:
- Tracking competitor posts
- Monitoring influencer content
- Building a content database
- Analyzing posting patterns

## The Code-Driven Approach

Instead of one giant JSON file, the workflow is organized into modules:

```
src/
  ├── types.ts         # Environment variables & types
  ├── config.ts        # Workflow name & settings
  ├── nodes.ts         # Your n8n nodes
  ├── connections.ts   # How nodes connect
  └── workflow.ts      # Generator (don't touch this)
```

### Example: Adding Environment Variables

**types.ts**
```typescript
export interface WorkflowEnvironment {
  apifyToken?: string;
  linkedinUsername?: string;
  googleSheetId?: string;
}
```

**nodes.ts**
```typescript
{
  parameters: {
    method: 'POST',
    url: env.apifyToken 
      ? `https://api.apify.com/...?token=${env.apifyToken}`
      : 'https://api.apify.com/...?token=YOUR_TOKEN',
    sendBody: true,
    bodyParameters: {
      parameters: [
        {
          name: 'username',
          value: env.linkedinUsername || 'YOUR_USERNAME',
        },
      ],
    },
  },
  type: 'n8n-nodes-base.httpRequest',
  name: 'Fetch LinkedIn Posts',
}
```

No secrets in code. Ever.

## Quick Start Guide

### 1. Clone the Template

```bash
git clone https://github.com/trouthouse-tech/n8n-linkedin-post-scraper.git
cd n8n-linkedin-post-scraper
npm install
```

### 2. Set Up Your Environment

Create a `.env` file:

```env
APIFY_TOKEN=apify_api_YourTokenHere
LINKEDIN_USERNAME=your-username
GOOGLE_SHEET_ID=1MobvUIVauf...
GOOGLE_CREDENTIAL_ID=DYYHNCStmXqBErXM
GOOGLE_CREDENTIAL_NAME=Google Sheets account
```

### 3. Generate the Workflow

```bash
npm run generate
```

This creates a `workflow.json` with your environment variables injected.

### 4. Import to n8n

1. Open your n8n instance
2. Go to **Workflows** → **Import from File**
3. Select `workflow.json`
4. Test and activate!

## How to Get Your Credentials

### Apify Token

1. Sign up at [apify.com](https://apify.com)
2. Go to **Settings** → **Integrations** → **API tokens**
3. Copy your token

### LinkedIn Username

Your LinkedIn username is in your profile URL:
```
https://www.linkedin.com/in/your-username/
                              ^^^^^^^^^^^^
```

### Google Sheet ID

Your Google Sheet ID is in the URL:
```
https://docs.google.com/spreadsheets/d/1MobvUIVauf.../edit
                                         ^^^^^^^^^^^^^^^
```

### Google Credentials (n8n)

1. In n8n, create a Google Sheets credential
2. Export a test workflow that uses it
3. Find the credential ID in the exported JSON
4. Add it to your `.env`

## Customize for Your Needs

### Change the LinkedIn Username

Just update your `.env`:

```env
LINKEDIN_USERNAME=satyanadella
```

Run `npm run generate` and re-import to n8n.

### Add More Columns

Edit `src/nodes.ts` and add to the `columns.value` object:

```typescript
columns: {
  mappingMode: 'defineBelow',
  value: {
    Date: '={{ $json.posted_at.date }}',
    URL: '={{ $json.url }}',
    Text: '={{ $json.text }}',
    Id: '={{ $json.full_urn }}',
    Likes: '={{ $json.stats.like }}',        // ← New
    Comments: '={{ $json.stats.comments }}', // ← New
  },
}
```

### Schedule the Workflow

Replace the manual trigger in `src/nodes.ts`:

```typescript
{
  parameters: {
    rule: {
      interval: [
        {
          field: 'cronExpression',
          expression: '0 9 * * *', // 9 AM daily
        },
      ],
    },
  },
  type: 'n8n-nodes-base.scheduleTrigger',
  typeVersion: 1.2,
  position: [0, 0],
  id: generateNodeId('schedule-trigger'),
  name: 'Daily Schedule',
}
```

## Why This Approach Wins

### 1. Security by Default

**Before:**
```json
"url": "https://api.example.com?token=secret123"
```

**After:**
```typescript
url: env.apiToken 
  ? `https://api.example.com?token=${env.apiToken}`
  : 'https://api.example.com?token=YOUR_TOKEN'
```

Secrets never touch git.

### 2. Multiple Environments

**Before:** 3 separate workflow files (dev, staging, prod)

**After:** One codebase, three `.env` files:
```bash
# Development
cp .env.dev .env && npm run generate

# Production  
cp .env.prod .env && npm run generate
```

### 3. Clean Git History

**JSON Workflow:**
```diff
- "position": [200, 0],
+ "position": [220, 0],
- "id": "abc-123-def-456",
+ "id": "xyz-789-ghi-012",
```

What changed? Who knows.

**Code-Driven:**
```diff
  parameters: {
-   method: 'GET',
+   method: 'POST',
+   sendBody: true,
  }
```

Crystal clear.

### 4. Team Collaboration

**Developer A:** Adds a node in `src/nodes.ts`  
**Developer B:** Updates `src/connections.ts`  
**Git:** No conflicts! ✅

With JSON workflows, any change causes merge conflicts.

## Real-World Use Cases

### Content Research Dashboard

Track what your competitors or influencers are posting:

```typescript
// Track multiple people
const profiles = [
  'satyanadella',
  'billgates',
  'sundarpichai',
];
```

### Engagement Analysis

Modify the workflow to track engagement over time:

```typescript
columns: {
  value: {
    Date: '={{ $json.posted_at.date }}',
    Text: '={{ $json.text }}',
    Likes: '={{ $json.stats.like }}',
    Comments: '={{ $json.stats.comments }}',
    Reposts: '={{ $json.stats.reposts }}',
    EngagementRate: '={{ ($json.stats.like + $json.stats.comments) / 1000 }}',
  },
}
```

### Automated Reporting

Schedule the workflow to run daily, then use Google Sheets to:
- Create charts
- Share with team
- Trigger alerts on spikes

## Common Issues & Solutions

### Issue: "APIFY_TOKEN not found"

Make sure you've created a `.env` file and it's in the same directory as `generate.ts`.

### Issue: Google Sheets credentials not working

The credential ID must be from **your n8n instance**. You can't reuse credentials across different n8n installations.

### Issue: Empty data returned

Check that the LinkedIn username is correct and public. Private profiles won't work.

## Advanced: Extend the Template

This template is just a starting point. Here are some ideas:

### Add Error Handling

```typescript
{
  parameters: {
    jsCode: `
      try {
        return $input.all();
      } catch (error) {
        // Send alert to Slack
        // Log to database
        // Return empty array to prevent workflow failure
        return [];
      }
    `,
  },
  type: 'n8n-nodes-base.code',
  name: 'Error Handler',
}
```

### Add Data Transformation

```typescript
{
  parameters: {
    jsCode: `
      return $input.all().map(item => ({
        json: {
          ...item.json,
          // Extract hashtags
          hashtags: item.json.text.match(/#\\w+/g) || [],
          // Calculate engagement rate
          engagementRate: (
            item.json.stats.like + 
            item.json.stats.comments
          ) / item.json.stats.total_reactions,
        }
      }));
    `,
  },
  type: 'n8n-nodes-base.code',
  name: 'Transform Data',
}
```

### Add Multiple Destinations

Not just Google Sheets—save to:
- Notion
- Airtable
- PostgreSQL
- MongoDB

Just add more nodes in `src/nodes.ts` and connect them in `src/connections.ts`.

## The Template Pattern

This isn't just for LinkedIn scraping. Use this pattern for **any** n8n workflow:

1. Clone the template
2. Update `src/types.ts` with your env vars
3. Replace nodes in `src/nodes.ts`
4. Update connections in `src/connections.ts`
5. Generate and import

You now have a **reusable, maintainable, secure** n8n workflow.

## Source Code

The full source code is available on GitHub:

👉 [github.com/trouthouse-tech/n8n-linkedin-post-scraper](https://github.com/trouthouse-tech/n8n-linkedin-post-scraper)

The base template (for any workflow):

👉 [github.com/trouthouse-tech/n8n-workflow-template](https://github.com/trouthouse-tech/n8n-workflow-template)

## Conclusion

Stop treating n8n workflows like black-box JSON files.

With this code-driven approach:
- Your secrets stay secret
- Your workflows are maintainable
- Your team can collaborate
- Your git history makes sense

The LinkedIn post scraper is just one example. Use this pattern for **any** n8n workflow you build.

**Ready to get started?**

```bash
git clone https://github.com/trouthouse-tech/n8n-linkedin-post-scraper.git
cd n8n-linkedin-post-scraper
npm install
# Create .env with your credentials
npm run generate
# Import workflow.json to n8n
```

Happy automating! 🚀

---

*Questions? Find me on [Twitter](https://twitter.com/yourhandle) or open an issue on [GitHub](https://github.com/trouthouse-tech/n8n-linkedin-post-scraper/issues).*

