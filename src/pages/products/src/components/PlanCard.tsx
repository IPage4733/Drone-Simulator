import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  X,
  GraduationCap,
  Airplay,
  Satellite,
  Mail,
  Loader2
} from 'lucide-react';
import { Plan } from '../types';
import Card from './Card';
import Button from './Button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom'; // Import Link for redirection
import axios from 'axios';
import { API_ENDPOINTS } from '../../../../config/api';

interface PlanCardProps {
  plan: Plan;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  if (!plan || typeof plan !== 'object') return null;
  const { addItem } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'verify' | 'restricted' | 'taken'>('login');
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const [studentEmail, setStudentEmail] = useState('');
  const [error, setError] = useState('');

  // Zone Plan Checkout States
  const [showZoneCheckout, setShowZoneCheckout] = useState(false);
  const [numberOfPCs, setNumberOfPCs] = useState(2);
  const [selectedZones, setSelectedZones] = useState<{ [key: string]: boolean }>({
    'RPTO Ground': false,
    'Agriculture': false,
    'City': false,
    'Rail-Road-Canal-Bridge': false,
    'HV Lines & Solar Panel': false,
    'Factory': false
  });
  const [purchasedZones, setPurchasedZones] = useState<string[]>([]);
  const [isLoadingZones, setIsLoadingZones] = useState(false);

  const user = JSON.parse(sessionStorage.getItem('auth_user') || '{}');

  // Fetch user's existing zones when zone checkout modal opens
  useEffect(() => {
    if (showZoneCheckout && plan.name === 'Zone Plan') {
      fetchExistingZones();
    }
  }, [showZoneCheckout]);

