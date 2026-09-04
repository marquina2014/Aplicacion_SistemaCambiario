import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import DashboardScreen from './screens/DashboardScreen';
import ConverterScreen from './screens/ConverterScreen';
import HistoricalScreen from './screens/HistoricalScreen';
import SettingsScreen from './screens/SettingsScreen';
import { fetchCurrentRates } from './functions/services/ratesService';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialConverterCurrency, setInitialConverterCurrency] = useState('EUR_BCV');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('al_cambio_theme') || 'light';
  });

  // Aplicar tema en el documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('al_cambio_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Cargar tasas desde el servicio HTTP (fetch nativo / HTTPS)
  const loadRates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCurrentRates();
      setRates(data);
    } catch (error) {
      console.error('Error cargando tasas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRates();

    // Actualización automática cada 5 minutos
    const intervalId = setInterval(loadRates, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [loadRates]);

  const handleNavigateToConverter = (currency = 'EUR_BCV') => {
    setInitialConverterCurrency(currency);
    setActiveTab('converter');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Barra de navegación superior (PC / Tablet) */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={loadRates}
        loading={loading}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Contenedor principal de pantallas */}
      <main className="flex-fill">
        {activeTab === 'dashboard' && (
          <DashboardScreen
            rates={rates}
            loading={loading}
            onNavigateToConverter={handleNavigateToConverter}
            onRefresh={loadRates}
          />
        )}

        {activeTab === 'converter' && (
          <ConverterScreen
            rates={rates}
            initialCurrency={initialConverterCurrency}
          />
        )}

        {activeTab === 'history' && (
          <HistoricalScreen
            rates={rates}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}
      </main>

      {/* Barra de navegación flotante inferior para celulares */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}

export default App;
