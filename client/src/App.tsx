import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import RiskAnalysis from './components/RiskAnalysis';
import SecurityDebtDashboard from './components/SecurityDebtDashboard';
import PriorityIntelligence from './components/PriorityIntelligence';
import PredictiveIndicators from './components/PredictiveIndicators';
import AIAssistant from './components/AIAssistant';
import ReportCenter from './components/ReportCenter';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('risk-analysis');

  const renderContent = () => {
    switch (activeTab) {
      case 'risk-analysis':
        return <RiskAnalysis />;
      case 'security-debt':
        return <SecurityDebtDashboard />;
      case 'priority':
        return <PriorityIntelligence />;
      case 'predictive':
        return <PredictiveIndicators />;
      case 'assistant':
        return <AIAssistant />;
      case 'reports':
        return <ReportCenter />;
      default:
        return <RiskAnalysis />;
    }
  };

  return (
    <div className="flex h-screen bg-dc-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
