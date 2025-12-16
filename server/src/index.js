require('dotenv').config();
const express = require('express');
const cors = require('cors');
const riskAnalysisRoutes = require('./routes/riskAnalysis');
const securityDebtRoutes = require('./routes/securityDebt');
const priorityRoutes = require('./routes/priority');
const chatRoutes = require('./routes/chat');
const predictiveRoutes = require('./routes/predictive');
const reportsRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/risk-analysis', riskAnalysisRoutes);
app.use('/api/security-debt', securityDebtRoutes);
app.use('/api/priority', priorityRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/predictive', predictiveRoutes);
app.use('/api/reports', reportsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 RSI Server running on port ${PORT}`);
  console.log(`📊 Release Security Intelligence API ready`);
});
