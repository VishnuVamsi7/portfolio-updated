'use client';

import { Component } from 'react';

/** Catches client crashes in decorative 3D layers so the rest of the page still renders. */
export default class ClientErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[ClientErrorBoundary]', this.props.name || 'component', error?.message);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
