// API Service - Axios with Razorpay payment integration
import axios from 'axios';

const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const normalizeBaseUrl = (url) => String(url || '').trim().replace(/\/+$/, '');

// We want axios baseURL to always point to the backend API root: <server>/api
const normalizedBackendUrl = normalizeBaseUrl(RAW_BACKEND_URL);
const API_BASE_URL = normalizedBackendUrl
    ? (normalizedBackendUrl.endsWith('/api')
        ? normalizedBackendUrl
        : `${normalizedBackendUrl}/api`)
    : 'http://localhost:5000/api';

const getApiErrorMessage = (error) => {
    if (!error) return 'Unknown error';
    if (typeof error === 'string') return error;
    return (
        error.message ||
        error.error ||
        error.msg ||
        (Array.isArray(error.errors) ? error.errors.join(', ') : '') ||
        'Request failed'
    );
};

// Create axios instance with base config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 45000,
    headers: {
        'Accept': 'application/json',
    },
});

const getServerRootFromApiBaseUrl = () => {
    const baseUrl = String(api.defaults.baseURL || '').replace(/\/+$/, '');
    // axios baseURL is expected to end with /api; health lives on server root
    return baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
};

export const pingBackend = async () => {
    const serverRoot = getServerRootFromApiBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
        const response = await fetch(`${serverRoot}/health`, {
            method: 'GET',
            signal: controller.signal,
            cache: 'no-store',
        });
        return response.ok;
    } catch {
        return false;
    } finally {
        clearTimeout(timeoutId);
    }
};

export const ensureBackendReady = async ({
    maxWaitMs = 65000,
    initialDelayMs = 400,
    maxDelayMs = 5000,
} = {}) => {
    const start = Date.now();
    let delay = initialDelayMs;

    while (Date.now() - start < maxWaitMs) {
        // eslint-disable-next-line no-await-in-loop
        const ok = await pingBackend();
        if (ok) return true;

        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(maxDelayMs, Math.round(delay * 1.6));
    }

    return false;
};

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            return Promise.reject({ message: 'Network error. Please check your connection.' });
        }
        if (error.code === 'ECONNABORTED') {
            return Promise.reject({ message: 'Request timeout. Please try again.' });
        }
        // Prefer backend JSON error shape when available
        return Promise.reject(error.response.data || { message: 'Request failed' });
    }
);

// Create Razorpay order
export const createPaymentOrder = async (orderData) => {
    try {
        const response = await api.post('/payment/create-order', orderData);
        return {
            success: true,
            order: response.data.order,
            key: response.data.key,
        };
    } catch (error) {
        return {
            success: false,
            error: getApiErrorMessage(error) || 'Failed to create payment order',
        };
    }
};

// Verify payment and complete registration
export const verifyPaymentAndRegister = async (paymentData, formData, aadharPhoto) => {
    try {
        const data = new FormData();

        // Add payment data
        data.append('razorpay_order_id', paymentData.razorpay_order_id);
        data.append('razorpay_payment_id', paymentData.razorpay_payment_id);
        data.append('razorpay_signature', paymentData.razorpay_signature);

        // Add form data as JSON
        data.append('formData', JSON.stringify(formData));

        // Add Aadhar photo
        if (aadharPhoto) {
            data.append('aadharPhoto', aadharPhoto);
        }

        const response = await api.post('/payment/verify', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return {
            success: true,
            message: response.data.message,
            registrationId: response.data.registrationId,
        };
    } catch (error) {
        return {
            success: false,
            error: getApiErrorMessage(error) || 'Payment verification failed',
        };
    }
};

// Load Razorpay script
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(Boolean(window.Razorpay));
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// Get all registrations (for dashboard)
export const getAllRegistrations = async () => {
    try {
        const response = await api.get('/registrations');
        return { success: true, data: response.data.data, count: response.data.count };
    } catch (error) {
        return { success: false, error: error.message || 'Failed to fetch registrations' };
    }
};

// Warm up backend server
export const warmupBackend = async () => {
    try {
        // Silently wait for cold-start to finish.
        // This runs in the background while the user fills the form.
        await ensureBackendReady({ maxWaitMs: 65000 });
    } catch (error) {
        // Silently fail - this is just a warm-up call
        // ignore
    }
};

// Visit counter
export const getVisitCount = async () => {
    try {
        const response = await api.get('/visits');
        return { success: true, count: response.data.count };
    } catch (error) {
        return { success: false, error: error.message || 'Failed to fetch visit count' };
    }
};

export const incrementVisitCount = async () => {
    try {
        const response = await api.post('/visits');
        return { success: true, count: response.data.count };
    } catch (error) {
        return { success: false, error: error.message || 'Failed to update visit count' };
    }
};

export default api;
