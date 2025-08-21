import React from 'react';
import { Link } from 'react-router-dom';

class NodeAPIErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            isNodeAPIError: false
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            isNodeAPIError: error.message && (
                error.message.includes('node.perfectobd.com') ||
                error.message.includes('Load failed') ||
                error.message.includes('NetworkError')
            )
        };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error
        console.error('NodeAPIErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Check if we're in Facebook iOS browser
        const userAgent = navigator.userAgent || '';
        const isFacebookBrowser = /FBAN|FBAV|Instagram|FB_IAB|FB4A|FBIOS|FBANDROID/.test(userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        if (isFacebookBrowser && isIOS) {
            console.warn('Error occurred in Facebook iOS browser - likely Node API related');

            // Store error info in localStorage for debugging
            const errorData = {
                error: error.toString(),
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                isFacebookBrowser: true,
                isIOS: true
            };

            try {
                localStorage.setItem('nodeapi_error_debug', JSON.stringify(errorData));
            } catch (e) {
                console.warn('Could not store error data in localStorage');
            }
        }
    }

    render() {
        if (this.state.hasError) {
            const userAgent = navigator.userAgent || '';
            const isFacebookBrowser = /FBAN|FBAV|Instagram|FB_IAB|FB4A|FBIOS|FBANDROID/.test(userAgent);
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isFacebookIOSBrowser = isFacebookBrowser && isIOS;

            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    backgroundColor: '#f9fafb',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                    <div style={{
                        maxWidth: '500px',
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '30px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center'
                    }}>
                        <div style={{ marginBottom: '20px' }}>
                            {isFacebookIOSBrowser ? (
                                <>
                                    <h2 style={{
                                        color: '#dc2626',
                                        marginBottom: '16px',
                                        fontSize: '24px',
                                        fontWeight: '600'
                                    }}>
                                        ⚠️ Facebook Browser Issue
                                    </h2>
                                    <p style={{
                                        color: '#6b7280',
                                        marginBottom: '20px',
                                        lineHeight: '1.6'
                                    }}>
                                        Facebook's iOS browser is blocking some features needed for Perfecto.
                                        This is a known limitation of Facebook's embedded browser.
                                    </p>
                                    <div style={{
                                        backgroundColor: '#fef3c7',
                                        border: '1px solid #f59e0b',
                                        borderRadius: '6px',
                                        padding: '15px',
                                        marginBottom: '20px',
                                        color: '#92400e',
                                        fontSize: '14px',
                                        textAlign: 'left'
                                    }}>
                                        <strong>Why this happens:</strong>
                                        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                            <li>Facebook's browser blocks certain API calls</li>
                                            <li>Some content servers are not accessible</li>
                                            <li>Limited JavaScript functionality</li>
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 style={{
                                        color: '#dc2626',
                                        marginBottom: '16px',
                                        fontSize: '24px',
                                        fontWeight: '600'
                                    }}>
                                        🔧 Something went wrong
                                    </h2>
                                    <p style={{
                                        color: '#6b7280',
                                        marginBottom: '20px',
                                        lineHeight: '1.6'
                                    }}>
                                        We're having technical difficulties loading the page.
                                        Please try one of the options below.
                                    </p>
                                </>
                            )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    backgroundColor: '#5DC9F4',
                                    color: 'white',
                                    padding: '12px 24px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    width: '100%',
                                    marginBottom: '10px'
                                }}
                            >
                                🔄 Try Again
                            </button>

                            {isFacebookIOSBrowser && (
                                <button
                                    onClick={() => window.open('https://perfectobd.com', '_blank')}
                                    style={{
                                        backgroundColor: '#1f2937',
                                        color: 'white',
                                        padding: '12px 24px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        width: '100%',
                                        marginBottom: '10px'
                                    }}
                                >
                                    🌐 Open in Browser (Recommended)
                                </button>
                            )}

                            <Link
                                to="/product-filter"
                                style={{
                                    display: 'block',
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    marginBottom: '10px'
                                }}
                            >
                                🛍️ Browse Products
                            </Link>

                            <Link
                                to="/diagnostics"
                                style={{
                                    display: 'block',
                                    backgroundColor: '#f59e0b',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    textDecoration: 'none',
                                    fontSize: '12px'
                                }}
                            >
                                🔍 Run Diagnostics
                            </Link>
                        </div>

                        {/* Technical details (collapsible) */}
                        <details style={{
                            textAlign: 'left',
                            fontSize: '12px',
                            color: '#6b7280',
                            marginTop: '20px'
                        }}>
                            <summary style={{ cursor: 'pointer', fontWeight: '500' }}>
                                🔧 Technical Details
                            </summary>
                            <div style={{
                                marginTop: '10px',
                                padding: '10px',
                                backgroundColor: '#f3f4f6',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                                fontSize: '11px'
                            }}>
                                <strong>Error:</strong> {this.state.error && this.state.error.toString()}<br />
                                <strong>Browser:</strong> {isFacebookIOSBrowser ? 'Facebook iOS' : 'Other'}<br />
                                <strong>Time:</strong> {new Date().toLocaleString()}<br />
                                <strong>Type:</strong> {this.state.isNodeAPIError ? 'Node API Error' : 'General Error'}
                            </div>
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default NodeAPIErrorBoundary; 