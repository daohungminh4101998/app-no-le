import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/common/AppHeader';
import { BottomNavigation } from '../components/common/BottomNavigation';
import { Toast } from '../components/common/Toast';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen app-mesh-bg flex flex-col items-center justify-start sm:py-4">
      {/* Container wrapper: Native edge-to-edge on mobile, sleek elevated frame on tablet/desktop */}
      <div className="w-full max-w-lg min-h-screen sm:min-h-[calc(100vh-2rem)] bg-white sm:rounded-3xl flex flex-col relative sm:shadow-float sm:border sm:border-slate-200/70 overflow-hidden">
        {/* Global Toast */}
        <Toast />

        {/* Top Header */}
        <AppHeader />

        {/* Main Content Area */}
        <main className="flex-1 pb-24 px-4 pt-3 sm:px-5 sm:pt-4 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </div>
  );
};
