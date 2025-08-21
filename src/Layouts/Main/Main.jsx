import React, { useContext, useEffect, useState } from "react";
import "../../scss/styles.scss";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Main.css";
import ChatSystem from "../../components/ChatSystem/ChatSystem";
import useAuthUser from "../../hooks/useAuthUser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken, onMessage } from "firebase/messaging";
import { messaging, isMessagingAvailable } from "../../firebase/firebase.config";
import Message from "../../components/Message/Message";
import { useGetNotificationsQuery, useStoreTokenMutation } from "../../redux/features/notifications/notificationsApi";
import { LogicProviderContext } from "../../providers/LogicProvider";
import { Fade, Flip } from "react-awesome-reveal";
import logo from "../../assets/footer/footerLogo.svg";
import useHomeData from "../../hooks/useHomeData";

const Main = () => {
    const { userData, userError } = useAuthUser();
    const [storeTokenMutation, { data: storeTokenData }] = useStoreTokenMutation();
    const { isLoading: IsHomeLoading, isError: homeError } = useHomeData();
    const { refetch: notificationListRefetch } = useGetNotificationsQuery();
    const { handleTrendingClose, handleNavbarRelatedSearchRefClose } = useContext(LogicProviderContext);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasRenderError, setHasRenderError] = useState(false);

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

    const isIOS = () => {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    };

    async function requestPermission() {
        // Skip Firebase messaging in Facebook's embedded browser
        if (isFacebookBrowser()) {
            console.log('Skipping Firebase messaging in Facebook browser');
            return;
        }

        // Check if Firebase messaging is available
        if (!isMessagingAvailable()) {
            console.log('Firebase messaging not available - skipping permission request');
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                const token = await getToken(messaging, {
                    vapidKey: "BEuRYBmGbLGo-vYSsdyqihtD80eMxMRYSj_u6d54MjvUP6QRNBs490oHLxOahjwksilFPE2yXYGTMJVx1e9jByg",
                });

                if (token) {
                    const storeToken = { token: token };
                    try {
                        const response = await storeTokenMutation(storeToken);
                        console.log("Token stored successfully:", response);
                    } catch (error) {
                        console.error("Error storing FCM token:", error.message);
                    }
                } else {
                    console.log("No registration token available.");
                }
            } else {
                console.log("Notifications permission denied.");
            }
        } catch (error) {
            console.error("Error requesting notifications permission:", error);
            // Don't let Firebase errors break the app in Facebook browser
            if (isFacebookBrowser()) {
                console.log("Continuing without Firebase messaging in Facebook browser");
            }
        }
    }

    useEffect(() => {
        requestPermission();
    }, []);

    useEffect(() => {
        // Skip message listener in Facebook's embedded browser
        if (isFacebookBrowser()) {
            return;
        }

        // Check if Firebase messaging is available
        if (!isMessagingAvailable()) {
            console.log('Firebase messaging not available - skipping message listener');
            return;
        }

        try {
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log("Message received: ", payload);
                toast(<Message notification={payload.notification} />);
                notificationListRefetch();
            });

            // Cleanup listener on component unmount
            return () => {
                unsubscribe();
            };
        } catch (error) {
            console.error("Error setting up Firebase message listener:", error);
        }
    }, [notificationListRefetch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoading(false);
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    // Error recovery for Facebook iOS browser
    useEffect(() => {
        if (isFacebookBrowser() && isIOS()) {
            const checkRender = () => {
                const navbar = document.querySelector('.fixed.z-20');
                const outlet = document.querySelector('.pt-\\[95px\\]');

                if (!navbar || !outlet) {
                    console.log('Components not rendering properly in Facebook iOS browser');
                    setHasRenderError(true);
                }
            };

            const timer = setTimeout(checkRender, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    // Fallback UI for critical errors
    if (hasRenderError) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#ffffff',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: '400px'
                }}>
                    <h1 style={{ color: '#374151', marginBottom: '16px' }}>Loading Perfecto</h1>
                    <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                        Please wait while we prepare your beauty destination...
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: '#5DC9F4',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    // Handle critical data loading errors
    if (homeError && !IsHomeLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#ffffff',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: '400px'
                }}>
                    <h1 style={{ color: '#374151', marginBottom: '16px' }}>Connection Error</h1>
                    <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                        Unable to load content. Please check your connection and try again.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: '#5DC9F4',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#5DC9F4',
                            padding: '12px 24px',
                            border: '2px solid #5DC9F4',
                            borderRadius: '6px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative h-screen ${IsHomeLoading ? 'overflow-hidden' : ''}`}>
            <div onClick={handleTrendingClose} className="overflow-hidden">
                <div onClick={handleNavbarRelatedSearchRefClose}>
                    <div className="fixed z-20 w-full bg-white">
                        <Navbar />
                    </div>
                    <div className="pt-[95px] md:pt-[146px]">
                        <Outlet />
                    </div>
                    {userData?.status === true && <ChatSystem />}

                    <Footer />
                    <ToastContainer />
                </div>
            </div>
            {/*{IsHomeLoading && (*/}
            {/*    <div className="absolute text-red-500 bg-black opacity-30 z-50 top-0 left-0 h-full w-full inset-0  flex items-center justify-center">*/}
            {/*        <img src={logo} className=" animate-heartbeat" alt="Loading..."/>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};

export default Main;
