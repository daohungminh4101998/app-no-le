import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/common/AppHeader';
import { BottomNavigation } from '../components/common/BottomNavigation';
import { Toast } from '../components/common/Toast';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      {/* Container wrapper for mobile-first experience */}
      <div className="w-full max-w-md min-h-screen bg-surface flex flex-col relative shadow-2xl border-x border-slate-200/80">
        {/* Global Toast */}
        <Toast />

        {/* Top Header */}
        <AppHeader />

        {/* Main Content Area */}
        <main className="flex-1 pb-24 px-4 pt-3.5 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </div>
  );
};
