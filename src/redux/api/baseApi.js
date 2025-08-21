import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokenFromLocalStorage } from "../../utilities/tokenHandler";

// Facebook iOS browser detection
const isFacebookIOSBrowser = () => {
    const userAgent = navigator.userAgent || '';
    const isFacebook = /FBAN|FBAV|Instagram|FB_IAB|FB4A|FBIOS|FBANDROID/.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    return isFacebook && isIOS;
};

// Enhanced base query with Node API fallback handling
const baseQuery = fetchBaseQuery({
    baseUrl: "https://app.perfectobd.com/api/",
    timeout: isFacebookIOSBrowser() ? 8000 : 15000, // Shorter timeout for Facebook browser
    prepareHeaders: (headers, { getState }) => {
        const token = getTokenFromLocalStorage();
        headers.set("accept", "application/json");
        headers.set("Cache-Control", "no-cache");
        headers.set("Pragma", "no-cache");

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// Custom base query with Node API fallback
const baseQueryWithFallback = async (args, api, extraOptions) => {
    try {
        const result = await baseQuery(args, api, extraOptions);

        // If the request failed and it's a Node API endpoint in Facebook iOS browser
        if (result.error && isFacebookIOSBrowser()) {
            const url = typeof args === 'string' ? args : args.url;

            // Check if this is a Node API endpoint
            if (url && url.includes('node.perfectobd.com')) {
                console.warn(`Node API endpoint failed in Facebook iOS browser: ${url}`);

                // Return appropriate fallback based on endpoint type
                const fallbackData = getFallbackDataForEndpoint(url);

                return {
                    data: fallbackData,
                    meta: {
                        request: args,
                        response: { status: 200 },
                        fallback: true,
                        originalError: result.error
                    }
                };
            }
        }

        return result;
    } catch (error) {
        console.error('Base query failed:', error);

        // For Node API failures in Facebook iOS browser, return fallback
        if (isFacebookIOSBrowser() && args && typeof args === 'object' && args.url && args.url.includes('node.perfectobd.com')) {
            const fallbackData = getFallbackDataForEndpoint(args.url);
            return {
                data: fallbackData,
                meta: {
                    request: args,
                    response: { status: 200 },
                    fallback: true,
                    originalError: error
                }
            };
        }

        return { error };
    }
};

// Get appropriate fallback data based on endpoint
const getFallbackDataForEndpoint = (url) => {
    if (url.includes('get-home-web')) {
        return { data: [], message: 'Home content temporarily unavailable' };
    } else if (url.includes('brand')) {
        return { data: [], message: 'Brand data temporarily unavailable' };
    } else if (url.includes('color') || url.includes('preference') || url.includes('formulation') ||
        url.includes('finish') || url.includes('country') || url.includes('gender') ||
        url.includes('coverage') || url.includes('skin-type') || url.includes('benefit') ||
        url.includes('concern') || url.includes('ingredient') || url.includes('pack-size')) {
        return { data: [], message: 'Filter data temporarily unavailable' };
    } else if (url.includes('offer')) {
        return { data: [], message: 'Offers temporarily unavailable' };
    } else if (url.includes('popular-brand') || url.includes('top-brand')) {
        return { data: [], message: 'Brand data temporarily unavailable' };
    } else if (url.includes('getShippingCharge')) {
        return { data: { shipping_charge: 0 }, message: 'Shipping charge temporarily unavailable' };
    } else if (url.includes('get-general-setting')) {
        return { data: {}, message: 'Contact information temporarily unavailable' };
    } else if (url.includes('getRewardData')) {
        return { data: { reward_points: 0 }, message: 'Reward data temporarily unavailable' };
    }

    // Default fallback
    return {
        data: [],
        message: 'Service temporarily unavailable',
        fallback: true
    };
};

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithFallback,
    tagTypes: ["User", "Cart", "order", "WishList", "Pathao", "Reviews"],
    endpoints: () => ({}),
});
