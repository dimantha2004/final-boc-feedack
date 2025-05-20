import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import CustomerFeedback from './pages/CustomerFeedback';
import ManagerDashboard from './pages/ManagerDashboard';
import './index.css';
import './styles/animations.css';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <AuthProvider>
      <LanguageProvider>
        {showDashboard ? (
          <ManagerDashboard onBackToFeedback={() => setShowDashboard(false)} />
        ) : (
          <CustomerFeedback onShowDashboard={() => setShowDashboard(true)} />
        )}
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;