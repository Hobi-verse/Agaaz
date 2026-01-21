import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  createPaymentOrder,
  verifyPaymentAndRegister,
  ensureBackendReady,
} from "../../../services/api";

export function useRegistrationPaymentFlow({
  selectedSport,
  formData,
  validateForm,
  razorpayLoaded,
  navigate,
  setSelectedSport,
}) {
  const PENDING_KEY = "aagaaz_pending_verification";

  const [isLoading, setIsLoading] = useState(false);
  const [paymentStage, setPaymentStage] = useState("idle");
  const [paymentError, setPaymentError] = useState("");
  const [retryMode, setRetryMode] = useState("payment");
  const [pendingPayload, setPendingPayload] = useState(null);

  const isPaymentInProgress = useMemo(() => {
    return (
      paymentStage === "creatingOrder" ||
      paymentStage === "awaitingPayment" ||
      paymentStage === "verifying"
    );
  }, [paymentStage]);

  const resetPayment = useCallback(() => {
    setPaymentError("");
    setPaymentStage("idle");
    setIsLoading(false);
    setRetryMode("payment");
    setPendingPayload(null);
    try {
      sessionStorage.removeItem(PENDING_KEY);
    } catch {
      // ignore
    }
  }, []);

  const loadPendingFromStorage = useCallback(() => {
    try {
      const raw = sessionStorage.getItem(PENDING_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.paymentData || !parsed?.formData) return null;
      return parsed;
    } catch {
      return null;
    }
  }, []);

  const persistPendingToStorage = useCallback((payload) => {
    try {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, []);

  const isTransientError = (message) => {
    const text = String(message || "").toLowerCase();
    return (
      text.includes("network") ||
      text.includes("timeout") ||
      text.includes("failed to fetch") ||
      text.includes("request failed") ||
      text.includes("internal") ||
      text.includes("service")
    );
  };

  const verifyWithRetry = useCallback(
    async ({ paymentData, verifyFormData, aadharPhoto }) => {
      // Ensure backend is actually awake before trying verify
      const ready = await ensureBackendReady({ maxWaitMs: 65000 });
      if (!ready) {
        return {
          success: false,
          error: "Server is starting. Please wait and retry.",
        };
      }

      const maxAttempts = 5;
      let delay = 1200;

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        // eslint-disable-next-line no-await-in-loop
        const result = await verifyPaymentAndRegister(
          paymentData,
          verifyFormData,
          aadharPhoto
        );

        if (result.success) return result;

        // If it's not transient, don't keep retrying
        if (!isTransientError(result.error)) return result;

        if (attempt < maxAttempts) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay = Math.min(7000, Math.round(delay * 1.7));
        }
      }

      return {
        success: false,
        error:
          "We received your payment details, but couldn't reach the server to save the registration yet. Please tap Retry Save.",
      };
    },
    []
  );

  const retryVerification = useCallback(async () => {
    const pending = pendingPayload || loadPendingFromStorage();
    if (!pending) {
      setRetryMode("payment");
      setPaymentError("Nothing to verify. Please retry payment.");
      setPaymentStage("failed");
      return;
    }

    setIsLoading(true);
    setRetryMode("verify");
    setPaymentStage("verifying");

    const verifyResult = await verifyWithRetry({
      paymentData: pending.paymentData,
      verifyFormData: pending.formData,
      // After refresh, file cannot be recovered; backend can still save entries.
      aadharPhoto: null,
    });

    setIsLoading(false);

    if (verifyResult.success) {
      setPaymentStage("success");
      toast.success("Registration saved successfully.", {
        duration: 5000,
        position: "top-center",
      });
      setSelectedSport(null);
      try {
        sessionStorage.removeItem(PENDING_KEY);
      } catch {
        // ignore
      }
      setTimeout(() => {
        resetPayment();
        navigate("/");
      }, 1500);
    } else {
      setPaymentError(verifyResult.error || "Verification failed. Please retry.");
      setPaymentStage("failed");
      setRetryMode("verify");
      toast.error(verifyResult.error || "Verification failed. Please retry.");
    }
  }, [pendingPayload, loadPendingFromStorage, verifyWithRetry, resetPayment, navigate, setSelectedSport]);

  // If user refreshed during verification, resume from sessionStorage
  useEffect(() => {
    if (paymentStage !== "idle") return;
    const pending = loadPendingFromStorage();
    if (!pending) return;
    setPendingPayload(pending);
    setRetryMode("verify");
    setPaymentStage("failed");
    setPaymentError(
      "Payment details found. Tap Retry Save to complete registration."
    );
  }, [paymentStage, loadPendingFromStorage]);

  // Prevent refresh/back while payment is in progress
  useEffect(() => {
    if (!isPaymentInProgress) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      // Chrome requires returnValue to be set
      event.returnValue = "";
    };

    const pushCurrentState = () => {
      try {
        window.history.pushState(null, "", window.location.href);
      } catch {
        // ignore
      }
    };

    const handlePopState = () => {
      pushCurrentState();
      toast.error("Payment is processing. Please do not go back.", {
        duration: 2500,
        position: "top-center",
      });
    };

    pushCurrentState();
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isPaymentInProgress]);

  const startPaymentFlow = useCallback(async () => {
    if (!selectedSport) {
      toast.error("Please select a sport to continue");
      return;
    }

    setPaymentError("");

    if (!validateForm()) {
      return;
    }

    if (!razorpayLoaded) {
      toast.error("Payment gateway not loaded. Please refresh.");
      return;
    }

    setIsLoading(true);
    setRetryMode("payment");
    setPaymentStage("creatingOrder");

    try {
      // Ensure backend is awake before creating the order (Render cold-start)
      const ready = await ensureBackendReady({ maxWaitMs: 65000 });
      if (!ready) {
        setPaymentError("Server is starting. Please wait and retry.");
        setPaymentStage("failed");
        setIsLoading(false);
        return;
      }

      const orderResult = await createPaymentOrder({
        amount: selectedSport.fee,
        name: formData.name,
        email: formData.email,
        mobileNo: formData.mobileNo,
        aadharNo: formData.aadharNo,
        sportId: selectedSport.id,
        sportName: selectedSport.name,
      });

      if (!orderResult.success) {
        const message = orderResult.error || "Failed to create order";
        setPaymentError(message);
        setPaymentStage("failed");
        setIsLoading(false);
        return;
      }

      setPaymentStage("awaitingPayment");

      const options = {
        key: orderResult.key,
        amount: orderResult.order.amount,
        currency: orderResult.order.currency,
        name: "AAGAAZ 2026",
        description: `Registration for ${selectedSport.name}`,
        order_id: orderResult.order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobileNo,
        },
        theme: { color: "#ffb24a" },
        handler: async function (response) {
          try {
            setPaymentStage("verifying");
            setRetryMode("verify");

            const verifyFormData = {
              ...formData,
              sportCategory: selectedSport.category,
              sportCategoryId: selectedSport.categoryId,
              sportName: selectedSport.name,
              sportId: selectedSport.id,
              sportType: selectedSport.type,
              teamSize: selectedSport.teamSize,
              amount: selectedSport.fee,
            };

            const pending = {
              paymentData: response,
              formData: verifyFormData,
              createdAt: Date.now(),
            };
            setPendingPayload(pending);
            persistPendingToStorage(pending);

            const verifyResult = await verifyWithRetry({
              paymentData: response,
              verifyFormData,
              aadharPhoto: formData.aadharPhoto,
            });

            setIsLoading(false);

            if (verifyResult.success) {
              setPaymentStage("success");
              toast.success("Payment Successful! Registration Complete.", {
                duration: 5000,
                position: "top-center",
              });
              setSelectedSport(null);
              try {
                sessionStorage.removeItem(PENDING_KEY);
              } catch {
                // ignore
              }
              setTimeout(() => {
                resetPayment();
                navigate("/");
              }, 2000);
            } else {
              const alreadyRegistered = verifyResult.error
                ?.toLowerCase()
                .includes("already registered");

              const message = alreadyRegistered
                ? "This Aadhar is already registered!"
                : verifyResult.error || "Registration failed";

              setPaymentError(message);
              setPaymentStage("failed");
              setRetryMode("verify");

              toast.error(message, {
                duration: 5000,
                position: "top-center",
              });
            }
          } catch (err) {
            console.error("Verification error:", err);
            setIsLoading(false);
            setPaymentError("Verification failed. Please retry.");
            setPaymentStage("failed");
            setRetryMode("verify");
            toast.error("Verification failed. Please retry.");
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            setPaymentError("Payment cancelled by user.");
            setPaymentStage("cancelled");
            setRetryMode("payment");
            toast.error("Payment cancelled", {
              duration: 3000,
              position: "top-center",
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError("Something went wrong. Please try again.");
      setPaymentStage("failed");
      setRetryMode("payment");
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }, [
    selectedSport,
    formData,
    validateForm,
    razorpayLoaded,
    navigate,
    setSelectedSport,
    resetPayment,
    persistPendingToStorage,
    verifyWithRetry,
  ]);

  return {
    isLoading,
    paymentStage,
    paymentError,
    isPaymentInProgress,
    startPaymentFlow,
    resetPayment,
    retryMode,
    retryVerification,
  };
}
