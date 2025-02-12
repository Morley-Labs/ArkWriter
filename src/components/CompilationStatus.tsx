import React from 'react';
import { Loader2 } from 'lucide-react';

interface CompilationStatusProps {
  status: {
    step: 'idle' | 'parsing' | 'validating' | 'compiling' | 'deploying' | 'complete' | 'error';
    message?: string;
    error?: string;
  };
}

export const CompilationStatus: React.FC<CompilationStatusProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status.step) {
      case 'complete':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-xl max-w-md">
      <div className="flex items-center gap-2">
        {status.step !== 'idle' && status.step !== 'complete' && status.step !== 'error' && (
          <Loader2 className="w-5 h-5 animate-spin" />
        )}
        <span className={getStatusColor()}>
          {status.message || status.step}
        </span>
      </div>
      {status.error && (
        <p className="text-red-500 text-sm mt-2">{status.error}</p>
      )}
    </div>
  );
};