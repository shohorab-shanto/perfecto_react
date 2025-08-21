import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        ViteImageOptimizer({
            // Test for common image formats
            test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,

            // Include assets from public directory
            includePublic: true,

            // Log optimization stats
            logStats: true,

            // SVG optimization settings (using SVGO)
            svg: {
                multipass: true,
                plugins: [
                    {
                        name: 'preset-default',
                        params: {
                            overrides: {
                                cleanupNumericValues: false,
                                removeViewBox: false, // Keep viewBox for better scaling
                            },
                            cleanupIDs: {
                                minify: false,
                                remove: false,
                            },
                            convertPathData: false,
                        },
                    },
                    'sortAttrs',
                    {
                        name: 'addAttributesToSVGElement',
                        params: {
                            attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                        },
                    },
                ],
            },

            // Image format optimization settings (using Sharp.js)
            png: {
                quality: 80,
            },
            jpeg: {
                quality: 80,
            },
            jpg: {
                quality: 80,
            },
            gif: {
                // GIF doesn't support quality, but we can still optimize
            },
            webp: {
                quality: 80,
            },
            avif: {
                quality: 80,
            },
        }),
    ],
    build: {
        // Enhanced build targets for better Facebook browser compatibility
        target: ['es2015', 'safari11', 'chrome58', 'firefox60', 'ios11'],
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: false, // Keep console for debugging Facebook browser issues
                drop_debugger: true,
                pure_funcs: ['console.debug']
            }
        },
        // Ensure CSS is inlined for better compatibility with embedded browsers
        cssCodeSplit: false,
        // Add rollup options for better compatibility
        rollupOptions: {
            output: {
                // Ensure module format is compatible with older browsers
                format: 'es',
                // Manual chunk splitting for better loading
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    ui: ['antd', '@ant-design/icons'],
                    redux: ['@reduxjs/toolkit', 'react-redux', 'redux-persist']
                },
                // Add polyfills for Facebook browser
                intro: `
                    // Polyfill for Facebook browser compatibility
                    if (!window.ResizeObserver) {
                        window.ResizeObserver = class ResizeObserver {
                            constructor(callback) {
                                this.callback = callback;
                            }
                            observe() {}
                            unobserve() {}
                            disconnect() {}
                        };
                    }
                    
                    // Polyfill for IntersectionObserver
                    if (!window.IntersectionObserver) {
                        window.IntersectionObserver = class IntersectionObserver {
                            constructor(callback) {
                                this.callback = callback;
                            }
                            observe() {}
                            unobserve() {}
                            disconnect() {}
                        };
                    }
                `
            }
        }
    },
    server: {
        headers: {
            // Remove X-Frame-Options to allow embedding in Facebook's browser
            // 'X-Frame-Options': 'SAMEORIGIN',
            'X-Content-Type-Options': 'nosniff',
            // Add headers for better Facebook compatibility
            'Cross-Origin-Embedder-Policy': 'unsafe-none',
            'Cross-Origin-Opener-Policy': 'unsafe-none'
        }
    },
    // Enhanced dependencies optimization for better compatibility
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'antd',
            '@ant-design/icons',
            'axios',
            '@reduxjs/toolkit',
            'react-redux',
            'redux-persist',
            '@tanstack/react-query'
        ],
        // Force pre-bundling of problematic dependencies
        force: true
    },
    // Additional configuration for Facebook browser
    define: {
        global: 'globalThis',
        // Add feature detection for Facebook browser
        __IS_FACEBOOK_BROWSER__: `(function() {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return userAgent.includes('FBAN') || 
                   userAgent.includes('FBAV') || 
                   userAgent.includes('Instagram') ||
                   userAgent.includes('FB_IAB') ||
                   userAgent.includes('FB4A') ||
                   userAgent.includes('FBIOS') ||
                   userAgent.includes('FBANDROID');
        })()`
    }
})
