/**
 * Service Worker Manager for Facebook iOS Browser Compatibility
 * 
 * This utility helps manage service worker issues that can cause white screens
 * in Facebook's embedded iOS browser
 */

// Facebook iOS browser detection
export const isFacebookIOSBrowser = () => {
    const userAgent = navigator.userAgent || '';
    const isFacebook = /FBAN|FBAV|Instagram|FB_IAB|FB4A|FBIOS|FBANDROID/.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    return isFacebook && isIOS;
};

// Check if service workers are properly supported
export const isServiceWorkerSupported = () => {
    return 'serviceWorker' in navigator;
};

// Get all service worker registrations
export const getServiceWorkerRegistrations = async () => {
    if (!isServiceWorkerSupported()) {
        return [];
    }

    try {
        return await navigator.serviceWorker.getRegistrations();
    } catch (error) {
        console.warn('Failed to get service worker registrations:', error);
        return [];
    }
};

// Unregister all service workers (useful for Facebook iOS browser)
export const unregisterAllServiceWorkers = async () => {
    console.log('🧹 Cleaning up service workers...');

    if (!isServiceWorkerSupported()) {
        console.log('Service workers not supported - skipping cleanup');
        return { success: true, cleaned: 0 };
    }

    try {
        const registrations = await getServiceWorkerRegistrations();
        console.log(`Found ${registrations.length} service worker registrations`);

        let cleanedCount = 0;
        for (const registration of registrations) {
            try {
                console.log(`Unregistering service worker: ${registration.scope}`);
                const success = await registration.unregister();
                if (success) {
                    cleanedCount++;
                    console.log(`✅ Successfully unregistered: ${registration.scope}`);
                } else {
                    console.warn(`⚠️ Failed to unregister: ${registration.scope}`);
                }
            } catch (error) {
                console.warn(`Error unregistering ${registration.scope}:`, error);
            }
        }

        return { success: true, cleaned: cleanedCount };
    } catch (error) {
        console.error('Failed to unregister service workers:', error);
        return { success: false, error: error.message };
    }
};

// Clear all caches
export const clearAllCaches = async () => {
    console.log('🗑️ Clearing all caches...');

    if (!('caches' in window)) {
        console.log('Cache API not supported - skipping cache cleanup');
        return { success: true, cleared: 0 };
    }

    try {
        const cacheNames = await caches.keys();
        console.log(`Found ${cacheNames.length} caches to clear`);

        let clearedCount = 0;
        for (const cacheName of cacheNames) {
            try {
                console.log(`Clearing cache: ${cacheName}`);
                const success = await caches.delete(cacheName);
                if (success) {
                    clearedCount++;
                    console.log(`✅ Successfully cleared cache: ${cacheName}`);
                } else {
                    console.warn(`⚠️ Failed to clear cache: ${cacheName}`);
                }
            } catch (error) {
                console.warn(`Error clearing cache ${cacheName}:`, error);
            }
        }

        return { success: true, cleared: clearedCount };
    } catch (error) {
        console.error('Failed to clear caches:', error);
        return { success: false, error: error.message };
    }
};

// Full service worker cleanup for Facebook iOS browser
export const performServiceWorkerCleanup = async () => {
    if (!isFacebookIOSBrowser()) {
        console.log('Not in Facebook iOS browser - skipping service worker cleanup');
        return {
            success: true,
            reason: 'not_facebook_ios',
            serviceWorkers: 0,
            caches: 0
        };
    }

    console.log('🔧 Performing service worker cleanup for Facebook iOS browser');

    try {
        // Unregister service workers
        const swResult = await unregisterAllServiceWorkers();

        // Clear caches
        const cacheResult = await clearAllCaches();

        const result = {
            success: swResult.success && cacheResult.success,
            serviceWorkers: swResult.cleaned || 0,
            caches: cacheResult.cleared || 0,
            errors: []
        };

        if (!swResult.success) {
            result.errors.push(`Service worker cleanup failed: ${swResult.error}`);
        }

        if (!cacheResult.success) {
            result.errors.push(`Cache cleanup failed: ${cacheResult.error}`);
        }

        if (result.success) {
            console.log(`✅ Service worker cleanup completed: ${result.serviceWorkers} SWs, ${result.caches} caches`);
        } else {
            console.warn('⚠️ Service worker cleanup had errors:', result.errors);
        }

        return result;
    } catch (error) {
        console.error('Service worker cleanup failed:', error);
        return {
            success: false,
            error: error.message,
            serviceWorkers: 0,
            caches: 0
        };
    }
};

// Prevent PWA installation in Facebook browser
export const preventPWAInstall = () => {
    if (isFacebookIOSBrowser()) {
        window.addEventListener('beforeinstallprompt', function (event) {
            console.log('🚫 Preventing PWA install prompt in Facebook iOS browser');
            event.preventDefault();
            return false;
        });

        // Also prevent any manual install attempts
        window.addEventListener('appinstalled', function (event) {
            console.log('🚫 PWA installation blocked in Facebook iOS browser');
        });
    }
};

// Service worker health check
export const checkServiceWorkerHealth = async () => {
    const health = {
        supported: isServiceWorkerSupported(),
        active: false,
        registrations: 0,
        caches: 0,
        errors: []
    };

    if (!health.supported) {
        return health;
    }

    try {
        // Check registrations
        const registrations = await getServiceWorkerRegistrations();
        health.registrations = registrations.length;
        health.active = registrations.some(reg => reg.active);

        // Check caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            health.caches = cacheNames.length;
        }

        // Check for controller
        if (navigator.serviceWorker.controller) {
            health.controller = navigator.serviceWorker.controller.scriptURL;
        }

    } catch (error) {
        health.errors.push(error.message);
    }

    return health;
};

// Initialize service worker management
export const initializeServiceWorkerManagement = () => {
    console.log('🔧 Initializing service worker management');

    // Prevent PWA installation in Facebook browser
    preventPWAInstall();

    // Add global function for manual cleanup
    window.cleanupServiceWorkers = performServiceWorkerCleanup;
    window.checkServiceWorkerHealth = checkServiceWorkerHealth;

    console.log('📋 Service worker management commands available:');
    console.log('🧹 cleanupServiceWorkers() - Clean up all service workers and caches');
    console.log('🔍 checkServiceWorkerHealth() - Check service worker status');

    // Automatic cleanup for Facebook iOS browser
    if (isFacebookIOSBrowser()) {
        console.log('🤖 Auto-cleanup enabled for Facebook iOS browser');
        // Delay the cleanup to avoid blocking initial load
        setTimeout(() => {
            performServiceWorkerCleanup();
        }, 1000);
    }
};

export default {
    isFacebookIOSBrowser,
    isServiceWorkerSupported,
    getServiceWorkerRegistrations,
    unregisterAllServiceWorkers,
    clearAllCaches,
    performServiceWorkerCleanup,
    preventPWAInstall,
    checkServiceWorkerHealth,
    initializeServiceWorkerManagement
}; 