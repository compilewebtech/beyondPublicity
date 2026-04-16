import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="max-w-lg w-full border border-red-500/30 bg-red-500/5 p-8 text-center">
          <h1 className="font-inter text-2xl font-bold text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-white/50 text-sm font-light mb-6">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-white text-black text-xs tracking-widest uppercase font-semibold hover:bg-white/80 transition-colors"
            >
              Try Again
            </button>
            <a
              href="/"
              className="px-5 py-2.5 border border-white/20 text-white/60 text-xs tracking-widest uppercase font-light hover:border-white hover:text-white transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
