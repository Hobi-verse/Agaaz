import { Component } from "react";
import CrashFallback from "./CrashFallback";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Intentionally no-op (avoid noisy logs in production)
  }

  render() {
    if (this.state.hasError) {
      return <CrashFallback />;
    }

    return this.props.children;
  }
}
