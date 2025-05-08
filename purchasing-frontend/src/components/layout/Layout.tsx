import React from 'react';
import Sidebar from './Sidebar';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="flex h-screen bg-gradient-to-r from-green-50 to-teal-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold text-teal-800">{title}</h1>}
              {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;