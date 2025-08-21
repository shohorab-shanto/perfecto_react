// import firebaseConfig from '../src/firebase/firebase.config'

// Enhanced browser compatibility check for Facebook's embedded browser
const isFacebookBrowser = () => {
  if (typeof navigator === 'undefined') return false;
  const userAgent = navigator.userAgent || '';
  return userAgent.includes('FBAN') ||
    userAgent.includes('FBAV') ||
    userAgent.includes('Instagram') ||
    userAgent.includes('FB_IAB') ||
    userAgent.includes('FB4A') ||
    userAgent.includes('FBIOS') ||
    userAgent.includes('FBANDROID');
};

const isIOS = () => {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Enhanced safety checks for Facebook iOS browser
const canInitializeFirebase = () => {
  // Don't initialize in Facebook iOS browser
  if (isFacebookBrowser() && isIOS()) {
    console.log('🚫 Skipping Firebase messaging: Facebook iOS browser detected');
    return false;
  }

  // Check for required APIs
  if (typeof importScripts !== 'function') {
    console.log('🚫 Skipping Firebase messaging: importScripts not available');
    return false;
  }

  if (typeof self === 'undefined') {
    console.log('🚫 Skipping Firebase messaging: self not available');
    return false;
  }

  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('🚫 Skipping Firebase messaging: service worker not supported');
    return false;
  }

  return true;
};

// Only initialize Firebase messaging if safe to do so
if (canInitializeFirebase()) {
  try {
    console.log('✅ Initializing Firebase messaging service worker');

    // Scripts for firebase and firebase messaging
    importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
    importScripts(
      "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
    );

    // Initialize the Firebase app in the service worker
    firebase.initializeApp({
      apiKey: "AIzaSyBpYA4j53WuyZ1XYaLz2XP2mBIbfXFa_qY",
      authDomain: "perfecto-base-app.firebaseapp.com",
      projectId: "perfecto-base-app",
      storageBucket: "perfecto-base-app.appspot.com",
      messagingSenderId: "1042984089947",
      appId: "1:1042984089947:web:bde19ac9c6baa4580dc27e",
      measurementId: "G-TDG8YSMS5F",
    });

    // Retrieve firebase messaging
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('📩 Background message received:', payload);

      try {
        const notificationTitle = payload.notification?.title || 'Perfecto Notification';
        const notificationOptions = {
          body: payload.notification?.body || 'You have a new notification',
          icon: payload.notification?.image || '/favIcon.png',
          badge: '/favIcon.png',
          tag: 'perfecto-notification',
          requireInteraction: false,
          silent: false
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    });

    console.log('✅ Firebase messaging service worker initialized successfully');

  } catch (error) {
    console.error('❌ Firebase messaging service worker failed to initialize:', error);
    // Don't let Firebase errors propagate
  }
} else {
  console.log('ℹ️ Firebase messaging service worker skipped for compatibility');

  // Provide a minimal service worker for browsers that require it
  self.addEventListener('install', function (event) {
    console.log('📦 Minimal service worker installed');
    self.skipWaiting();
  });

  self.addEventListener('activate', function (event) {
    console.log('🔄 Minimal service worker activated');
    event.waitUntil(self.clients.claim());
  });

  // Handle any message events gracefully
  self.addEventListener('message', function (event) {
    console.log('📨 Service worker received message:', event.data);
  });
}