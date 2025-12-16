const express = require('express');
const router = express.Router();
const bedrockService = require('../services/bedrockService');

// Get security debt dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const debtData = {
      totalVulnerabilities: 127,
      byAge: {
        lessThan30Days: 45,
        thirtyTo60Days: 32,
        sixtyTo90Days: 28,
        moreThan90Days: 22
      },
      bySeverity: {
        critical: 5,
        high: 23,
        medium: 54,
        low: 45
      },
      trend: [
        { month: 'Jul', total: 89, fixed: 34, new: 45 },
        { month: 'Aug', total: 98, fixed: 28, new: 37 },
        { month: 'Sep', total: 105, fixed: 31, new: 38 },
        { month: 'Oct', total: 112, fixed: 25, new: 32 },
        { month: 'Nov', total: 120, fixed: 22, new: 30 },
        { month: 'Dec', total: 127, fixed: 18, new: 25 }
      ],
      fixRate: {
        current: 18,
        average: 26,
        target: 35
      },
      accumulationRate: 1.2, // 20% faster accumulation than fixes
      projectedQ2: 178,
      estimatedCost: {
        hours: 340,
        dollarAmount: 51000
      }
    };

    res.json({ success: true, data: debtData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get AI analysis of security debt
router.post('/analyze', async (req, res) => {
  try {
    const { debtData } = req.body;
    
    const defaultDebtData = {
      byAge: {
        lessThan30Days: 45,
        thirtyTo60Days: 32,
        sixtyTo90Days: 28,
        moreThan90Days: 22
      },
      trend: [
        { month: 'Jul', total: 89, fixed: 34, new: 45 },
        { month: 'Aug', total: 98, fixed: 28, new: 37 },
        { month: 'Sep', total: 105, fixed: 31, new: 38 },
        { month: 'Oct', total: 112, fixed: 25, new: 32 },
        { month: 'Nov', total: 120, fixed: 22, new: 30 },
        { month: 'Dec', total: 127, fixed: 18, new: 25 }
      ],
      fixRate: {
        current: 18,
        average: 26,
        target: 35
      }
    };

    const analysis = await bedrockService.analyzeSecurityDebt(debtData || defaultDebtData);
    
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

// Get aging vulnerabilities
router.get('/aging', async (req, res) => {
  try {
    const agingVulns = [
      {
        id: 'CVE-2024-1234',
        package: 'lodash',
        severity: 'high',
        ageInDays: 145,
        status: 'unresolved',
        reason: 'Breaking change in upgrade path'
      },
      {
        id: 'CVE-2024-2345',
        package: 'moment',
        severity: 'medium',
        ageInDays: 120,
        status: 'in-progress',
        reason: 'Requires refactoring'
      },
      {
        id: 'CVE-2024-3456',
        package: 'express',
        severity: 'critical',
        ageInDays: 98,
        status: 'blocked',
        reason: 'Dependency conflict'
      }
    ];

    res.json({ 
      success: true, 
      data: agingVulns,
      summary: 'You have 15 vulnerabilities older than 90 days, including 3 critical ones that need immediate attention.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
