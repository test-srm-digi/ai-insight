const express = require('express');
const router = express.Router();
const bedrockService = require('../services/bedrockService');
const mockData = require('../data/mockData');

// Generate Executive Summary Report
router.post('/executive-summary', async (req, res) => {
  try {
    const { releaseData, includeAIAnalysis } = req.body;
    const data = releaseData || mockData.sampleRelease;

    let aiSummary = null;
    if (includeAIAnalysis) {
      try {
        aiSummary = await bedrockService.generateExecutiveSummary(data);
      } catch (error) {
        console.error('AI summary generation failed:', error);
      }
    }

    const report = {
      title: 'Executive Security Summary Report',
      generatedAt: new Date().toISOString(),
      reportType: 'EXECUTIVE_SUMMARY',
      release: {
        version: data.version || data.name,
        date: data.date || new Date().toISOString()
      },
      riskOverview: {
        overallScore: 72,
        recommendation: 'CONDITIONAL GO',
        severity: 'MEDIUM',
        comparisonToPrevious: '+30% risk increase'
      },
      vulnerabilitySummary: {
        total: data.vulnerabilities?.length || 7,
        critical: data.vulnerabilities?.filter(v => v.severity === 'CRITICAL').length || 1,
        high: data.vulnerabilities?.filter(v => v.severity === 'HIGH').length || 2,
        medium: data.vulnerabilities?.filter(v => v.severity === 'MEDIUM').length || 2,
        low: data.vulnerabilities?.filter(v => v.severity === 'LOW').length || 2
      },
      keyFindings: [
        {
          priority: 'CRITICAL',
          finding: 'Authentication bypass vulnerability in JWT library requires immediate attention',
          impact: 'Potential account takeover',
          recommendation: 'Upgrade jsonwebtoken to v9.0.2 before release'
        },
        {
          priority: 'HIGH',
          finding: 'Path traversal vulnerability in Express middleware',
          impact: 'Unauthorized file system access',
          recommendation: 'Update Express to v4.18.2 within 48 hours post-release'
        },
        {
          priority: 'MEDIUM',
          finding: 'Multiple outdated HTTP client dependencies',
          impact: 'Potential SSRF vulnerabilities',
          recommendation: 'Batch update in next sprint'
        }
      ],
      recommendations: [
        'Address critical JWT vulnerability before deployment',
        'Schedule patch window for high-priority Express update',
        'Implement dependency update automation to reduce future debt',
        'Consider replacing declining-health dependencies'
      ],
      aiAnalysis: aiSummary,
      footer: {
        generatedBy: 'RSI - Release Security Intelligence',
        confidentiality: 'INTERNAL USE ONLY'
      }
    };

    res.json({ success: true, report });
  } catch (error) {
    console.error('Executive summary generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate Vulnerability Report
router.post('/vulnerability-report', async (req, res) => {
  try {
    const { vulnerabilities, includeRemediation } = req.body;
    const vulns = vulnerabilities || mockData.sampleVulnerabilities;

    let remediationDetails = null;
    if (includeRemediation) {
      try {
        remediationDetails = await bedrockService.generateRemediationGuide(vulns);
      } catch (error) {
        console.error('Remediation guide generation failed:', error);
      }
    }

    const report = {
      title: 'Comprehensive Vulnerability Report',
      generatedAt: new Date().toISOString(),
      reportType: 'VULNERABILITY_REPORT',
      summary: {
        totalVulnerabilities: vulns.length,
        bySeverity: {
          critical: vulns.filter(v => v.severity === 'CRITICAL').length,
          high: vulns.filter(v => v.severity === 'HIGH').length,
          medium: vulns.filter(v => v.severity === 'MEDIUM').length,
          low: vulns.filter(v => v.severity === 'LOW').length
        },
        withExploits: vulns.filter(v => v.exploitAvailable).length,
        averageCVSS: (vulns.reduce((sum, v) => sum + v.cvssScore, 0) / vulns.length).toFixed(1)
      },
      vulnerabilities: vulns.map(v => ({
        id: v.id,
        package: v.package,
        currentVersion: v.version,
        severity: v.severity,
        cvssScore: v.cvssScore,
        description: v.description,
        exploitAvailable: v.exploitAvailable,
        exploitMaturity: v.exploitMaturity,
        affectedComponent: v.affectedComponent,
        fixVersion: v.fixVersion,
        publishedDate: v.publishedDate,
        references: v.references,
        riskAssessment: getRiskAssessment(v)
      })),
      remediationGuide: remediationDetails,
      prioritizedActions: [
        {
          order: 1,
          action: 'Upgrade jsonwebtoken from 8.5.1 to 9.0.2',
          effort: '2 hours',
          riskReduction: 'HIGH'
        },
        {
          order: 2,
          action: 'Update Express from 4.17.1 to 4.18.2',
          effort: '4 hours',
          riskReduction: 'HIGH'
        },
        {
          order: 3,
          action: 'Batch update axios, node-fetch, got',
          effort: '8 hours',
          riskReduction: 'MEDIUM'
        }
      ],
      footer: {
        generatedBy: 'RSI - Release Security Intelligence',
        confidentiality: 'INTERNAL USE ONLY'
      }
    };

    res.json({ success: true, report });
  } catch (error) {
    console.error('Vulnerability report generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate Action Plan Report
router.post('/action-plan', async (req, res) => {
  try {
    const { releaseId, vulnerabilities } = req.body;
    const vulns = vulnerabilities || mockData.sampleVulnerabilities;

    const report = {
      title: 'Security Action Plan Report',
      generatedAt: new Date().toISOString(),
      reportType: 'ACTION_PLAN',
      release: releaseId || 'v2.3.4',
      executiveSummary: 'This action plan outlines the prioritized remediation steps for identified security vulnerabilities. Following this plan will reduce overall security risk by an estimated 85%.',
      timelineOverview: {
        totalEstimatedHours: 22,
        urgentItems: 1,
        highPriorityItems: 2,
        mediumItems: 3,
        monitorItems: 1
      },
      phases: [
        {
          phase: 'Pre-Release (Immediate)',
          deadline: 'Before deployment',
          items: [
            {
              id: 'CVE-2024-1234',
              package: 'jsonwebtoken',
              action: 'Upgrade to version 9.0.2',
              estimatedHours: 2,
              assignee: 'Security Team',
              steps: [
                'Update package.json dependency',
                'Review breaking changes in migration guide',
                'Update token generation code if needed',
                'Run authentication test suite',
                'Deploy to staging and verify SSO flows'
              ],
              rollbackPlan: 'Revert to 8.5.1 and implement temporary mitigation'
            }
          ]
        },
        {
          phase: 'Post-Release Sprint 1',
          deadline: '48 hours after deployment',
          items: [
            {
              id: 'CVE-2024-2345',
              package: 'express',
              action: 'Update to version 4.18.2',
              estimatedHours: 4,
              assignee: 'Backend Team',
              steps: [
                'Update express dependency',
                'Review middleware configuration',
                'Test all API endpoints',
                'Verify static file serving behavior'
              ],
              rollbackPlan: 'Revert express version and apply manual path sanitization'
            }
          ]
        },
        {
          phase: 'Next Sprint',
          deadline: 'Within 2 weeks',
          items: [
            {
              ids: ['CVE-2024-3456', 'CVE-2024-4567', 'CVE-2024-5678'],
              packages: ['axios', 'lodash', 'moment'],
              action: 'Batch dependency update',
              estimatedHours: 8,
              assignee: 'Development Team',
              notes: 'Can be updated together with minimal risk'
            }
          ]
        }
      ],
      riskMatrix: {
        beforeRemediation: {
          critical: 1,
          high: 2,
          medium: 2,
          low: 2,
          overallScore: 72
        },
        afterRemediation: {
          critical: 0,
          high: 0,
          medium: 1,
          low: 2,
          overallScore: 25
        },
        riskReduction: '65%'
      },
      monitoringPlan: [
        'Set up automated dependency scanning in CI/CD pipeline',
        'Configure alerts for new CVEs in critical dependencies',
        'Schedule monthly security review meetings',
        'Implement dependency health monitoring dashboard'
      ],
      footer: {
        generatedBy: 'RSI - Release Security Intelligence',
        confidentiality: 'INTERNAL USE ONLY',
        approvalRequired: true
      }
    };

    res.json({ success: true, report });
  } catch (error) {
    console.error('Action plan report generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate Security Debt Report
router.post('/security-debt', async (req, res) => {
  try {
    const debtData = mockData.sampleSecurityDebt;

    const report = {
      title: 'Security Debt Analysis Report',
      generatedAt: new Date().toISOString(),
      reportType: 'SECURITY_DEBT',
      period: 'Last 6 Months',
      currentState: {
        totalVulnerabilities: debtData.totalVulnerabilities,
        bySeverity: debtData.bySeverity,
        byAge: debtData.byAge,
        oldestUnresolved: '145 days (CVE-2024-1234 in lodash)'
      },
      trends: {
        direction: 'INCREASING',
        monthlyData: debtData.trend,
        accumulationRate: '20% faster than resolution rate',
        averageTimeToFix: '45 days',
        targetTimeToFix: '30 days'
      },
      financialImpact: {
        estimatedHoursToResolve: 340,
        estimatedCost: '$51,000',
        costPerVulnerability: '$402',
        potentialBreachCost: '$4.2M (industry average)'
      },
      projections: {
        nextMonth: {
          expectedTotal: 135,
          expectedCritical: 6
        },
        nextQuarter: {
          expectedTotal: 178,
          expectedCritical: 12
        },
        breakEvenRequirement: '35 fixes per month to stabilize'
      },
      recommendations: [
        {
          priority: 'HIGH',
          recommendation: 'Increase fix rate by 50%',
          impact: 'Stabilize debt accumulation',
          resources: 'Dedicate 2 engineers to security fixes'
        },
        {
          priority: 'MEDIUM',
          recommendation: 'Implement automated dependency updates',
          impact: 'Reduce 40% of new vulnerabilities',
          resources: 'Dependabot or Renovate setup'
        },
        {
          priority: 'MEDIUM',
          recommendation: 'Replace high-risk dependencies',
          impact: 'Reduce critical vulnerability exposure',
          resources: 'Identify and migrate from jsonwebtoken, moment'
        }
      ],
      footer: {
        generatedBy: 'RSI - Release Security Intelligence',
        confidentiality: 'INTERNAL USE ONLY'
      }
    };

    res.json({ success: true, report });
  } catch (error) {
    console.error('Security debt report generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate Dependency Health Report
router.post('/dependency-health', async (req, res) => {
  try {
    const report = {
      title: 'Dependency Health Report',
      generatedAt: new Date().toISOString(),
      reportType: 'DEPENDENCY_HEALTH',
      overallHealthScore: 68,
      totalDependencies: 234,
      directDependencies: 45,
      devDependencies: 89,
      summary: {
        healthy: 180,
        needsAttention: 35,
        atRisk: 15,
        deprecated: 4
      },
      atRiskDependencies: [
        {
          name: 'jsonwebtoken',
          currentVersion: '8.5.1',
          healthScore: 45,
          trajectory: 'DECLINING',
          issues: [
            '3 critical CVEs in last 6 months',
            'Increasing maintainer response time',
            'Limited community activity'
          ],
          recommendation: 'REPLACE',
          alternatives: ['jose', 'passport-jwt'],
          migrationEffort: 'MEDIUM'
        },
        {
          name: 'moment',
          currentVersion: '2.29.1',
          healthScore: 55,
          trajectory: 'DEPRECATED',
          issues: [
            'Project in maintenance mode',
            'No new features planned',
            'Better alternatives available'
          ],
          recommendation: 'REPLACE',
          alternatives: ['date-fns', 'dayjs', 'luxon'],
          migrationEffort: 'HIGH'
        }
      ],
      healthyDependencies: [
        {
          name: 'express',
          currentVersion: '4.18.2',
          healthScore: 92,
          trajectory: 'STABLE',
          notes: 'Well-maintained, active community'
        },
        {
          name: 'react',
          currentVersion: '18.2.0',
          healthScore: 98,
          trajectory: 'IMPROVING',
          notes: 'Actively developed, excellent support'
        }
      ],
      recommendations: [
        'Replace jsonwebtoken with jose library',
        'Migrate from moment to date-fns',
        'Update 23 outdated dependencies',
        'Remove 4 unused dependencies'
      ],
      footer: {
        generatedBy: 'RSI - Release Security Intelligence',
        confidentiality: 'INTERNAL USE ONLY'
      }
    };

    res.json({ success: true, report });
  } catch (error) {
    console.error('Dependency health report generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to assess risk
function getRiskAssessment(vulnerability) {
  const { severity, exploitAvailable, exploitMaturity, cvssScore } = vulnerability;
  
  if (severity === 'CRITICAL' && exploitAvailable) {
    return {
      level: 'CRITICAL',
      color: '#dc2626',
      urgency: 'IMMEDIATE',
      description: 'Active exploit available for critical vulnerability'
    };
  }
  
  if (severity === 'CRITICAL' || (severity === 'HIGH' && exploitAvailable)) {
    return {
      level: 'HIGH',
      color: '#ea580c',
      urgency: 'URGENT',
      description: 'High-risk vulnerability requiring prompt attention'
    };
  }
  
  if (severity === 'HIGH' || severity === 'MEDIUM') {
    return {
      level: 'MEDIUM',
      color: '#f59e0b',
      urgency: 'SCHEDULED',
      description: 'Moderate risk, schedule for upcoming sprint'
    };
  }
  
  return {
    level: 'LOW',
    color: '#22c55e',
    urgency: 'MONITOR',
    description: 'Low risk, monitor for changes'
  };
}

module.exports = router;
