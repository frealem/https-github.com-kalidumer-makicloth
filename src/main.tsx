import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  props: ErrorBoundaryProps;
  state: ErrorBoundaryState;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React UI error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto text-3xl font-black">
              ⚠️
            </div>
            <h2 className="text-lg font-black text-white">የሲስተም ችግር ተከሰቷል (System Error)</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              አፕሊኬሽኑ በችግር ምክንያት መጫን አልቻለም። እባክዎን ከታች ያለውን ቁልፍ በመጫን ገጹን እንደገና ይጫኑ።
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={this.handleReload}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold py-3 px-4 rounded-2xl text-xs transition shadow-lg"
              >
                🔄 ገጹን እንደገና ጫን (Reload App)
              </button>
              <button
                onClick={this.handleResetStorage}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold py-2.5 px-4 rounded-2xl text-xs transition"
              >
                🧹 ዳታ አፅድተህ እንደገና ጀምር (Reset Cache & Restart)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