  const fetchExistingZones = async () => {
    setIsLoadingZones(true);
    try {
      const token = sessionStorage.getItem('auth_token');
      if (!token) {
        setIsLoadingZones(false);
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.STRIPE_MY_ZONE_PLAN}`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.purchased_zones) {
          // Extract zone names from purchased_zones object
          const purchasedZoneNames = Object.keys(data.purchased_zones);
          setPurchasedZones(purchasedZoneNames);
        }
      }
    } catch (error) {
      console.error('Error fetching existing zones:', error);
    } finally {
      setIsLoadingZones(false);
    }
  };

  const handleVerifyStudentEmail = () => {
    const isEducational = /@[\w.-]+\.(edu|ac)(\.[a-z]{2,})?$|\.university$/i.test(studentEmail);
    if (!isEducational) {
      setError('Please enter a valid college/institute email.');
      return;
    }
    setError('Verification link has been sent to your email.');
  };

  // Zone Plan Helper Functions
  const toggleZone = (zoneName: string) => {
    // Don't allow toggling if zone is already purchased
    if (purchasedZones.includes(zoneName)) {
      return;
    }
    setSelectedZones(prev => ({
      ...prev,
      [zoneName]: !prev[zoneName]
    }));
  };

  const incrementPCs = () => {
    setNumberOfPCs(prev => prev + 1);
  };

  const decrementPCs = () => {
    setNumberOfPCs(prev => Math.max(1, prev - 1));
  };

  const getSelectedZonesCount = () => {
    return Object.values(selectedZones).filter(Boolean).length;
  };

  const calculateZoneTotal = () => {
    const zonesCount = getSelectedZonesCount();
    return zonesCount * numberOfPCs * plan.price;
  };

  const handleZoneCheckout = async () => {
    if (getSelectedZonesCount() === 0) {
      alert('Please select at least one zone');
      return;
    }

    try {
      // Get auth token
      const token = sessionStorage.getItem('auth_token');
      if (!token) {
        alert('Please login to proceed with checkout');
        setShowZoneCheckout(false);
        window.location.href = '/auth/login';
        return;
      }

      const selectedZonesList = Object.entries(selectedZones)
        .filter(([_, selected]) => selected)
        .map(([zoneName, _]) => zoneName);

      // Check if this is an upgrade (user has purchased zones already)
      const isUpgrade = purchasedZones.length > 0;

      let response;
      if (isUpgrade) {
        // Use upgrade API
        console.log('Upgrading zone plan with zones:', selectedZonesList);

        response = await fetch(`${API_ENDPOINTS.STRIPE_UPGRADE_ZONE_PLAN}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          body: JSON.stringify({
            new_zones: selectedZonesList
          }),
        });
      } else {
        // Use regular checkout for new zone plan
        const payload = {
          zones: selectedZonesList,
          numberOfPCs: numberOfPCs,
          stripe_price_id: plan.stripe_price_id,
        };

        console.log('New zone plan checkout:', payload);

        response = await fetch('http://localhost:8000/api/stripe/create-checkout-session/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.error || 'Failed to create checkout session');
      }

      const data = await response.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error: any) {
      console.error('Zone checkout error:', error);
      alert(error.message || 'An error occurred during checkout. Please try again.');
      setShowZoneCheckout(false);
    }
  };


  const handleAddToCart = () => {
    const userEmail = sessionStorage.getItem('auth_email');
    const user = JSON.parse(sessionStorage.getItem('auth_user') || '{}');
    const currentPlan = user.plan;
    const cartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');

    // Redirect immediately for institution
    if (plan.id === 'institution') {
      window.location.href = '/salesform';
      return;
    }

    // Show zone checkout modal for zone plan
    if (plan.id === 'zone') {
      if (!userEmail) {
        setModalMode('login');
        setShowModal(true);
        return;
      }
      setShowZoneCheckout(true);
      return;
    }

    // ✅ Block switching from Pro or Student plan
    const blockedPlans = ['pro', 'student', 'premium'];

    if (user?.plan && blockedPlans.includes(user.plan.toLowerCase())) {
      setModalMode('taken');
      setShowModal(true);
      return;
    }

    if (!userEmail) {
      setModalMode('login');
      setShowModal(true);
      return;
    }

    // Student email check
    if (plan.id === 'Student') {
      const isEducational = /@[\w.-]+\.(edu|ac)(\.[a-z]{2,})?$|\.university$/i.test(userEmail);
      if (!isEducational) {
        setModalMode('restricted');
        setShowModal(true);
        return;
      }
    }

    if (plan.id === 'free') {
      // Call the demo license API
      const handleRequestDemo = async () => {
        setIsLoadingDemo(true);
        try {
          const response = await axios.post(
            API_ENDPOINTS.PAYMENT_REQUEST_DEMO,
            { email: userEmail },
            {
              headers: {
                Authorization: `Token ${sessionStorage.getItem('auth_token')}`,
              },
            }
          );

          if (response.data.status === 'success') {
            alert('Demo license request successful! Check your email for the license key.');
          } else {
            alert(response.data.message || 'Failed to request demo license. Please try again.');
          }
        } catch (error: any) {
          console.error('Error requesting demo license:', error);
          alert(error.response?.data?.message || 'An error occurred while requesting the demo license.');
        } finally {
          setIsLoadingDemo(false);
        }
      };

      handleRequestDemo();
      return;
    }

    const alreadyInCart = cartItems.find((item: any) => item.id === plan.id);
    if (alreadyInCart) return;

    const newItem = {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      type: 'plan' as 'plan',
      stripe_price_id: plan.stripe_price_id,
    };

    const updatedCart = [...cartItems, newItem];
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    addItem(newItem);
  };




  useEffect(() => {
    const userEmail = sessionStorage.getItem('auth_email');
    const pendingPlanId = sessionStorage.getItem('pendingPlanId');
    if (userEmail && pendingPlanId === plan.id) {
      if (plan.id === 'Student') {
        const isEducational = /@[\w.-]+\.(edu|ac)(\.[a-z]{2,})?$|\.university$/i.test(userEmail);
        if (!isEducational) {
          setModalMode('restricted');
          setShowModal(true);
        } else {
          setModalMode('verify');
          setShowModal(true);
        }
      } else {
        handleAddToCart();
      }
      sessionStorage.removeItem('pendingPlanId');
    }
  }, []);

  return (
    <>
      <Card
        highlighted={plan.mostPopular}
        className={`h-full flex flex-col ${!plan.mostPopular ? 'border-2 border-gray-200' : 'border-orange-500 border-2'} transform transition-transform hover:scale-105`}
      >
        <div className="p-3 sm:p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
            {(plan.id === 'Student' || plan.id === 'pro' || plan.id === 'zone') && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                {plan.id === 'Student' ? '90% OFF' : plan.id === 'zone' ? '80% OFF' : '70% OFF'}
              </span>
            )}
          </div>
          {/* Price display for free, Student, pro, and zone plans */}
          {(plan.id === 'free' || plan.id === 'Student' || plan.id === 'pro' || plan.id === 'zone') && (
            <div className="mb-4 flex items-baseline space-x-2">
              {(plan.id === 'Student' || plan.id === 'pro' || plan.id === 'zone') ? (
                <>
                  <span className="text-xl font-bold text-black">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-gray-1000 ml-1">
                    /year
                  </span>

                  <span className="text-gray-600 line-through text-base">
                    {plan.id === 'Student' ? '$99.99' : plan.id === 'zone' ? '$119.99' : '$349.99'}
                  </span>


                </>
              ) : (
                <>
                  <span className="text-xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.billing}</span>
                </>
              )}
            </div>

          )}


          <ul className="mb-4 flex-grow space-y-2">
            {plan.id === 'pro' && <></>}

            {plan.id === 'institution' && (
              <>

              </>
            )}

            {/* 💡 Common Feature Loop */}
            {plan.features.map((feature, index) => {
              // For Free Plan, use dangerouslySetInnerHTML to render HTML content
              if (plan.id === 'free') {
                return (
                  <li key={index} className="flex items-start">
                    <CheckCircle size={12} className="text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: feature }} />
                  </li>
                );
              }

              // For other plans, keep the existing behavior
              const parts = feature.split(/(Available Drones-\d+:?|Permitted Zones?-?\d*\s*\(?[^)]*\)?:?)/g);
              return (
                <li key={index} className="flex items-start">
                  <CheckCircle size={12} className="text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    {parts.map((part, i) => {
                      if (part.match(/^Available Drones-\d+:?/i) ||
                        part.match(/^Permitted Zones?-?\d*\s*\(?[^)]*\)?:?/i)) {
                        return <strong key={i} className="font-semibold">{part}</strong>;
                      }
                      return part;
                    })}
                  </span>
                </li>
              );
            })}
          </ul>

          <Button
            variant={plan.buttonVariant}
            onClick={handleAddToCart}
            disabled={plan.id === 'free' && isLoadingDemo}
            fullWidth
          >
            {plan.id === 'free' && isLoadingDemo ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </span>
            ) : (
              plan.buttonText
            )}
          </Button>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div className="relative w-full max-w-3xl h-[350px] bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-xl shadow-2xl overflow-hidden flex">
            {/* Left Section */}
            <div className="w-1/2 flex flex-col justify-center items-center text-white px-4 relative">
              {plan.id === 'Student' ? (
                <div className="relative w-full flex flex-col items-center">
                  <img
                    src="/images/student-banner.jpeg"
                    alt="Student"
                    className="w-70 h-40 object-contain mb-4 rounded-xl"
                  />
                  <div className="space-y-2 z-10">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-1 flex items-center space-x-2">
                      <CheckCircle size={14} className="text-orange-500 mr-1.5 flex-shrink-0 mt-0.5" />

                      <span className="text-sm">Quick Verification</span>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-1 flex items-center space-x-2">
                      <GraduationCap size={18} />
                      <span className="text-sm">Student Discount</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full flex flex-col items-center">
                  <img
                    src="/images/drone-user.png"
                    alt="User"
                    className="w-70 h-40 object-contain mb-4 rounded-xl"
                  />
                  <div className="space-y-2 z-10">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-1 flex items-center space-x-2">
                      <Airplay size={16} />
                      <span className="text-sm">Simulation Access</span>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-1 flex items-center space-x-2">
                      <Satellite size={16} />
                      <span className="text-sm">Advanced Features</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="w-1/2 text-white px-6 py-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-white hover:text-gray-200"
              >
                <X size={20} />
              </button>

              {modalMode === 'login' && (
                <>
                  <h2 className="text-2xl font-bold mb-2">
                    {plan.id === 'Student' ? 'Access Student Benefits' : 'Access Drone Features'}
                  </h2>
                  <p className="text-sm text-white text-opacity-80 mb-4">
                    {plan.id === 'Student'
                      ? 'Login using your .edu or institute email.'
                      : 'Login to unlock advanced drone simulation, analytics, and training modules.'}
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => (window.location.href = '/auth/login')}
                      className="w-full bg-orange-700 hover:bg-orange-800 text-white font-semibold py-2 rounded-md text-sm"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        if (plan.id === 'Student') {
                          window.location.href = '/auth/studentregister';
                        } else {
                          window.location.href = '/auth/register';
                        }
                      }}
                      className="w-full bg-white bg-opacity-30 hover:bg-opacity-50 text-white font-semibold py-2 rounded-md text-sm border border-white border-opacity-20"
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              )}

              {modalMode === 'verify' && (
                <>
                  <h2 className="text-2xl font-bold mb-2">Verify Student Status</h2>
                  <p className="text-sm text-white text-opacity-80 mb-4">
                    Enter your educational email to verify and unlock discounts. Accepted domains: .edu, .ac.in, .university
                  </p>
                  <div className="relative mb-6">
                    <input
                      type="email"
                      placeholder="Enter your college email (e.g. john@abc.edu)"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-md text-gray-800 placeholder-gray-500 text-sm"
                    />
                    <Mail size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {error && (
                    <div className={`flex items-start space-x-2 backdrop-blur-md border rounded-xl p-3 text-sm shadow-lg ${error.includes('Verification')
                      ? 'bg-white/20 border-green-300 text-green-100'
                      : 'bg-white/30 border-red-300 text-red-800'
                      }`}>
                      {error.includes('Verification') ? (
                        <CheckCircle size={14} className="text-orange-500 mr-1.5 flex-shrink-0 mt-0.5" />

                      ) : (
                        <X size={18} className="mt-0.5 text-red-600" />
                      )}
                      <span className="font-medium leading-snug">{error}</span>
                    </div>
                  )}
                  <button
                    onClick={handleVerifyStudentEmail}
                    className="w-full mt-3 bg-orange-700 hover:bg-orange-800 text-white font-semibold py-2 rounded-md text-sm"
                  >
                    Send Verification Code
                  </button>
                  <p className="text-xs mt-4 text-white text-opacity-75">
                    We'll send a verification link to confirm your student status.
                  </p>
                </>
              )}

              {modalMode === 'restricted' && (
                <>
                  <h2 className="text-2xl font-bold mb-2">Student Plan Restricted</h2>
                  <p className="text-sm text-white text-opacity-80 mb-4">
                    This plan is only available for verified students with .edu or .ac email addresses.
                  </p>
                  <button
                    onClick={() => {
                      sessionStorage.clear();
                      window.location.href = '/auth/studentregister';
                    }}
                    className="w-full bg-white bg-opacity-30 hover:bg-opacity-50 text-white font-semibold py-2 rounded-md text-sm border border-white border-opacity-20"
                  >
                    Register as Student
                  </button>
                </>
              )}
              {modalMode === 'taken' && (
                <>
                  <h2 className="text-2xl font-bold mb-2">You Already Have a Plan</h2>
                  <p className="text-sm text-white text-opacity-80 mb-2">
                    You have already purchased the <strong>{user?.plan?.charAt(0).toUpperCase() + user?.plan?.slice(1)}</strong> plan.
                  </p>
                  <p className="text-sm text-white text-opacity-80 mb-4">
                    You cannot add or switch to another plan while your current subscription is active.
                  </p>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full bg-white bg-opacity-30 hover:bg-opacity-50 text-white font-semibold py-2 rounded-md text-sm border border-white border-opacity-20"
                  >
                    Close
                  </button>
                </>
              )}



              <p className="text-xs text-white text-opacity-50 mt-4">
                <Link to="/terms" className="underline hover:text-white text-white/70">
                  Terms & Conditions apply.
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Zone Plan Checkout Modal */}
      {showZoneCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowZoneCheckout(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
              </div>
              <div className="flex items-center gap-2">
                <img src="/images/ipage-logo.png" alt="iPAGE" className="h-8" />
                <span className="text-lg font-semibold text-orange-600">DRONE SIMULATOR</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex">
              {/* Left Section - Zone Configuration */}
              <div className="flex-1 p-8 bg-gray-50">
                {/* Configure Zone Plan */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Configure Zone Plan</h3>
                      <p className="text-sm text-orange-600">Select specific zones only.</p>
                    </div>
                  </div>
                </div>

                {/* Number of PCs */}
                <div className="mb-6 bg-white rounded-xl p-4 border border-gray-200">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Number of PCs</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={decrementPCs}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 text-gray-700 font-bold transition-all"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-gray-800 min-w-[3rem] text-center">{numberOfPCs}</span>
                    <button
                      onClick={incrementPCs}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 text-gray-700 font-bold transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Zone Selection */}
                <div className="space-y-3">
                  {Object.keys(selectedZones).map((zoneName) => {
                    const isPurchased = purchasedZones.includes(zoneName);
                    return (
                      <div
                        key={zoneName}
                        onClick={() => toggleZone(zoneName)}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isPurchased
                          ? 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                          : selectedZones[zoneName]
                            ? 'border-orange-500 bg-orange-50 cursor-pointer'
                            : 'border-gray-200 bg-white hover:border-orange-300 cursor-pointer'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${isPurchased
                            ? 'bg-gray-400 border-gray-400'
                            : selectedZones[zoneName]
                              ? 'bg-orange-500 border-orange-500'
                              : 'border-gray-300'
                            }`}>
                            {(selectedZones[zoneName] || isPurchased) && (
                              <CheckCircle size={16} className="text-white" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className={`font-medium ${isPurchased
                              ? 'text-gray-500'
                              : selectedZones[zoneName]
                                ? 'text-gray-800'
                                : 'text-gray-600'
                              }`}>
                              {zoneName}
                            </span>
                            {isPurchased && (
                              <span className="text-xs text-gray-500">Already purchased</span>
                            )}
                          </div>
                        </div>
                        {selectedZones[zoneName] && !isPurchased && (
                          <span className="text-orange-600 font-semibold">x {numberOfPCs}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Section - Order Summary */}
              <div className="w-[400px] bg-white p-8 border-l border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>

                {/* Selected Zones List */}
                <div className="space-y-4 mb-6">
                  {Object.entries(selectedZones)
                    .filter(([_, selected]) => selected)
                    .map(([zoneName, _]) => (
                      <div key={zoneName} className="pb-4 border-b border-gray-100">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-gray-800 font-medium">Zone Plan x {numberOfPCs}</span>
                          <span className="text-gray-800 font-semibold">
                            ${(plan.price * numberOfPCs).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-sm text-orange-600">Zone: {zoneName}</div>
                      </div>
                    ))}

                  {getSelectedZonesCount() === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No zones selected</p>
                      <p className="text-xs mt-1">Select at least one zone to continue</p>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t-2 border-gray-200 pt-4 mb-6">
                  <div className="mb-2">
                    <span className="text-gray-700 font-semibold">Total Billed Today</span>
                    <p className="text-xs text-gray-500">Inclusive of all taxes</p>
                  </div>
                  <div className="text-4xl font-bold text-orange-600">
                    ${calculateZoneTotal().toFixed(2)}
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleZoneCheckout}
                  disabled={getSelectedZonesCount() === 0}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all ${getSelectedZonesCount() === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg'
                    }`}
                >
                  Proceed to Checkout
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  SSL Encrypted • Secure Checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlanCard;
