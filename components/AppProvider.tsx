import React from 'react';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Simplified provider without gluestack for now
  return <>{children}</>;
};