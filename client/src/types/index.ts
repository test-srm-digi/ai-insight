export interface Vulnerability {
  id: string;
  package: string;
  version: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cvssScore: number;
  description: string;
  exploitAvailable: boolean;
  exploitMaturity: string;
  affectedComponent: string;
  fixVersion: string;
  publishedDate: string;
  references: string[];
}

export interface RiskScore {
  releaseId: string;
  overallScore: number;
  severity: string;
  color: string;
  breakdown: {
    criticalVulns: number;
    highVulns: number;
    mediumVulns: number;
    lowVulns: number;
  };
  comparison: {
    previousRelease: number;
    trend: string;
    percentChange: number;
  };
  recommendation: 'GO' | 'CONDITIONAL GO' | 'NO-GO';
}

export interface SecurityDebtData {
  totalVulnerabilities: number;
  byAge: {
    lessThan30Days: number;
    thirtyTo60Days: number;
    sixtyTo90Days: number;
    moreThan90Days: number;
  };
  bySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  trend: Array<{
    month: string;
    total: number;
    fixed: number;
    new: number;
  }>;
  fixRate: {
    current: number;
    average: number;
    target: number;
  };
  accumulationRate: number;
  projectedQ2: number;
  estimatedCost: {
    hours: number;
    dollarAmount: number;
  };
}

export interface ActionItem {
  id: string;
  package: string;
  currentVersion?: string;
  fixVersion?: string;
  estimatedHours?: number;
  estimatedMinutes?: number;
  description: string;
  affectedModule?: string;
  riskIfIgnored?: string;
  fixSteps?: string[];
  severity?: string;
  reason?: string;
}

export interface ActionPlan {
  releaseId: string;
  generatedAt: string;
  summary: string;
  actions: {
    urgent: ActionItem[];
    highPriority: ActionItem[];
    medium: any[];
    monitor: ActionItem[];
  };
  quickWins: ActionItem[];
  noise: ActionItem[];
}

export interface DependencyHealth {
  name: string;
  healthScore: number;
  trajectory: 'improving' | 'stable' | 'declining';
  vulnerabilitiesLast6Months: number;
  maintainerResponseTime: string;
  recommendation: string;
  alternatives?: string[];
  warning?: string;
  communityHealth?: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
