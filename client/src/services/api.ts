import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Risk Analysis APIs
export const riskAnalysisAPI = {
  analyzeRelease: (releaseData?: any) => 
    api.post('/risk-analysis/analyze', { releaseData }),
  
  getRiskScore: (releaseId: string) => 
    api.get(`/risk-analysis/score/${releaseId}`),
  
  compareReleases: (currentRelease: any, previousReleases: any[]) =>
    api.post('/risk-analysis/compare', { currentRelease, previousReleases }),
};

// Security Debt APIs
export const securityDebtAPI = {
  getDashboard: () => 
    api.get('/security-debt/dashboard'),
  
  analyzeDebt: (debtData?: any) => 
    api.post('/security-debt/analyze', { debtData }),
  
  getAgingVulnerabilities: () => 
    api.get('/security-debt/aging'),
};

// Priority APIs
export const priorityAPI = {
  analyzePriority: (vulnerabilities?: any[]) => 
    api.post('/priority/analyze', { vulnerabilities }),
  
  getActionPlan: (releaseId: string) => 
    api.get(`/priority/action-plan/${releaseId}`),
  
  getQuickWins: () => 
    api.get('/priority/quick-wins'),
};

// Chat APIs
export const chatAPI = {
  sendMessage: (message: string, context?: any) => 
    api.post('/chat', { message, context }),
  
  getSuggestions: (context?: any) => 
    api.post('/chat/suggestions', { context }),
  
  explainCVE: (cveId: string) => 
    api.get(`/chat/explain/${cveId}`),
};

// Predictive APIs
export const predictiveAPI = {
  getIndicators: () => 
    api.get('/predictive/indicators'),
  
  analyzeDependencyHealth: (dependencies?: any[]) => 
    api.post('/predictive/dependency-health', { dependencies }),
  
  getForecast: () => 
    api.get('/predictive/forecast'),
};

// Reports APIs
export const reportsAPI = {
  generateExecutiveSummary: (releaseData?: any, includeAIAnalysis: boolean = false) =>
    api.post('/reports/executive-summary', { releaseData, includeAIAnalysis }),
  
  generateVulnerabilityReport: (vulnerabilities?: any[], includeRemediation: boolean = false) =>
    api.post('/reports/vulnerability-report', { vulnerabilities, includeRemediation }),
  
  generateActionPlan: (releaseId?: string, vulnerabilities?: any[]) =>
    api.post('/reports/action-plan', { releaseId, vulnerabilities }),
  
  generateSecurityDebtReport: () =>
    api.post('/reports/security-debt', {}),
  
  generateDependencyHealthReport: () =>
    api.post('/reports/dependency-health', {}),
};

// Health Check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
