/**
 * H2 Console Button Component
 * Provides a button to open the H2 database console
 */

import React, { useEffect } from 'react';
import h2Console from '../lib/h2Console';

interface H2ConsoleButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function H2ConsoleButton({ className = '', children }: H2ConsoleButtonProps) {
  useEffect(() => {
    // Add keyboard shortcut info to console
    console.log('H2 Console: Press Ctrl+Shift+H to open the database console');
    
    // Cleanup on unmount
    return () => {
      h2Console.close();
    };
  }, []);

  const handleOpenConsole = () => {
    h2Console.open();
  };

  return (
    <button
      onClick={handleOpenConsole}
      className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors ${className}`}
      title="Open H2 Database Console (Ctrl+Shift+H)"
    >
      {children || 'H2 Console'}
    </button>
  );
}

export default H2ConsoleButton;
