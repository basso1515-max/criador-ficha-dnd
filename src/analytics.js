/**
 * Vercel Web Analytics initialization
 * This module initializes Vercel Analytics tracking across the application
 */
import { inject } from '@vercel/analytics';

// Initialize Vercel Analytics
inject({
  mode: 'auto', // Auto-detect environment (production/development)
  debug: false, // Enable debug logging in development if needed
});
