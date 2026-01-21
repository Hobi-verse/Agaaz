import "./PaymentProcessingOverlay.css";

const stageCopy = (stage, paymentError) => {
  switch (stage) {
    case "creatingOrder":
      return {
        title: "Preparing payment",
        subtitle: "Creating your payment order…",
      };
    case "awaitingPayment":
      return {
        title: "Complete payment",
        subtitle: "Razorpay checkout is open. Please finish the payment.",
      };
    case "verifying":
      return {
        title: "Verifying payment",
        subtitle: "Saving your registration in the database…",
      };
    case "success":
      return {
        title: "Registration complete",
        subtitle: "Payment verified and entry created.",
      };
    case "failed":
      return {
        title: "Payment failed",
        subtitle: paymentError || "Something went wrong. Please retry.",
      };
    case "cancelled":
      return {
        title: "Payment cancelled",
        subtitle:
          paymentError ||
          "You closed the payment window. You can retry anytime.",
      };
    default:
      return null;
  }
};

export default function PaymentProcessingOverlay({
  stage,
  paymentError,
  isPaymentInProgress,
  retryMode = "payment",
  onRetryPayment,
  onRetrySave,
  onClose,
}) {
  if (!stage || stage === "idle") return null;

  const copy = stageCopy(stage, paymentError);
  if (!copy) return null;

  const showSpinner =
    stage === "creatingOrder" ||
    stage === "awaitingPayment" ||
    stage === "verifying";
  const showWarn = showSpinner;
  const showActions = stage === "failed" || stage === "cancelled";
  const primaryLabel = retryMode === "verify" ? "Retry Save" : "Retry Payment";
  const handlePrimary = () => {
    if (retryMode === "verify") {
      onRetrySave?.();
    } else {
      onRetryPayment?.();
    }
  };

  return (
    <div className="paymentOverlay" role="dialog" aria-modal="true">
      <div className="paymentOverlayCard">
        {showSpinner && <div className="paymentSpinner" aria-hidden="true" />}

        {stage === "success" && (
          <div className="paymentSuccessMark" aria-hidden="true">
            ✓
          </div>
        )}

        {(stage === "failed" || stage === "cancelled") && (
          <div className="paymentFailMark" aria-hidden="true">
            !
          </div>
        )}

        <h2 className="paymentOverlayTitle">{copy.title}</h2>
        <p className="paymentOverlaySubtitle">{copy.subtitle}</p>

        {showWarn && (
          <div className="paymentOverlayWarn">
            Processing is under way. Please do not refresh or go back.
          </div>
        )}

        {showActions && (
          <div className="paymentOverlayActions">
            <button
              type="button"
              className="paymentRetryBtn"
              onClick={handlePrimary}
              disabled={isPaymentInProgress}
            >
              {primaryLabel}
            </button>
            <button
              type="button"
              className="paymentCloseBtn"
              onClick={onClose}
              disabled={isPaymentInProgress}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
