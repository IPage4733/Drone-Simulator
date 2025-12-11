/**
 * Centralized Stripe Price IDs Configuration
 * 
 * This file contains all Stripe price IDs used throughout the application.
 * Update these values when price IDs change in Stripe dashboard.
 */

export const STRIPE_PRICE_IDS = {
    // Plan Price IDs
    FREE_PLAN: 'price_1SdDHDCKYG7gRDVP78yoCn4u',
    ZONE_PLAN: 'price_1SdDZ1CKYG7gRDVP2xS1Sp7x',
    PRO_PLAN: 'price_1SdEOqCKYG7gRDVPJeOu8iyT',


    STUDENT_PLAN: 'price_1ReFCPCKYG7gRDVPCr3307yG',
    ENTERPRISE_PLAN: 'price_1SdDHDCKYG7gRDVP78yoCn4u',

    // Custom Items (Drones, Scenarios, Addons)
    DEFAULT_CUSTOM_ITEM: 'price_1SdDHDCKYG7gRDVP78yoCn4u',

    // Bundle Price IDs
    ALL_DRONES_BUNDLE: 'price_1SdDHDCKYG7gRDVP78yoCn4u',
    ALL_SCENARIOS_BUNDLE: 'price_1SdDHDCKYG7gRDVP78yoCn4u',
} as const;

// Type for Stripe Price IDs
export type StripePriceId = typeof STRIPE_PRICE_IDS[keyof typeof STRIPE_PRICE_IDS];
