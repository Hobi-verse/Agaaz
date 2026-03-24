import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
      });
    }
    if (error.code === "ECONNABORTED") {
      return Promise.reject({ message: "Request timeout. Please try again." });
    }
    return Promise.reject(error.response.data);
  },
);

export const createPaymentOrder = async (orderData) => {
  try {
    const response = await api.post("/payment/create-order", orderData);
    return {
      success: true,
      order: response.data.order,
      key: response.data.key,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to create payment order",
    };
  }
};

export const verifyPaymentAndRegister = async (
  paymentData,
  formData,
  aadharPhoto,
) => {
  try {
    const data = new FormData();
    data.append("razorpay_order_id", paymentData.razorpay_order_id);
    data.append("razorpay_payment_id", paymentData.razorpay_payment_id);
    data.append("razorpay_signature", paymentData.razorpay_signature);
    data.append("formData", JSON.stringify(formData));

    if (aadharPhoto) {
      data.append("aadharPhoto", aadharPhoto);
    }

    const response = await api.post("/payment/verify", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return {
      success: true,
      message: response.data.message,
      registrationId: response.data.registrationId,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Payment verification failed",
    };
  }
};

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const getAllRegistrations = async () => {
  try {
    const response = await api.get("/registrations");
    return {
      success: true,
      data: response.data.data,
      count: response.data.count,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch registrations",
    };
  }
};

export const warmupBackend = async () => {
  try {
    const baseUrl = String(api.defaults.baseURL || "").replace(/\/+$/, "");
    await fetch(`${baseUrl}/health`, { method: "GET" });
  } catch {
    // Ignore warm-up failures to keep registration usable.
  }
};

export const getVisitCount = async () => {
  try {
    const response = await api.get("/visits");
    return { success: true, count: response.data.count };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch visit count",
    };
  }
};

export const incrementVisitCount = async () => {
  try {
    const response = await api.post("/visits");
    return { success: true, count: response.data.count };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to update visit count",
    };
  }
};

export const getMatches = async (sportId = null) => {
  try {
    const params = sportId ? { sportId } : {};
    const response = await api.get("/matches", { params });
    return {
      success: true,
      data: response.data.data,
      count: response.data.count,
    };
  } catch (error) {
    return { success: false, error: error.message || "Failed to fetch matches" };
  }
};

export const getPublishedNotices = async (limit = 20) => {
  try {
    const response = await api.get("/notices", { params: { limit } });
    return {
      success: true,
      data: response.data.data,
      count: response.data.count,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch notices",
    };
  }
};

export default api;
