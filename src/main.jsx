import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "./index.css";
import "./scss/styles.scss";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes.jsx";
import LogicProvider from "./providers/LogicProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./providers/AuthProvider.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { Toaster } from "sonner";
import { PersistGate } from "redux-persist/integration/react";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.jsx";
import "./utils/facebookDebugger.js";
import { logNodeAPIStatus } from "./utils/nodeApiFallback.js";
import { initializeServiceWorkerManagement } from "./utils/serviceWorkerManager.js";

// Enhanced Facebook browser detection
const isFacebookBrowser = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return userAgent.includes('FBAN') ||
        userAgent.includes('FBAV') ||
        userAgent.includes('Instagram') ||
        userAgent.includes('FB_IAB') ||
        userAgent.includes('FB4A') ||
        userAgent.includes('FBIOS') ||
        userAgent.includes('FBANDROID');
};

// Enhanced iOS detection
const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Enhanced initialization with Node API check
async function initializeApp() {
    // Initialize service worker management first
    initializeServiceWorkerManagement();

    // Handle service worker issues in Facebook iOS browser
    if (isFacebookBrowser() && isIOS()) {
        console.log('🔧 Facebook iOS browser detected - managing service workers');

        // The service worker manager will handle cleanup automatically
        // But we can also do additional manual cleanup here if needed
        try {
            // Additional safety: check for any problematic service workers
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                const controllerURL = navigator.serviceWorker.controller.scriptURL;
                console.log('Current service worker controller:', controllerURL);

                // If there's a Firebase service worker active, it might be problematic
                if (controllerURL.includes('firebase-messaging-sw.js')) {
                    console.log('🔄 Firebase service worker detected - this may cause issues');
                }
            }
        } catch (error) {
            console.warn('Service worker controller check failed:', error.message);
        }

        // Prevent automatic PWA installation prompts
        window.addEventListener('beforeinstallprompt', function (event) {
            console.log('Preventing PWA install prompt in Facebook browser');
            event.preventDefault();
            return false;
        });
    }

    // Log Node API status for debugging
    await logNodeAPIStatus();

    // Apply Facebook browser fixes
    if (isFacebookBrowser() && isIOS()) {
        console.log('Facebook iOS browser detected - applying compatibility fixes');

        // Add browser class for CSS targeting
        document.body.classList.add('facebook-browser');
        document.documentElement.classList.add('facebook-browser');

        // Add iOS-specific styles
        const iosStyles = document.createElement('style');
        iosStyles.textContent = `
            .ios-facebook-browser {
                -webkit-overflow-scrolling: touch;
                overflow-x: hidden;
                -webkit-transform: translateZ(0);
                transform: translateZ(0);
            }
            
            .ios-facebook-browser * {
                -webkit-transform: translateZ(0);
                transform: translateZ(0);
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
            }
            
            .ios-facebook-browser #root {
                min-height: 100vh;
                position: relative;
                z-index: 1;
            }
        `;
        document.head.appendChild(iosStyles);

        // Prevent iOS zoom on input focus
        const preventZoom = () => {
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.style.fontSize = '16px';
            });
        };

        // Apply after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', preventZoom);
        } else {
            preventZoom();
        }
    }

    // Fix for Facebook browser JavaScript engine issues
    window.addEventListener('error', (event) => {
        console.error('Global error in Facebook browser:', event.error);
        // Prevent white screen by ensuring React still renders
        if (event.error && event.error.message && event.error.message.includes('ResizeObserver')) {
            event.preventDefault();
        }
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection in Facebook browser:', event.reason);
        // Prevent white screen by continuing execution
        event.preventDefault();
    });
}

// Enhanced axios configuration
axios.defaults.baseURL = "https://app.perfectobd.com/api/";
axios.defaults.timeout = 15000; // 15 second timeout

// Add retry logic for failed requests
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (isFacebookBrowser() && isIOS()) {
            console.log('Network error in Facebook iOS browser:', error.message);
        }
        return Promise.reject(error);
    }
);

// Enhanced query client with better error handling
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                // Retry less aggressively in Facebook browser
                if (isFacebookBrowser()) {
                    return failureCount < 2;
                }
                return failureCount < 3;
            },
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
        },
        mutations: {
            retry: isFacebookBrowser() ? 1 : 3,
        },
    },
});

// Loading component for PersistGate
const LoadingComponent = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
        <div style={{
            textAlign: 'center',
            padding: '20px'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #5DC9F4',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
            }}></div>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading Perfecto...</p>
        </div>
    </div>
);

// Add CSS animation for loading spinner
const spinnerStyles = document.createElement('style');
spinnerStyles.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(spinnerStyles);

// Initialize app with async setup
initializeApp().then(() => {
    ReactDOM.createRoot(document.getElementById("root")).render(
        <React.StrictMode>
            <ErrorBoundary>
                <AuthProvider>
                    <Provider store={store}>
                        <PersistGate loading={<LoadingComponent />} persistor={persistor}>
                            <LogicProvider>
                                <QueryClientProvider client={queryClient}>
                                    <ErrorBoundary>
                                        <RouterProvider router={router} />
                                    </ErrorBoundary>
                                </QueryClientProvider>
                            </LogicProvider>
                        </PersistGate>
                    </Provider>
                    {/* <Toaster /> */}
                </AuthProvider>
            </ErrorBoundary>
        </React.StrictMode>
    );
}).catch((error) => {
    console.error('App initialization failed:', error);
    // Still try to render the app even if initialization fails
    ReactDOM.createRoot(document.getElementById("root")).render(
        <React.StrictMode>
            <ErrorBoundary>
                <AuthProvider>
                    <Provider store={store}>
                        <PersistGate loading={<LoadingComponent />} persistor={persistor}>
                            <LogicProvider>
                                <QueryClientProvider client={queryClient}>
                                    <ErrorBoundary>
                                        <RouterProvider router={router} />
                                    </ErrorBoundary>
                                </QueryClientProvider>
                            </LogicProvider>
                        </PersistGate>
                    </Provider>
                    {/* <Toaster /> */}
                </AuthProvider>
            </ErrorBoundary>
        </React.StrictMode>
    );
});
