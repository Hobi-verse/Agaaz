// App - Main component with Razorpay payment integration
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import SportSelector from './components/SportSelector';
import RegistrationForm from './components/RegistrationForm';
import { createPaymentOrder, verifyPaymentAndRegister, loadRazorpayScript } from './services/api';
import './App.css';

function App() {
  const [selectedSport, setSelectedSport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script on mount
  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setRazorpayLoaded(loaded);
      if (!loaded) {
        toast.error('Failed to load payment gateway');
      }
    });
  }, []);

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
  };

  const handlePayment = async (formData) => {
    if (!razorpayLoaded) {
      toast.error('Payment gateway not loaded. Please refresh.');
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Create order (also checks if Aadhar already registered)
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

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderResult.key,
        amount: orderResult.order.amount,
        currency: orderResult.order.currency,
        name: 'ARAMBH 2026',
        description: `Registration for ${selectedSport.name}`,
        order_id: orderResult.order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobileNo,
        },
        theme: {
          color: '#667eea',
        },
        handler: async function (response) {
          // Step 3: Verify payment and register
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
            // Check for already registered error
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
    <div className="app">
      <Toaster
        toastOptions={{
          success: { style: { background: '#10B981', color: 'white' } },
          error: { style: { background: '#EF4444', color: 'white' } },
        }}
      />

      <div className="container">
        <header className="header">
          <h1>🏆 ARAMBH 2026</h1>
          <p>College Sports Event Registration</p>
        </header>

        <section className="card">
          <SportSelector
            onSportSelect={handleSportSelect}
            selectedSport={selectedSport}
          />
        </section>

        <section className="card">
          <RegistrationForm
            selectedSport={selectedSport}
            onSubmit={handlePayment}
            isLoading={isLoading}
          />
        </section>

        <footer className="footer">
          <p>© 2026 ARAMBH Sports Event</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
