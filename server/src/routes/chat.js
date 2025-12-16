const express = require('express');
const router = express.Router();
const bedrockService = require('../services/bedrockService');

// Chat with RSI AI
router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const response = await bedrockService.chat(message, context || {});
    
    res.json({ 
      success: true, 
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get suggested questions based on context
router.post('/suggestions', async (req, res) => {
  try {
    const { context } = req.body;
    
    // Generate contextual suggestions
    const suggestions = [
      "Is this Critical CVE actually critical for us?",
      "We have 50 'high severity' alerts - where do we start?",
      "What's the risk of releasing with these vulnerabilities?",
      "Can you explain CVE-2024-XXXX in simple terms?",
      "What should we prioritize this sprint?",
      "How does our security compare to last month?"
    ];

    // Add context-specific suggestions
    if (context?.criticalCount > 0) {
      suggestions.unshift(`Explain the ${context.criticalCount} critical vulnerabilities`);
    }

    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Explain a specific CVE
router.get('/explain/:cveId', async (req, res) => {
  try {
    const { cveId } = req.params;
    
    const prompt = `Explain ${cveId} in simple terms that a non-technical executive can understand. Include:
1. What it is (1 sentence)
2. Why it matters to our business
3. What could happen if exploited
4. How hard it is to exploit (be honest)
5. What we need to do about it

Keep the explanation clear and jargon-free.`;

    const explanation = await bedrockService.invokeModel(prompt);
    
    res.json({ 
      success: true, 
      cveId,
      explanation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
