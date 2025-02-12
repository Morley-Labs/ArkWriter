import React from 'react';
import ArkWriter from './arkwriter';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <Toaster position="bottom-right" />
        <ArkWriter />
      </div>
    </ErrorBoundary>
  );
}