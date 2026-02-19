
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Shim process for browser environments to prevent ReferenceErrors (Common on Vercel/Netlify)
if (typeof (window as any).process === 'undefined') {
  (window as any).process = {
    env: {
      NODE_ENV: 'production',
      API_KEY: ''
    }
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Wrap in a simple error handler to provide feedback if the screen goes blank
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Critical Rendering Error:", error);
  rootElement.innerHTML = `
    <div style="padding: 40px; color: #1e293b; background-color: #f8fafc; font-family: sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center;">
      <div style="max-width: 500px; padding: 32px; background: white; border-radius: 12px; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <h1 style="color: #E31E24; margin-bottom: 16px;">System Startup Error</h1>
        <p style="color: #64748b; margin-bottom: 24px;">The Asha Fan Industries suite failed to initialize. This is likely a configuration or environment variable issue.</p>
        <div style="text-align: left; background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 12px; color: #475569; overflow-x: auto;">
          ${error instanceof Error ? error.message : String(error)}
        </div>
        <button onclick="window.location.reload()" style="margin-top: 24px; padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Retry Connection</button>
      </div>
    </div>
  `;
}
