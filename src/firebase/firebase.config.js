// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getMessaging } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Enhanced browser detection for Firebase compatibility
const isFacebookBrowser = () => {
    const userAgent = navigator.userAgent || '';
    return /FBAN|FBAV|Instagram|FB_IAB|FB4A|FBIOS|FBANDROID/.test(userAgent);
};

const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const isInAppBrowser = () => {
    const userAgent = navigator.userAgent || '';
    // Detect common in-app browsers that may have Firebase limitations
    return /FBAN|FBAV|Instagram|FB_IAB|FB4A|FBIOS|FBANDROID|Line|Twitter|WeChat|WhatsApp/.test(userAgent);
};

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBpYA4j53WuyZ1XYaLz2XP2mBIbfXFa_qY",
    authDomain: "perfecto-base-app.firebaseapp.com",
    projectId: "perfecto-base-app",
    storageBucket: "perfecto-base-app.appspot.com",
    messagingSenderId: "1042984089947",
    appId: "1:1042984089947:web:bde19ac9c6baa4580dc27e",
    measurementId: "G-TDG8YSMS5F"
};

// Initialize Firebase with defensive error handling for in-app browsers
let firebaseApp;
let messaging;

try {
    // Check if we're in a problematic browser environment
    if (isInAppBrowser()) {
        console.log('🚫 In-app browser detected - Firebase may have limitations');

        if (isFacebookBrowser() && isIOS()) {
            console.log('⚠️ Facebook iOS browser detected - Firebase initialization may fail');
        }
    }

    // Attempt Firebase initialization
    console.log('🔥 Attempting Firebase initialization...');
    firebaseApp = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully');

    // Attempt messaging initialization
    try {
        messaging = getMessaging(firebaseApp);
        console.log('✅ Firebase messaging initialized successfully');
    } catch (messagingError) {
        console.warn('⚠️ Firebase messaging initialization failed:', messagingError.message);
        console.log('📱 This is common in in-app browsers - continuing without messaging');
        messaging = null;
    }

} catch (error) {
    console.error('❌ Failed to initialize Firebase app:', error.message);
    console.log('📱 This is expected in some in-app browsers like Facebook iOS');
    console.log('🔄 App will continue to function without Firebase features');

    firebaseApp = null;
    messaging = null;
}

// Export with null checks
export const app = firebaseApp;
export { messaging };

// Helper functions to check Firebase availability
export const isFirebaseAvailable = () => {
    return firebaseApp !== null;
};

export const isMessagingAvailable = () => {
    return messaging !== null;
};

// Enhanced logging for debugging
if (typeof window !== 'undefined') {
    window.checkFirebaseStatus = () => {
        console.log('🔥 Firebase Status:');
        console.log(`📱 Browser: ${isInAppBrowser() ? 'In-app' : 'Regular'}`);
        console.log(`🍎 Facebook iOS: ${isFacebookBrowser() && isIOS()}`);
        console.log(`🔥 Firebase App: ${isFirebaseAvailable() ? 'Available' : 'Not Available'}`);
        console.log(`📨 Messaging: ${isMessagingAvailable() ? 'Available' : 'Not Available'}`);

        return {
            isInApp: isInAppBrowser(),
            isFacebookIOS: isFacebookBrowser() && isIOS(),
            firebaseAvailable: isFirebaseAvailable(),
            messagingAvailable: isMessagingAvailable()
        };
    };

    console.log('📋 Firebase debug command available: checkFirebaseStatus()');
}

