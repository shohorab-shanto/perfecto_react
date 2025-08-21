// Facebook iOS Browser Debugger Utility
class FacebookDebugger {
    constructor() {
        this.logs = [];
        this.isEnabled = this.isFacebookBrowser() && this.isIOS();

        if (this.isEnabled) {
            this.initialize();
        }
    }

    isFacebookBrowser() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return userAgent.includes('FBAN') ||
            userAgent.includes('FBAV') ||
            userAgent.includes('Instagram') ||
            userAgent.includes('FB_IAB') ||
            userAgent.includes('FB4A') ||
            userAgent.includes('FBIOS') ||
            userAgent.includes('FBANDROID');
    }

    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    initialize() {
        this.log('Facebook iOS Browser Debugger initialized');
        this.detectBrowserInfo();
        this.checkCriticalAPIs();
        this.monitorRenderingIssues();
        this.checkNetworkConnectivity();
        this.setupPerformanceMonitoring();

        // Expose debugger globally for manual inspection
        window.facebookDebugger = this;
    }

    log(message, level = 'info', data = null) {
        const timestamp = new Date().toISOString();
        const entry = {
            timestamp,
            level,
            message,
            data,
            userAgent: navigator.userAgent
        };

        this.logs.push(entry);
        console.log(`[Facebook Debugger ${level.toUpperCase()}] ${message}`, data || '');

        // Keep only last 100 logs to prevent memory issues
        if (this.logs.length > 100) {
            this.logs = this.logs.slice(-100);
        }
    }

    detectBrowserInfo() {
        const info = {
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio
            },
            screen: {
                width: screen.width,
                height: screen.height,
                orientation: screen.orientation?.type || 'unknown'
            },
            features: {
                touch: 'ontouchstart' in window,
                webgl: !!window.WebGLRenderingContext,
                webgl2: !!window.WebGL2RenderingContext,
                serviceWorker: 'serviceWorker' in navigator,
                pushManager: 'PushManager' in window
            }
        };

        this.log('Browser info detected', 'info', info);
        return info;
    }

    checkCriticalAPIs() {
        const apis = {
            ResizeObserver: !!window.ResizeObserver,
            IntersectionObserver: !!window.IntersectionObserver,
            MutationObserver: !!window.MutationObserver,
            PerformanceObserver: !!window.PerformanceObserver,
            RequestAnimationFrame: !!window.requestAnimationFrame,
            WebComponents: !!window.customElements,
            Proxy: typeof Proxy !== 'undefined',
            Promise: typeof Promise !== 'undefined',
            Fetch: typeof fetch !== 'undefined',
            LocalStorage: (() => {
                try {
                    localStorage.setItem('test', 'test');
                    localStorage.removeItem('test');
                    return true;
                } catch (e) {
                    return false;
                }
            })(),
            SessionStorage: (() => {
                try {
                    sessionStorage.setItem('test', 'test');
                    sessionStorage.removeItem('test');
                    return true;
                } catch (e) {
                    return false;
                }
            })()
        };

        const missingAPIs = Object.entries(apis)
            .filter(([name, available]) => !available)
            .map(([name]) => name);

        if (missingAPIs.length > 0) {
            this.log('Missing critical APIs', 'warning', missingAPIs);
        } else {
            this.log('All critical APIs available', 'info');
        }

        return apis;
    }

    monitorRenderingIssues() {
        // Check if React root is rendering
        let checkCount = 0;
        const maxChecks = 10;

        const checkReactRender = () => {
            checkCount++;
            const root = document.getElementById('root');

            if (!root) {
                this.log('React root element not found', 'error');
                return;
            }

            if (root.children.length === 0) {
                this.log(`React not rendered yet (check ${checkCount}/${maxChecks})`, 'warning');

                if (checkCount < maxChecks) {
                    setTimeout(checkReactRender, 1000);
                } else {
                    this.log('React failed to render after 10 seconds', 'error');
                    this.showEmergencyFallback();
                }
            } else {
                this.log('React successfully rendered', 'info');
            }
        };

        setTimeout(checkReactRender, 2000);
    }

    checkNetworkConnectivity() {
        // Test basic connectivity to the API
        const testEndpoint = 'https://app.perfectobd.com/api/';

        fetch(testEndpoint, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
        })
            .then(() => {
                this.log('API connectivity test passed', 'info');
            })
            .catch(error => {
                this.log('API connectivity test failed', 'error', error.message);
            });
    }

    setupPerformanceMonitoring() {
        // Monitor for performance issues
        if (window.PerformanceObserver) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.duration > 100) { // Log slow operations
                            this.log(`Slow operation detected: ${entry.name}`, 'warning', {
                                duration: entry.duration,
                                type: entry.entryType
                            });
                        }
                    });
                });

                observer.observe({ entryTypes: ['measure', 'navigation'] });
            } catch (error) {
                this.log('Failed to setup performance monitoring', 'warning', error.message);
            }
        }
    }

    showEmergencyFallback() {
        const fallbackHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            ">
                <div style="text-align: center; padding: 20px;">
                    <h1 style="color: #333; margin-bottom: 20px;">Loading Perfecto</h1>
                    <p style="color: #666; margin-bottom: 30px;">
                        We're preparing your beauty destination. This may take a moment in the Facebook app.
                    </p>
                    <button onclick="window.location.reload()" style="
                        background: #5DC9F4;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 8px;
                        font-size: 16px;
                        cursor: pointer;
                        margin: 0 10px;
                    ">
                        Refresh Page
                    </button>
                    <button onclick="window.open('https://perfectobd.com', '_blank')" style="
                        background: transparent;
                        color: #5DC9F4;
                        border: 2px solid #5DC9F4;
                        padding: 15px 30px;
                        border-radius: 8px;
                        font-size: 16px;
                        cursor: pointer;
                        margin: 0 10px;
                    ">
                        Open in Browser
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', fallbackHTML);
        this.log('Emergency fallback UI displayed', 'info');
    }

    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }

    clearLogs() {
        this.logs = [];
        this.log('Logs cleared', 'info');
    }

    // Method to manually trigger diagnostics
    runDiagnostics() {
        this.log('Running manual diagnostics', 'info');
        this.detectBrowserInfo();
        this.checkCriticalAPIs();
        this.checkNetworkConnectivity();

        return {
            logs: this.logs,
            summary: {
                totalLogs: this.logs.length,
                errors: this.logs.filter(log => log.level === 'error').length,
                warnings: this.logs.filter(log => log.level === 'warning').length
            }
        };
    }
}

// Initialize debugger if in Facebook iOS browser
const facebookDebuggerInstance = new FacebookDebugger();

export default facebookDebuggerInstance; 