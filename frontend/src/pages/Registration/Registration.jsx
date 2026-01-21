// Registration Page - Complete registration with sport selection, form, and Razorpay payment
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import SportSelector from "../../components/SportSelector";
import FormInput from "../../components/FormInput";
import FileUpload from "../../components/FileUpload";
import { isTeamSport, getSportTypeLabel } from "../../data/sportsData";
import {
  loadRazorpayScript,
  warmupBackend,
} from "../../services/api";
import PaymentProcessingOverlay from "./payment/PaymentProcessingOverlay";
import { useRegistrationPaymentFlow } from "./payment/useRegistrationPaymentFlow";
import "./Registration.css";

export default function Registration() {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    universityName: "",
    branch: "",
    teamName: "",
    mobileNo: "",
    email: "",
    aadharNo: "",
    aadharPhoto: null,
  });

  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const showTeamField = selectedSport && isTeamSport(selectedSport.type);

  // Load Razorpay script and warm up backend
  useEffect(() => {
    // Warm up backend server (handles cold start on free-tier hosting)
    // This runs silently while user fills the form
    warmupBackend();

    loadRazorpayScript().then((loaded) => {
      setRazorpayLoaded(loaded);
      if (!loaded) {
        toast.error("Failed to load payment gateway");
      }
    });
  }, []);

  // Reset form when sport changes
  useEffect(() => {
    setFormData({
      name: "",
      universityName: "",
      branch: "",
      teamName: "",
      mobileNo: "",
      email: "",
      aadharNo: "",
      aadharPhoto: null,
    });
    setErrors({});
  }, [selectedSport?.id]);

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.universityName.trim()) {
      newErrors.universityName = "University name is required";
    }

    if (!formData.branch.trim()) {
      newErrors.branch = "Branch is required";
    }

    if (showTeamField && !formData.teamName.trim()) {
      newErrors.teamName = "Team name is required";
    }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = "Enter a valid 10 digit mobile number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.aadharNo.trim()) {
      newErrors.aadharNo = "Aadhar number is required";
    } else if (!/^\d{12}$/.test(formData.aadharNo)) {
      newErrors.aadharNo = "Aadhar number must be 12 digits";
    }

    if (!formData.aadharPhoto) {
      newErrors.aadharPhoto = "Please upload Aadhar card photo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const {
    isLoading,
    paymentStage,
    paymentError,
    isPaymentInProgress,
    startPaymentFlow,
    resetPayment,
    retryMode,
    retryVerification,
  } = useRegistrationPaymentFlow({
    selectedSport,
    formData,
    validateForm,
    razorpayLoaded,
    navigate,
    setSelectedSport,
  });

  const handlePayment = async (e) => {
    e.preventDefault();

    await startPaymentFlow();
  };

  return (
    <main className="regPage">
      <Toaster
        containerStyle={{
          zIndex: 99999,
          top: 100,
        }}
        toastOptions={{
          style: {
            zIndex: 99999,
            padding: '16px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          },
          success: {
            style: {
              background: 'linear-gradient(135deg, #ff8e2f 0%, #ffb24a 100%)',
              color: '#1c0f53',
              zIndex: 99999
            }
          },
          error: {
            style: {
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              zIndex: 99999
            }
          },
        }}
      />

      <PaymentProcessingOverlay
        stage={paymentStage}
        paymentError={paymentError}
        isPaymentInProgress={isPaymentInProgress}
        retryMode={retryMode}
        onRetryPayment={startPaymentFlow}
        onRetrySave={retryVerification}
        onClose={resetPayment}
      />

      <header className="regHeader">
        <h1 className="regTitle">REGISTRATION </h1>
        <p className="regSubtitle">AAGAAZ 2026</p>
      </header>

      <section className="regCard">
        <SportSelector
          onSportSelect={handleSportSelect}
          selectedSport={selectedSport}
        />
      </section>

      <section className="regCard">
        {!selectedSport ? (
          <div className="regPlaceholder">
            <p>
              Please select a sport from above to continue with registration
            </p>
          </div>
        ) : (
          <form onSubmit={handlePayment}>
            <h3 className="formTitle">
              Registration Form - {selectedSport.name} (
              {getSportTypeLabel(selectedSport.type)})
            </h3>

            <FormInput
              label={showTeamField ? "Team Captain Name" : "Participant Name"}
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder={
                showTeamField ? "Enter captain's name" : "Enter your name"
              }
              required
              error={errors.name}
              maxLength={50}
            />

            {showTeamField && (
              <FormInput
                label="Team Name"
                name="teamName"
                type="text"
                value={formData.teamName}
                onChange={handleChange}
                placeholder="Enter team name"
                required
                error={errors.teamName}
                maxLength={50}
              />
            )}

            <FormInput
              label="University / College Name"
              name="universityName"
              type="text"
              value={formData.universityName}
              onChange={handleChange}
              placeholder="Enter university or college name"
              required
              error={errors.universityName}
              maxLength={100}
            />

            <FormInput
              label="Branch / Department"
              name="branch"
              type="text"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g., CSE, ECE, Mechanical"
              required
              error={errors.branch}
              maxLength={50}
            />

            <FormInput
              label="Mobile Number"
              name="mobileNo"
              type="tel"
              value={formData.mobileNo}
              onChange={handleChange}
              placeholder="10 digit mobile number"
              required
              error={errors.mobileNo}
              maxLength={10}
              helpText="Preferably WhatsApp number"
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
              error={errors.email}
              maxLength={100}
            />

            <FormInput
              label="Aadhar Card Number"
              name="aadharNo"
              type="text"
              value={formData.aadharNo}
              onChange={handleChange}
              placeholder="12 digit Aadhar number"
              required
              error={errors.aadharNo}
              maxLength={12}
              helpText={
                showTeamField ? "Captain's Aadhar number" : "Your Aadhar number"
              }
            />

            <FileUpload
              label={
                showTeamField
                  ? "Captain's Aadhar Card Photo"
                  : "Aadhar Card Photo"
              }
              name="aadharPhoto"
              onChange={handleChange}
              required
              error={errors.aadharPhoto}
            />

            {/* Terms and Conditions Checkbox */}
            <div className="termsCheckbox" style={{
              margin: '20px 0',
              padding: '16px',
              background: 'rgba(255, 178, 74, 0.1)',
              border: '1px solid rgba(255, 178, 74, 0.3)',
              borderRadius: '10px',
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                lineHeight: '1.5',
              }}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginTop: '2px',
                    accentColor: '#ffb24a',
                    cursor: 'pointer',
                  }}
                />
                <span>
                  I have read and agree to the{' '}
                  <a href="/rules" target="_blank" style={{ color: '#ffb24a', textDecoration: 'underline' }}>
                    Rules & Regulations
                  </a>,{' '}
                  <a href="/code-of-conduct" target="_blank" style={{ color: '#ffb24a', textDecoration: 'underline' }}>
                    Code of Conduct
                  </a>, and{' '}
                  <a href="/refund-policy" target="_blank" style={{ color: '#ffb24a', textDecoration: 'underline' }}>
                    Refund Policy
                  </a>{' '}
                  of AAGAAZ 2026.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="regPayBtn"
              disabled={isLoading || !termsAccepted}
              title={!termsAccepted ? 'Please accept terms and conditions' : ''}
            >
              {isLoading
                ? "Processing..."
                : `Pay ₹${selectedSport.fee} & Register`}
            </button>

            {showTeamField && (
              <p className="teamNote">
                Note: Team consists of {selectedSport.teamSize} players. Only
                captain's details are required now.
              </p>
            )}
          </form>
        )}
      </section>
    </main>
  );
}
