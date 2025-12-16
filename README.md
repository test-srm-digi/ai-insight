# RSI - Release Security Intelligence

AI-powered security vulnerability analysis and prioritization platform that helps teams understand, prioritize, and fix security vulnerabilities.

## 🎯 Problem Statement

- Security teams spend most of their time prioritizing, only little fixing
- Most breaches exploit vulnerabilities that weren't prioritized correctly
- Non-technical stakeholders find it difficult to understand security reports
- 100-page security reports that executives don't read

## 💡 Solution

RSI (Release Security Intelligence) is an AI agent that provides:

1. **Release Risk Analysis** - Overall risk score with color-coded severity, natural language explanations, and AI-generated executive summaries
2. **Security Debt Insights Dashboard** - Aging analysis, debt accumulation rate, AI predictions, and cost analysis
3. **Contextual Priority Intelligence** - "Fix this first because..." with actual reasoning, quick wins, and noise identification
4. **Predictive Risk Indicators** - Dependency health scores, vulnerability trajectory, and release timing insights
5. **AI Assistant** - Natural language interface for asking questions about vulnerabilities

## 🏗️ Architecture

```
ai-insight/
├── client/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   └── package.json
├── server/                 # Node.js Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic & AI integration
│   │   └── data/           # Mock data
│   └── package.json
└── package.json            # Root package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS Account with Bedrock access

### 1. Clone and Install

```bash
cd ai-insight
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Configure AWS Credentials

Create a `.env` file in the `server` directory:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your AWS credentials:

```env
# AWS Bedrock Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_SESSION_TOKEN=your_session_token
AWS_REGION=us-east-1

# Server Configuration
PORT=5000
NODE_ENV=development

# Bedrock Model Configuration
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

### 3. Run the Application

From the root directory:

```bash
# Run both frontend and backend
npm run dev

# Or run them separately:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

### 4. Access the App

Open http://localhost:3000 in your browser.

## 🔑 AWS Bedrock Setup

### Getting AWS Credentials

1. Log into AWS SSO: https://d-90663973bb.awsapps.com/start/#
2. Select `Digicert-AWS-AI-TRUST-DEV` account
3. Click on `AWSAdministratorAccess`
4. Copy the environment variables (Option 1) or use AWS CLI SSO (Recommended)

### Using AWS CLI SSO (Recommended)

```bash
aws configure sso
# SSO start URL: https://d-90663973bb.awsapps.com/start/#
# SSO Region: us-east-1
```

### Available Bedrock Models

- `anthropic.claude-3-sonnet-20240229-v1:0` (Recommended)
- `anthropic.claude-3-haiku-20240307-v1:0` (Faster, cheaper)
- `anthropic.claude-3-opus-20240229-v1:0` (Most capable)

## 📡 API Endpoints

### Risk Analysis
- `POST /api/risk-analysis/analyze` - Run AI risk analysis on a release
- `GET /api/risk-analysis/score/:releaseId` - Get risk score for a release
- `POST /api/risk-analysis/compare` - Compare releases

### Security Debt
- `GET /api/security-debt/dashboard` - Get dashboard data
- `POST /api/security-debt/analyze` - AI analysis of security debt
- `GET /api/security-debt/aging` - Get aging vulnerabilities

### Priority Intelligence
- `POST /api/priority/analyze` - AI priority analysis
- `GET /api/priority/action-plan/:releaseId` - Get action plan
- `GET /api/priority/quick-wins` - Get quick wins

### AI Chat
- `POST /api/chat` - Send message to AI assistant
- `POST /api/chat/suggestions` - Get suggested questions
- `GET /api/chat/explain/:cveId` - Get CVE explanation

### Predictive
- `GET /api/predictive/indicators` - Get risk indicators
- `POST /api/predictive/dependency-health` - Analyze dependencies
- `GET /api/predictive/forecast` - Get risk forecast

## 🎨 Features

### 1. Release Risk Analysis
- Overall risk score (0-100) with color coding
- GO / CONDITIONAL GO / NO-GO recommendations
- Comparison to previous releases
- Executive summary in plain English

### 2. Security Debt Dashboard
- Vulnerability trend charts
- Severity distribution pie chart
- Aging analysis with visual bars
- AI predictions for Q2

### 3. Priority Intelligence
- URGENT / HIGH / MEDIUM / MONITOR categorization
- "Fix this first because..." explanations
- Grouped vulnerabilities for batch fixing
- Quick wins identification
- Noise filtering

### 4. Predictive Indicators
- Dependency health scores
- Trajectory analysis (improving/stable/declining)
- Alternative library suggestions
- Release timing recommendations
- Risk period warnings

### 5. AI Assistant
- Natural language chat interface
- Suggested questions
- Quick action buttons
- Context-aware responses

## 🔧 Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons
- Axios for API calls

### Backend
- Node.js with Express
- AWS SDK for Bedrock integration
- CORS enabled
- Environment-based configuration

### AI
- AWS Bedrock
- Claude 3 (Anthropic) models
- Custom system prompts for security context

## 📝 Development

### Adding New Features

1. Add route in `server/src/routes/`
2. Add service method in `server/src/services/bedrockService.js`
3. Add API function in `client/src/services/api.ts`
4. Create component in `client/src/components/`
5. Add to sidebar and routing in `App.tsx`

### Mock Data

Mock data is available in `server/src/data/mockData.js` for development without AI.

## 🚧 Roadmap

- [ ] Integration with actual vulnerability scanners (Snyk, GitHub Advanced Security)
- [ ] SBOM (Software Bill of Materials) parsing
- [ ] Slack/Teams notifications
- [ ] PDF report generation
- [ ] Historical data persistence
- [ ] Multi-tenant support
- [ ] CI/CD pipeline integration

## 📄 License

Internal use only - DigiCert

## 👥 Team

Built by the SRM AI Insights team @ DigiCert
