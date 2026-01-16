// Registration Page - Complete registration with sport selection, form, and Razorpay payment
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import SportSelector from '../../components/SportSelector';
import FormInput from '../../components/FormInput';
import FileUpload from '../../components/FileUpload';
import { isTeamSport, getSportTypeLabel } from '../../data/sportsData';
import { createPaymentOrder, verifyPaymentAndRegister, loadRazorpayScript } from '../../services/api';
import './Registration.css';

export default function Registration() {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    universityName: '',
    branch: '',
    teamName: '',
    mobileNo: '',
    email: '',
    aadharNo: '',
    aadharPhoto: null,
  });

  const [errors, setErrors] = useState({});
  const showTeamField = selectedSport && isTeamSport(selectedSport.type);

  // Load Razorpay script
  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setRazorpayLoaded(loaded);
      if (!loaded) {
        toast.error('Failed to load payment gateway');
      }
    });
  }, []);

  // Reset form when sport changes
  useEffect(() => {
    setFormData({
      name: '',
      universityName: '',
      branch: '',
      teamName: '',
      mobileNo: '',
      email: '',
      aadharNo: '',
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
      setFormData(prev => ({ ...prev, [name]: files[0] || null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.universityName.trim()) {
      newErrors.universityName = 'University name is required';
    }

    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch is required';
    }

    if (showTeamField && !formData.teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Enter a valid 10 digit mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.aadharNo.trim()) {
      newErrors.aadharNo = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(formData.aadharNo)) {
      newErrors.aadharNo = 'Aadhar number must be 12 digits';
    }

    if (!formData.aadharPhoto) {
      newErrors.aadharPhoto = 'Please upload Aadhar card photo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!razorpayLoaded) {
      toast.error('Payment gateway not loaded. Please refresh.');
      return;
    }

    setIsLoading(true);

    try {
      // Create order (also checks if Aadhar already registered)
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
        toast.error(orderResult.error || 'Failed to create order');
        setIsLoading(false);
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: orderResult.key,
        amount: orderResult.order.amount,
        currency: orderResult.order.currency,
        name: 'AAGAAZ 2026',
        description: `Registration for ${selectedSport.name}`,
        order_id: orderResult.order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobileNo,
        },
        theme: { color: '#ffb24a' },
        handler: async function (response) {
          // Verify payment and register
          const verifyResult = await verifyPaymentAndRegister(
            response,
            {
              ...formData,
              sportCategory: selectedSport.category,
              sportCategoryId: selectedSport.categoryId,
              sportName: selectedSport.name,
              sportId: selectedSport.id,
              sportType: selectedSport.type,
              teamSize: selectedSport.teamSize,
            },
            formData.aadharPhoto
          );

          setIsLoading(false);

          if (verifyResult.success) {
            toast.success('Payment Successful! Registration Complete.', {
              duration: 5000,
              position: 'top-center',
            });
            setSelectedSport(null);
          } else {
            if (verifyResult.error?.includes('already registered')) {
              toast.error('This Aadhar is already registered!', {
                duration: 5000,
                position: 'top-center',
              });
            } else {
              toast.error(verifyResult.error || 'Registration failed', {
                duration: 5000,
                position: 'top-center',
              });
            }
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast.error('Payment cancelled', {
              duration: 3000,
              position: 'top-center',
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <main className="regPage">
      <Toaster
        toastOptions={{
          success: { style: { background: '#10B981', color: 'white' } },
          error: { style: { background: '#EF4444', color: 'white' } },
        }}
      />

      <header className="regHeader">
        <h1 className="regTitle">🏆 AAGAAZ 2026</h1>
        <p className="regSubtitle">College Sports Event Registration</p>
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
            <p>Please select a sport from above to continue with registration</p>
          </div>
        ) : (
          <form onSubmit={handlePayment}>
            <h3 className="formTitle">
              Registration Form - {selectedSport.name} ({getSportTypeLabel(selectedSport.type)})
            </h3>

            <FormInput
              label={showTeamField ? "Team Captain Name" : "Participant Name"}
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder={showTeamField ? "Enter captain's name" : "Enter your name"}
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
              helpText={showTeamField ? "Captain's Aadhar number" : "Your Aadhar number"}
            />

            <FileUpload
              label={showTeamField ? "Captain's Aadhar Card Photo" : "Aadhar Card Photo"}
              name="aadharPhoto"
              onChange={handleChange}
              required
              error={errors.aadharPhoto}
            />

            <button type="submit" className="regPayBtn" disabled={isLoading}>
              {isLoading ? 'Processing...' : `Pay ₹${selectedSport.fee} & Register`}
            </button>

            {showTeamField && (
              <p className="teamNote">
                Note: Team consists of {selectedSport.teamSize} players. Only captain's details are required now.
              </p>
            )}
          </form>
        )}
      </section>

      <button className="regBackBtn" onClick={() => navigate('/')}>
        Back to Home
      </button>

      <footer className="regFooter">
        <p>© 2026 AAGAAZ Sports Event</p>
      </footer>
    </main>
  );
}
