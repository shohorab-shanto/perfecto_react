/**
 * Node API Fallback Service
 * Provides graceful fallbacks when Node API is unreachable (especially in Facebook iOS browser)
 */

// Check if we're in Facebook iOS browser
export const isFacebookIOSBrowser = () => {
    const userAgent = navigator.userAgent || '';
    const isFacebook = /FBAN|FBAV|Instagram|FB_IAB|FB4A|FBIOS|FBANDROID/.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    return isFacebook && isIOS;
};

// Node API endpoints that commonly fail
const NODE_API_ENDPOINTS = {
    HOME_DATA: 'https://node.perfectobd.com/api/node/get-home-web',
    BRANDS: 'https://node.perfectobd.com/api/node/brand',
    COLORS: 'https://node.perfectobd.com/api/node/color',
    CATEGORIES: 'https://node.perfectobd.com/api/node/category',
    OFFERS: 'https://node.perfectobd.com/api/node/get-available-offers',
    SHIPPING: 'https://node.perfectobd.com/api/node/getShippingCharge',
    CONTACT: 'https://node.perfectobd.com/api/node/get-general-setting'
};

// Fallback data for critical endpoints
const FALLBACK_DATA = {
    homeData: {
        data: [],
        message: 'Home content temporarily unavailable'
    },
    brands: {
        data: [],
        message: 'Brand data temporarily unavailable'
    },
    categories: {
        data: [],
        message: 'Category data temporarily unavailable'
    },
    filters: {
        data: [],
        message: 'Filter data temporarily unavailable'
    }
};

// Enhanced axios wrapper for Node API calls
export const nodeAPICall = async (url, options = {}) => {
    const defaultOptions = {
        timeout: 8000, // Shorter timeout for Facebook browser
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'User-Agent': navigator.userAgent
        },
        ...options
    };

    try {
        console.log(`Attempting Node API call: ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            ...defaultOptions,
            signal: AbortSignal.timeout(defaultOptions.timeout)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Node API call successful: ${url}`);
        return data;

    } catch (error) {
        console.error(`Node API call failed: ${url}`, error.message);

        if (isFacebookIOSBrowser()) {
            console.warn('Node API failure detected in Facebook iOS browser - using fallback');
        }

        // Return appropriate fallback based on endpoint
        return getFallbackForEndpoint(url);
    }
};

// Get appropriate fallback data based on the endpoint
const getFallbackForEndpoint = (url) => {
    if (url.includes('get-home-web')) {
        return FALLBACK_DATA.homeData;
    } else if (url.includes('brand')) {
        return FALLBACK_DATA.brands;
    } else if (url.includes('category')) {
        return FALLBACK_DATA.categories;
    } else if (url.includes('color') || url.includes('preference') || url.includes('formulation')) {
        return FALLBACK_DATA.filters;
    }

    // Default fallback
    return {
        data: [],
        message: 'Service temporarily unavailable',
        fallback: true
    };
};

// Test Node API connectivity
export const testNodeAPIConnectivity = async () => {
    const testEndpoint = 'https://node.perfectobd.com/api/node/get-home-web';

    try {
        const response = await fetch(testEndpoint, {
            method: 'HEAD',
            timeout: 5000,
            signal: AbortSignal.timeout(5000)
        });

        return {
            accessible: response.ok,
            status: response.status,
            message: response.ok ? 'Node API accessible' : `HTTP ${response.status}`
        };
    } catch (error) {
        return {
            accessible: false,
            status: 0,
            message: error.message,
            isFacebookBrowser: isFacebookIOSBrowser()
        };
    }
};

// Log Node API status for debugging
export const logNodeAPIStatus = async () => {
    if (isFacebookIOSBrowser()) {
        console.log('🔍 Facebook iOS browser detected - checking Node API status...');
        const status = await testNodeAPIConnectivity();
        console.log('Node API Status:', status);

        if (!status.accessible) {
            console.warn('⚠️ Node API is not accessible in Facebook iOS browser');
            console.log('This may cause the app to show a white screen');
            console.log('Fallback mechanisms are active');
        }
    }
};

export default {
    nodeAPICall,
    testNodeAPIConnectivity,
    logNodeAPIStatus,
    isFacebookIOSBrowser,
    FALLBACK_DATA
}; 