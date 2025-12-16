const express = require('express');
const router = express.Router();
const bedrockService = require('../services/bedrockService');
const mockData = require('../data/mockData');

// Get prioritized action plan
router.post('/analyze', async (req, res) => {
  try {
    const { vulnerabilities } = req.body;
    
    const vulnsToAnalyze = vulnerabilities || mockData.sampleVulnerabilities;
    const analysis = await bedrockService.generatePriorityAnalysis(vulnsToAnalyze);
    
    try {
      const parsed = JSON.parse(analysis);
      res.json({ success: true, analysis: parsed });
    } catch {
      res.json({ success: true, analysis: { raw: analysis } });
    }
  } catch (error) {
    console.error('Priority analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get action plan for release
router.get('/action-plan/:releaseId', async (req, res) => {
  try {
    const actionPlan = {
      releaseId: req.params.releaseId,
      generatedAt: new Date().toISOString(),
      summary: "5 vulnerabilities require attention before release, 3 can be addressed post-release",
      actions: {
        urgent: [
          {
            id: 'CVE-2024-XXXX',
            package: 'jsonwebtoken',
            currentVersion: '8.5.1',
            fixVersion: '9.0.2',
            estimatedHours: 2,
            description: 'Authentication bypass vulnerability',
            affectedModule: 'Authentication module',
            riskIfIgnored: 'Account takeover vulnerability - attackers can forge valid tokens',
            fixSteps: [
              'Update jsonwebtoken to version 9.0.2',
              'Review token generation code for breaking changes',
              'Run authentication test suite',
              'Deploy to staging and verify SSO flows'
            ]
          }
        ],
        highPriority: [
          {
            id: 'CVE-2024-YYYY',
            package: 'express',
            currentVersion: '4.17.1',
            fixVersion: '4.18.2',
            estimatedHours: 4,
            description: 'Path traversal in static file serving',
            affectedModule: 'API endpoints',
            riskIfIgnored: 'Potential file system access',
            fixSteps: [
              'Update express to 4.18.2',
              'Update middleware configuration',
              'Test all static file routes'
            ]
          }
        ],
        medium: [
          {
            ids: ['CVE-2024-AAA', 'CVE-2024-BBB', 'CVE-2024-CCC'],
            type: 'grouped',
            packages: ['axios', 'node-fetch', 'got'],
            estimatedHours: 8,
            description: 'Outdated HTTP client dependencies',
            notes: 'Can be batch updated together',
            exploitProbability: 'Low'
          }
        ],
        monitor: [
          {
            id: 'CVE-2024-ZZZ',
            package: 'debug',
            severity: 'low',
            description: 'Theoretical DoS in debug output',
            reason: 'No known exploits, debug disabled in production'
          }
        ]
      },
      quickWins: [
        {
          id: 'CVE-2024-QW1',
          package: 'helmet',
          estimatedMinutes: 15,
          riskReduction: 'HIGH',
          description: 'Simple version bump, no breaking changes'
        }
      ],
      noise: [
        {
          id: 'CVE-2024-NOISE1',
          package: 'colors',
          reason: 'Dev dependency only, not in production bundle'
        }
      ]
    };

    res.json({ success: true, actionPlan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get quick wins
router.get('/quick-wins', async (req, res) => {
  try {
    const quickWins = [
      {
        id: 'QW-001',
        cveId: 'CVE-2024-1111',
        package: 'helmet',
        currentVersion: '4.6.0',
        fixVersion: '7.1.0',
        estimatedMinutes: 15,
        riskReduction: 85,
        breakingChanges: false,
        description: 'Security headers middleware update'
      },
      {
        id: 'QW-002',
        cveId: 'CVE-2024-2222',
        package: 'cors',
        currentVersion: '2.8.4',
        fixVersion: '2.8.5',
        estimatedMinutes: 10,
        riskReduction: 60,
        breakingChanges: false,
        description: 'CORS bypass fix'
      }
    ];

    res.json({ 
      success: true, 
      quickWins,
      totalTimeEstimate: '25 minutes',
      totalRiskReduction: '72%'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
