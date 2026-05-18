/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Products } from './pages/Products';
import { Inventory } from './pages/Inventory';
import { Marketplaces } from './pages/Marketplaces';
import { Settings } from './pages/Settings';
import { Toaster } from 'sonner';

// Gelecekteki sayfalar için placeholder
const Placeholder = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 animate-in fade-in">
    <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
      <span className="text-2xl">🚧</span>
    </div>
    <h2 className="text-xl font-bold">{name} Sayfası Hazırlanıyor</h2>
    <p className="text-muted-foreground">Bu modül bir sonraki güncellemede aktif olacaktır.</p>
  </div>
);

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'orders': return <Orders />;
      case 'products': return <Products />;
      case 'inventory': return <Inventory />;
      case 'marketplaces': return <Marketplaces />;
      case 'categories': return <Placeholder name="Kategoriler" />;
      case 'reports': return <Placeholder name="Raporlar" />;
      case 'users': return <Placeholder name="Kullanıcılar" />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Suspense fallback={null}>
      <Layout activePage={activePage} setActivePage={setActivePage}>
        {renderPage()}
      </Layout>
      <Toaster position="top-right" richColors />
    </Suspense>
  );
}
