import React, { useState, useEffect } from 'react';

const DiagnosticPage = () => {
    const [diagnostics, setDiagnostics] = useState({
        browserInfo: null,
        apiTests: null,
        networkTests: null,
        storageTests: null,
        renderTests: null
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        runDiagnostics();
    }, []);

    const runDiagnostics = async () => {
        try {
            // Browser Detection
            const browserInfo = {
                userAgent: navigator.userAgent,
                isFacebookBrowser: /FBAN|FBAV|Instagram|FB_IAB|FB4A|FBIOS|FBANDROID/.test(navigator.userAgent),
                isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                devicePixelRatio: window.devicePixelRatio,
                language: navigator.language,
                platform: navigator.platform,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine
            };

            // API Tests
            const apiTests = {
                ResizeObserver: !!window.ResizeObserver,
                IntersectionObserver: !!window.IntersectionObserver,
                MutationObserver: !!window.MutationObserver,
                PerformanceObserver: !!window.PerformanceObserver,
                RequestAnimationFrame: !!window.requestAnimationFrame,
                WebComponents: !!window.customElements,
                Proxy: typeof Proxy !== 'undefined',
                Promise: typeof Promise !== 'undefined',
                Fetch: typeof fetch !== 'undefined',
                WebGL: !!window.WebGLRenderingContext,
                ServiceWorker: 'serviceWorker' in navigator,
                PushManager: 'PushManager' in window,
                MediaDevices: !!navigator.mediaDevices,
                Geolocation: !!navigator.geolocation
            };

            // Storage Tests
            const storageTests = {
                localStorage: (() => {
                    try {
                        localStorage.setItem('test', 'test');
                        localStorage.removeItem('test');
                        return true;
                    } catch (e) {
                        return false;
                    }
                })(),
                sessionStorage: (() => {
                    try {
                        sessionStorage.setItem('test', 'test');
                        sessionStorage.removeItem('test');
                        return true;
                    } catch (e) {
                        return false;
                    }
                })(),
                indexedDB: !!window.indexedDB,
                cacheAPI: 'caches' in window
            };

            // Network Tests
            let networkTests = {
                apiConnection: 'testing...',
                nodeApiConnection: 'testing...'
            };

            setDiagnostics({
                browserInfo,
                apiTests,
                storageTests,
                networkTests,
                renderTests: { reactRendered: true }
            });

            // Test network connectivity
            try {
                const response = await fetch('https://app.perfectobd.com/api/', {
                    method: 'HEAD',
                    mode: 'no-cors',
                    cache: 'no-cache'
                });
                networkTests.apiConnection = 'success';
            } catch (error) {
                networkTests.apiConnection = `failed: ${error.message}`;
            }

            try {
                const response = await fetch('https://node.perfectobd.com/api/node/get-home-web', {
                    method: 'HEAD',
                    mode: 'no-cors',
                    cache: 'no-cache'
                });
                networkTests.nodeApiConnection = 'success';
            } catch (error) {
                networkTests.nodeApiConnection = `failed: ${error.message}`;
            }

            setDiagnostics(prev => ({
                ...prev,
                networkTests
            }));

        } catch (error) {
            console.error('Error running diagnostics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyResults = () => {
        const results = JSON.stringify(diagnostics, null, 2);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(results)
                .then(() => alert('Diagnostic results copied to clipboard!'))
                .catch(() => alert('Failed to copy results'));
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = results;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Diagnostic results copied to clipboard!');
        }
    };

    const TestResult = ({ label, value, isGood = null }) => (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid #e5e7eb'
        }}>
            <span style={{ fontSize: '14px', color: '#374151' }}>{label}</span>
            <span style={{
                fontSize: '12px',
                color: isGood === true ? '#059669' : isGood === false ? '#dc2626' : '#6b7280',
                fontWeight: '500',
                maxWidth: '150px',
                textAlign: 'right',
                wordBreak: 'break-word'
            }}>
                {typeof value === 'boolean' ? (value ? 'Available' : 'Missing') : value?.toString()}
            </span>
        </div>
    );

    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #e5e7eb',
                        borderTop: '4px solid #5DC9F4',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <p>Running diagnostics...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            padding: '20px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '30px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: '#374151', marginBottom: '8px' }}>Perfecto Diagnostics</h1>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Facebook iOS Browser Compatibility Test
                    </p>
                    <button
                        onClick={copyResults}
                        style={{
                            backgroundColor: '#5DC9F4',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        Copy Results
                    </button>
                </div>

                {/* Browser Info */}
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ color: '#374151', fontSize: '18px', marginBottom: '15px' }}>
                        Browser Information
                    </h2>
                    <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '6px' }}>
                        {diagnostics.browserInfo && Object.entries(diagnostics.browserInfo).map(([key, value]) => (
                            <TestResult
                                key={key}
                                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                value={value}
                                isGood={key === 'isFacebookBrowser' ? value : key === 'isIOS' ? value : null}
                            />
                        ))}
                    </div>
                </section>

                {/* API Tests */}
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ color: '#374151', fontSize: '18px', marginBottom: '15px' }}>
                        Browser API Support
                    </h2>
                    <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '6px' }}>
                        {diagnostics.apiTests && Object.entries(diagnostics.apiTests).map(([key, value]) => (
                            <TestResult
                                key={key}
                                label={key.replace(/([A-Z])/g, ' $1')}
                                value={value}
                                isGood={value}
                            />
                        ))}
                    </div>
                </section>

                {/* Storage Tests */}
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ color: '#374151', fontSize: '18px', marginBottom: '15px' }}>
                        Storage Support
                    </h2>
                    <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '6px' }}>
                        {diagnostics.storageTests && Object.entries(diagnostics.storageTests).map(([key, value]) => (
                            <TestResult
                                key={key}
                                label={key.replace(/([A-Z])/g, ' $1').replace(/API$/, ' API')}
                                value={value}
                                isGood={value}
                            />
                        ))}
                    </div>
                </section>

                {/* Network Tests */}
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ color: '#374151', fontSize: '18px', marginBottom: '15px' }}>
                        Network Connectivity
                    </h2>
                    <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '6px' }}>
                        {diagnostics.networkTests && Object.entries(diagnostics.networkTests).map(([key, value]) => (
                            <TestResult
                                key={key}
                                label={key.replace(/([A-Z])/g, ' $1').replace(/([a-z])([A-Z])/g, '$1 $2')}
                                value={value}
                                isGood={value === 'success'}
                            />
                        ))}
                    </div>
                </section>

                <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{
                            backgroundColor: '#6b7280',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={runDiagnostics}
                        style={{
                            backgroundColor: '#059669',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        Run Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiagnosticPage; 