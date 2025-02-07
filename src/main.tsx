import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <Toaster position="top-right" />
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Failed to load application. Please check console for errors.</div>';
}