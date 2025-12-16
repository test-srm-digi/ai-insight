const express = require('express');
const router = express.Router();
const bedrockService = require('../services/bedrockService');
const mockData = require('../data/mockData');

// Get release risk analysis
router.post('/analyze', async (req, res) => {
  try {
    const { releaseData } = req.body;
    
    // Use provided data or mock data
    const dataToAnalyze = releaseData || mockData.sampleRelease;
    
    const analysis = await bedrockService.analyzeReleaseRisk(dataToAnalyze);
    
    // Try to parse as JSON, otherwise return as structured response
    try {
      const parsed = JSON.parse(analysis);
      res.json({ success: true, analysis: parsed });
    } catch {
      res.json({ success: true, analysis: { raw: analysis } });
    }
  } catch (error) {
    console.error('Risk analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get risk score for a release
router.get('/score/:releaseId', async (req, res) => {
  try {
    const { releaseId } = req.params;
    
    // Mock score calculation (would be based on actual data)
    const scoreData = {
      releaseId,
      overallScore: 72,
      severity: 'MEDIUM',
      color: '#FFA500',
      breakdown: {
        criticalVulns: 1,
        highVulns: 3,
        mediumVulns: 8,
        lowVulns: 15
      },
      comparison: {
        previousRelease: 65,
        trend: 'increasing',
        percentChange: 10.8
      },
      recommendation: 'CONDITIONAL GO'
    };
    
    res.json({ success: true, data: scoreData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Compare releases
router.post('/compare', async (req, res) => {
  try {
    const { currentRelease, previousReleases } = req.body;
    
    const comparison = {
      current: currentRelease,
      previous: previousReleases,
      riskTrend: 'increasing',
      percentageChange: 30,
      summary: "This release is 30% riskier than your last 3 releases. The increase is primarily due to 2 new critical vulnerabilities in authentication dependencies."
    };
    
    res.json({ success: true, comparison });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
