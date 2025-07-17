import React from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error for debugging
        console.error('🚨 Error caught by ErrorBoundary:', {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString()
        });

        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // In a real app, you might want to send this to an error reporting service
        // logErrorToService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full">
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <h1 className="text-2xl font-bold mb-4">🐛 Something went wrong!</h1>
                                <p className="mb-4">We're sorry, but something unexpected happened. Please try refreshing the page.</p>
                            </AlertDescription>
                        </Alert>

                        {process.env.NODE_ENV === 'development' && (
                            <details className="bg-muted p-4 rounded-lg mb-6">
                                <summary className="cursor-pointer font-medium mb-2">Debug Information (Development Only)</summary>
                                <div className="bg-background p-4 rounded border text-xs font-mono overflow-auto max-h-64">
                                    <div className="mb-2">
                                        <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                                    </div>
                                    <div>
                                        <strong>Component Stack:</strong>
                                        <pre className="whitespace-pre-wrap mt-1">
                                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                                        </pre>
                                    </div>
                                </div>
                            </details>
                        )}

                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh Page
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 