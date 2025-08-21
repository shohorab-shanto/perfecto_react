import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useHomeData = () => {
    const {
        data: homeData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["homeData"],
        queryFn: async () => {
            try {
                const res = await axios.get(`https://node.perfectobd.com/api/node/get-home-web`, {
                    timeout: 10000, // 10 second timeout
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });
                return res.data;
            } catch (error) {
                console.error('Failed to fetch home data from Node API:', error);

                // Check if we're in Facebook iOS browser
                const userAgent = navigator.userAgent || '';
                const isFacebookBrowser = /FBAN|FBAV|Instagram|FB_IAB|FB4A|FBIOS|FBANDROID/.test(userAgent);
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

                if (isFacebookBrowser && isIOS) {
                    console.log('Node API failed in Facebook iOS browser - this may cause white screen');
                }

                // Return empty fallback data instead of throwing error
                // This prevents the entire Home component from failing
                return {
                    data: [],
                    message: 'Failed to load home data'
                };
            }
        },
        retry: (failureCount, error) => {
            // More aggressive retries for Node API
            console.log(`Home data fetch attempt ${failureCount + 1} failed:`, error.message);
            return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 15 * 60 * 1000, // 15 minutes
    });

    return { homeData, isLoading, isError, error };
};

export default useHomeData;
