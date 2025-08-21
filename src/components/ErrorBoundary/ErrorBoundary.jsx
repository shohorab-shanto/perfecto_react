import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Store error details for debugging
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Check if we're in Facebook browser and log specific info
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isFacebookBrowser = userAgent.includes('FBAN') ||
            userAgent.includes('FBAV') ||
            userAgent.includes('Instagram') ||
            userAgent.includes('FB_IAB') ||
            userAgent.includes('FB4A') ||
            userAgent.includes('FBIOS') ||
            userAgent.includes('FBANDROID');
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        if (isFacebookBrowser && isIOS) {
            console.error('Error occurred in Facebook iOS browser:', {
                userAgent,
                error: error.toString(),
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                errorMessage: error.message,
                errorName: error.name
            });

            // Store error info in localStorage for debugging
            try {
                const errorData = {
                    timestamp: new Date().toISOString(),
                    userAgent,
                    error: error.toString(),
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    componentStack: errorInfo.componentStack
                };
                localStorage.setItem('perfecto_error_log', JSON.stringify(errorData));
            } catch (e) {
                console.error('Failed to store error in localStorage:', e);
            }
        }
    }

    exportErrorInfo = () => {
        const errorData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            error: this.state.error?.toString(),
            message: this.state.error?.message,
            name: this.state.error?.name,
            stack: this.state.error?.stack,
            componentStack: this.state.errorInfo?.componentStack,
            url: window.location.href,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };

        const dataStr = JSON.stringify(errorData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'perfecto-error-log.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    copyErrorInfo = () => {
        const errorData = {
            error: this.state.error?.message || 'Unknown error',
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        if (navigator.clipboard) {
            navigator.clipboard.writeText(JSON.stringify(errorData, null, 2))
                .then(() => alert('Error info copied to clipboard!'))
                .catch(() => alert('Failed to copy error info'));
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = JSON.stringify(errorData, null, 2);
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Error info copied to clipboard!');
        }
    };

    render() {
        if (this.state.hasError) {
            // Fallback UI for errors
            return (
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                    <div style={{
                        maxWidth: '400px',
                        padding: '30px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb'
                    }}>
                        <h2 style={{
                            color: '#374151',
                            marginBottom: '16px',
                            fontSize: '24px',
                            fontWeight: '600'
                        }}>
                            Something went wrong
                        </h2>
                        <p style={{
                            color: '#6b7280',
                            marginBottom: '20px',
                            fontSize: '16px',
                            lineHeight: '1.5'
                        }}>
                            We're sorry, but there was an error loading the page. Please try refreshing or contact support if the problem persists.
                        </p>

                        {/* Error details for Facebook browser */}
                        {this.state.error && (
                            <div style={{
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '6px',
                                padding: '12px',
                                marginBottom: '20px',
                                textAlign: 'left'
                            }}>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#991b1b',
                                    margin: '0 0 8px 0',
                                    fontWeight: '600'
                                }}>
                                    Error: {this.state.error.name}
                                </p>
                                <p style={{
                                    fontSize: '12px',
                                    color: '#7f1d1d',
                                    margin: '0',
                                    wordBreak: 'break-word'
                                }}>
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <div style={{ marginBottom: '15px' }}>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    backgroundColor: '#5DC9F4',
                                    color: 'white',
                                    padding: '12px 20px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    margin: '5px'
                                }}
                            >
                                Refresh Page
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#5DC9F4',
                                    padding: '12px 20px',
                                    border: '2px solid #5DC9F4',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    margin: '5px'
                                }}
                            >
                                Go Home
                            </button>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <button
                                onClick={this.copyErrorInfo}
                                style={{
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    padding: '8px 16px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    margin: '3px'
                                }}
                            >
                                Copy Error Info
                            </button>
                            <button
                                onClick={() => window.location.href = '/diagnostics'}
                                style={{
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    padding: '8px 16px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    margin: '3px'
                                }}
                            >
                                Run Diagnostics
                            </button>
                            <button
                                onClick={() => window.open('https://perfectobd.com', '_blank')}
                                style={{
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    padding: '8px 16px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    margin: '3px'
                                }}
                            >
                                Open in Browser
                            </button>
                        </div>

                        {/* Show error details in development mode or for debugging */}
                        <details style={{ marginTop: '15px', textAlign: 'left' }}>
                            <summary style={{
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '12px',
                                color: '#6b7280'
                            }}>
                                Technical Details
                            </summary>
                            <div style={{
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                borderRadius: '4px',
                                padding: '10px',
                                marginTop: '8px',
                                fontSize: '11px',
                                color: '#374151',
                                maxHeight: '150px',
                                overflow: 'auto'
                            }}>
                                <p><strong>Browser:</strong> {navigator.userAgent}</p>
                                <p><strong>URL:</strong> {window.location.href}</p>
                                <p><strong>Viewport:</strong> {window.innerWidth}x{window.innerHeight}</p>
                                {this.state.error && (
                                    <>
                                        <p><strong>Error Type:</strong> {this.state.error.name}</p>
                                        <p><strong>Error Message:</strong> {this.state.error.message}</p>
                                        {this.state.error.stack && (
                                            <p><strong>Stack:</strong><br />
                                                <code style={{ fontSize: '10px', wordBreak: 'break-all' }}>
                                                    {this.state.error.stack.substring(0, 200)}...
                                                </code>
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 