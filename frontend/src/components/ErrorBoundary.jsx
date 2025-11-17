import React from 'react';
import { Button } from '@/components/ui/Button';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <FaExclamationTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              ¡Oops! Algo salió mal
            </h1>
            
            <p className="text-gray-600 text-center mb-6">
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página o vuelve al inicio.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-red-800 mb-2">Detalles del error (solo desarrollo):</h3>
                <p className="text-sm text-red-700 font-mono mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs text-red-600">
                    <summary className="cursor-pointer hover:underline">Ver stack trace</summary>
                    <pre className="mt-2 overflow-auto max-h-40 bg-white p-2 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                onClick={this.handleReset}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FaRedo className="w-4 h-4 mr-2" />
                Intentar de nuevo
              </Button>
              
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <FaHome className="w-4 h-4 mr-2" />
                Ir al inicio
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
