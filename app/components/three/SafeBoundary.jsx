'use client';

import { Component } from 'react';

/** Error boundary for 3D subtrees (missing GLB, failed HDRI fetch) — renders fallback instead of crashing the canvas. */
export default class SafeBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    /* swallow — decorative 3D only */
  }

  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children;
  }
}
