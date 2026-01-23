
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log("Starting app mount...");

const loadApp = async () => {
  try {
    console.log("Dynamically importing App...");
    const AppModule = await import('./App');
    const App = AppModule.default;

    console.log("App module loaded, rendering...");
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("App mounted successfully");
  } catch (err: any) {
    console.error("CRITICAL FAILURE:", err);
    rootElement.innerHTML = `
            <div style="padding: 20px; font-family: sans-serif;">
                <h1 style="color: #e11d48; margin-bottom: 10px;">Error Crítico de Inicio</h1>
                <p style="margin-bottom: 20px;">La aplicación no pudo cargarse debido a un error en los archivos principales.</p>
                <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1; overflow: auto;">
                    <strong style="display:block; margin-bottom:5px; color:#334155;">Detalles del error:</strong>
                    <code style="color: #b91c1c; white-space: pre-wrap;">${err.message || err}</code>
                </div>
                ${err.stack ? `
                <div style="margin-top: 20px;">
                    <details>
                        <summary style="cursor: pointer; color: #475569;">Ver Stack Trace</summary>
                        <pre style="background: #f8fafc; padding: 10px; font-size: 12px; margin-top: 5px; overflow: auto;">${err.stack}</pre>
                    </details>
                </div>
                ` : ''}
            </div>
        `;
  }
};

loadApp();
