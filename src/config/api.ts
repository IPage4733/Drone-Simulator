/**
 * Global API Configuration
 * Centralized configuration for all backend API endpoints
 */

// Base URL for the API
export const API_BASE_URL = import.meta.env.VITE_DEVELOPMENT ? 'http://127.0.0.1:8000/api' : 'https://api.dronesimulator.pro/api';

// Third-party API URLs
export const NEODOVE_BASE_URL = 'https://8f21b23d-d474-422c-89b2-868a67b07e89.neodove.com/integration/custom';

// API Endpoints
export const API_ENDPOINTS = {
    // Authentication
    LOGIN: `${API_BASE_URL}/login/`,
    LOGOUT: `${API_BASE_URL}/logout/`,
    REGISTER: `${API_BASE_URL}/register/`,
    SOCIAL_LOGIN: `${API_BASE_URL}/social-login/`,
    FORGOT_PASSWORD: `${API_BASE_URL}/forgot-password/`,

    // User Management
    GET_SINGLE_USER: `${API_BASE_URL}/get-single-user-details/`,
    UPDATE_USER: `${API_BASE_URL}/update-user-details/`,
    GET_ALL_USERS: `${API_BASE_URL}/get-all-users/`,

    // Contact & Inquiry
    CONTACT: `${API_BASE_URL}/contact/`,
    CONTACT_MY: `${API_BASE_URL}/contact/my/`,
    CONTACT_ADMIN_ALL: `${API_BASE_URL}/contact/admin/all/`,
    CONTACT_ADMIN_DELETE: (id: string | number) => `${API_BASE_URL}/contact/admin/${id}/delete/`,

    INQUIRY: `${API_BASE_URL}/inquiry/`,
    INQUIRY_ADMIN_ALL: `${API_BASE_URL}/inquiry/admin/all/`,
    INQUIRY_ADMIN_DELETE: (id: string | number) => `${API_BASE_URL}/inquiry/admin/${id}/delete/`,

    // Feedback
    FEEDBACK: `${API_BASE_URL}/feedback/`,
    FEEDBACK_ADMIN_ALL: `${API_BASE_URL}/feedback/admin/all/`,
    FEEDBACK_ADMIN_DELETE: (id: string | number) => `${API_BASE_URL}/feedback/admin/${id}/delete/`,

    // Stripe/Payments
    STRIPE_CREATE_CHECKOUT: `${API_BASE_URL}/stripe/create-checkout-session/`,
    STRIPE_MY_TRANSACTIONS: `${API_BASE_URL}/stripe/my-transactions/`,
    STRIPE_TRANSACTIONS: `${API_BASE_URL}/stripe/transactions/`,
    STRIPE_ANALYTICS: `${API_BASE_URL}/stripe/analytics/`,

    // Downloads
    DOWNLOAD_APP: `${API_BASE_URL}/download-app/`,
    GET_ALL_DOWNLOADS: `${API_BASE_URL}/get-all-downloads/`,
    DELETE_DOWNLOAD: `${API_BASE_URL}/delete-download-record/`,

    // Admin
    ADMIN_GROUPS: `${API_BASE_URL}/admin/groups/`,
    ADMIN_CREATE_USER: `${API_BASE_URL}/admin/create-user/`,

    // Neodove Integration
    NEODOVE_DOWNLOAD_LEADS: `${NEODOVE_BASE_URL}/da0b1545-0690-4f36-b538-100a870026eb/leads`,
    NEODOVE_INQUIRY_LEADS: `${NEODOVE_BASE_URL}/0e4195c8-c4fd-42bd-8fc5-9b8494ebd6f6/leads`,
} as const;

// Helper function to build URLs with query parameters
export const buildUrl = (baseUrl: string, params?: Record<string, string | number>): string => {
    if (!params) return baseUrl;

    const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    return `${baseUrl}?${queryString}`;
};

export default API_BASE_URL;
