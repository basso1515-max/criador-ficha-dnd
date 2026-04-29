/**
 * Vercel Web Analytics initialization
 * This module initializes Vercel Analytics tracking across the application
 * 
 * Documentation: https://vercel.com/docs/analytics/quickstart
 * Package: @vercel/analytics v2.0.1
 */
import { inject } from '@vercel/analytics';

// Initialize Vercel Analytics
// The inject function automatically tracks page views and sets up analytics
inject({
  mode: 'auto', // Auto-detect environment (production/development)
  debug: false, // Enable debug logging if needed (set to true for development)
});
