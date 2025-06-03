'use client';

import React from 'react';

interface ImageErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ImageErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ImageErrorBoundary extends React.Component<ImageErrorBoundaryProps, ImageErrorBoundaryState> {
  constructor(props: ImageErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ImageErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console or error reporting service
    console.error('Image Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return custom fallback UI or default
      return this.props.fallback || (
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
          <div className="text-center text-gray-500">
            <div className="text-sm">Image failed to load</div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ImageErrorBoundary;
