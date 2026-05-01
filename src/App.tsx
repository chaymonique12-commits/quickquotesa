import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './stores/appStore';
import { useSettingsStore } from './stores/settingsStore';
import { Header } from './components/Header';
import { TabBar, Sidebar } from './components/TabBar';
import { ToastContainer } from './components/Toast';
import { QuotePreview } from './components/QuotePreview';
import { QuoteBuilder } from './pages/QuoteBuilder';
import { Templates } from './pages/Templates';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { LandingPage } from './pages/LandingPage';
import { ClientPortal } from './pages/ClientPortal';
import './index.css';

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function AdminApp() {
  const { activeTab } = useAppStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', settings.accentColor);
    const darkerColor = adjustColor(settings.accentColor, -20);
    document.documentElement.style.setProperty('--color-primary-dark', darkerColor);
  }, [settings.accentColor]);

  const renderPage = () => {
    switch (activeTab) {
      case 'builder': return <QuoteBuilder />;
      case 'templates': return <Templates />;
      case 'history': return <History />;
      case 'settings': return <Settings />;
      default: return <QuoteBuilder />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Header />
      <Sidebar />
      <main className="md:ml-64">{renderPage()}</main>
      <TabBar />
      <ToastContainer />
      <QuotePreview />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<AdminApp />} />
        <Route path="/quote/:uuid" element={<ClientPortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
