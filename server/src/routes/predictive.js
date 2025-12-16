const express = require('express');
const router = express.Router();
const bedrockService = require('../services/bedrockService');

// Get predictive risk indicators
router.get('/indicators', async (req, res) => {
  try {
    const indicators = {
      overallHealthScore: 68,
      dependencies: [
        {
          name: 'jsonwebtoken',
          healthScore: 45,
          trajectory: 'declining',
          vulnerabilitiesLast6Months: 3,
          maintainerResponseTime: 'increasing',
          recommendation: 'Consider alternatives',
          alternatives: ['jose', 'passport-jwt'],
          warning: 'This library has had 3 critical CVEs in the last 6 months and maintainer response time is increasing.'
        },
        {
          name: 'express',
          healthScore: 92,
          trajectory: 'stable',
          vulnerabilitiesLast6Months: 1,
          maintainerResponseTime: 'fast',
          recommendation: 'Keep',
          communityHealth: 'Excellent'
        },
        {
          name: 'lodash',
          healthScore: 78,
          trajectory: 'improving',
          vulnerabilitiesLast6Months: 0,
          maintainerResponseTime: 'moderate',
          recommendation: 'Monitor',
          note: 'Consider native alternatives for simple operations'
        }
      ],
      releaseTimingInsights: {
        optimalDay: 'Wednesday',
        reason: 'Dependencies in your stack typically see security updates on Tuesdays',
        recentPatternWarning: 'Your last 3 releases occurred during high-CVE-disclosure periods',
        upcomingRiskPeriods: [
          {
            period: 'Dec 20-25',
            risk: 'HIGH',
            reason: 'Holiday period - reduced security team availability'
          }
        ]
      }
    };

    res.json({ success: true, indicators });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze dependency health
router.post('/dependency-health', async (req, res) => {
  try {
    const { dependencies } = req.body;
    
    const defaultDeps = [
      { name: 'express', version: '4.18.2' },
      { name: 'lodash', version: '4.17.21' },
      { name: 'jsonwebtoken', version: '9.0.0' }
    ];

    const analysis = await bedrockService.predictDependencyHealth(dependencies || defaultDeps);
    
    try {
      const parsed = JSON.parse(analysis);
      res.json({ success: true, analysis: parsed });
    } catch {
      res.json({ success: true, analysis: { raw: analysis } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trend forecast
router.get('/forecast', async (req, res) => {
  try {
    const forecast = {
      generatedAt: new Date().toISOString(),
      currentState: {
        totalVulnerabilities: 127,
        criticalCount: 5,
        monthlyFixRate: 18
      },
      predictions: {
        nextMonth: {
          expectedTotal: 135,
          expectedCritical: 6,
          confidence: 0.85
        },
        nextQuarter: {
          expectedTotal: 178,
          expectedCritical: 12,
          confidence: 0.72
        }
      },
      recommendations: [
        {
          priority: 'HIGH',
          action: 'Increase fix rate by 50% to stabilize debt',
          impact: 'Prevents 23 additional vulnerabilities by Q2'
        },
        {
          priority: 'MEDIUM',
          action: 'Replace jsonwebtoken with jose library',
          impact: 'Reduces expected critical vulnerabilities by 40%'
        }
      ],
      riskTrajectory: 'increasing',
      breakEvenPoint: 'Requires fixing 35 vulnerabilities/month to stabilize'
    };

    res.json({ success: true, forecast });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
