import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      {label && <p className="text-sm font-medium text-slate-600">{label}</p>}
    </div>
  );
};
