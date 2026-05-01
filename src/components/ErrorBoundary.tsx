import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component to catch runtime errors in the component tree.
 * Ensures the app stays functional even if a specific component fails.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', margin: '20px' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
            <h2 style={{ marginBottom: '8px' }}>Something went wrong</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              We encountered an unexpected error. Please try refreshing the assistant.
            </p>
            <button className="btn btn-primary" onClick={this.handleReset}>
              <RefreshCcw size={16} /> Refresh Elexia
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
