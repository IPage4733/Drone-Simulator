import { API_ENDPOINTS } from '@/config/api'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import Navigation from '@/components/Navigation'
// Types for API data
interface Country {
  name: { common: string };
  cca2: string;
  idd: { root: string; suffixes?: string[] };
}

interface State {
  name: string;
  state_code: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    full_name: '',
    company_name: '',
    phone_number: '',
    country_code: 'IN',
    phone_code: '+91',
    address: '',
    city: '',
    state_province: '',
    country: 'India',
    purpose_of_use: '',
    purpose_other: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // API data states
  const [countries, setCountries] = useState<Array<{ code: string; name: string; phone: string }>>([])
  const [states, setStates] = useState<Array<{ name: string; code: string }>>([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [loadingStates, setLoadingStates] = useState(false)

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
        const data: Country[] = await response.json();

        const formattedCountries = data
          .map(country => {
            const phoneCode = country.idd?.root
              ? `${country.idd.root}${country.idd.suffixes?.[0] || ''}`
              : '';

            return {
              code: country.cca2,
              name: country.name.common,
              phone: phoneCode
            };
          })
          .filter(c => c.phone) // Only include countries with phone codes
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
        // Fallback to India if API fails
        setCountries([{ code: 'IN', name: 'India', phone: '+91' }]);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!formData.country_code) return;

      setLoadingStates(true);
      try {
        const response = await fetch(
          `https://api.countrystatecity.in/v1/countries/${formData.country_code}/states`,
          {
            headers: {
              'X-CSCAPI-KEY': 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==' // Free API key
            }
          }
        );

        if (response.ok) {
          const data: State[] = await response.json();
          setStates(data.map(state => ({ name: state.name, code: state.state_code })));
        } else {
          setStates([]);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [formData.country_code]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Handle country selection
    if (name === 'country_code') {
      const selectedCountry = countries.find(c => c.code === value)
      if (selectedCountry) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          country: selectedCountry.name,
          phone_code: selectedCountry.phone,
          state_province: '' // Reset state when country changes
        }))
      }
    } else if (name === 'phone_number') {
      // Only allow numeric characters for phone number (max 15 digits)
      const numericValue = value.replace(/\D/g, '').slice(0, 15)
      setFormData(prev => ({ ...prev, [name]: numericValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }



    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    if (!formData.password_confirm) {
      newErrors.password_confirm = 'Please confirm your password'
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Passwords do not match'
    }

    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required'
    }

    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required'
    } else if (!/^\d{10,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must be 10-15 digits'
    }

    if (!formData.city) {
      newErrors.city = 'City is required'
    }

    if (!formData.state_province) {
      newErrors.state_province = 'State/Province is required'
    }

    if (!formData.country) {
      newErrors.country = 'Country is required'
    }

    if (formData.purpose_of_use === 'other' && !formData.purpose_other.trim()) {
      newErrors.purpose_other = 'Please specify your purpose of use'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const requestBody = {
        email: formData.email,
        username: formData.email.split('@')[0],
        password: formData.password,
        password_confirm: formData.password_confirm,
        full_name: formData.full_name,
        company_name: formData.company_name,
        phone_number: formData.phone_number,
        address: formData.address,
        city: formData.city,
        state_province: formData.state_province,
        country: formData.country,
        purpose_of_use: formData.purpose_of_use === 'other' ? formData.purpose_other : formData.purpose_of_use
      };

      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log("🔴 Full registration response:", data); // For debugging

      if (response.ok) {
        setShowVerificationPopup(true);
      } else {
        // ✅ Extract field-level errors like: "email already exists"
        if (data?.errors && typeof data.errors === 'object') {
          const newErrors: { [key: string]: string } = {};
          Object.entries(data.errors).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              newErrors[key] = value[0]; // Use the first error message
            }
          });
          setErrors(newErrors);
        } else {
          setErrors({ submit: data?.message || 'Registration failed. Please try again.' });
        }
      }

    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };








  return (
    <>
      <Navigation />
      {showVerificationPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg shadow-lg p-8 w-[550px] text-center text-white">

            <h3 className="text-2xl font-semibold mb-2">Ready to Take Flight?</h3>
            <p className="text-white text-sm mb-6">
              Join thousands of pilots who have mastered drone flying with our simulator.
            </p>

            {/* <div className="bg-white text-gray-800 rounded-md p-4 text-left text-sm">
        <p className="font-medium">To login to the Drone Simulator application after installation, please use the demo credentials below:</p>

        <p className="mt-2">
          Email: <strong>214G1A0555@srit.ac.in</strong><br />
          Password: <strong>Manasa@555</strong>
        </p>

        <p className="mt-4 text-gray-700 text-sm">
          Support: +91 9059759850 / +91 8804349999
        </p>
      </div> */}
            <p className="font-bold text-lg">
              A verification email has been sent to your registered email address. Please open your inbox, click the verification link, and then return to login and continue using the platform.
            </p>


            <button
              className="mt-6 px-6 py-2 bg-white text-orange-600 font-medium rounded hover:bg-gray-100"
              onClick={() => {
                setShowVerificationPopup(false);
                navigate('/');
              }}
            >
              Start Your Journey
            </button>

          </div>
        </div>
      )}

      <div
        className="pt-24 min-h-screen w-full bg-cover bg-center bg-no-repeat flex justify-end items-center px-2 md:px-12"
        style={{ backgroundImage: "url('/images/l1.png')" }}
      >
        <div className="w-full max-w-sm bg-white shadow-lg rounded-xl px-6 py-8 text-sm">

          <img
            src="/images/logonew.png"
            alt="Drone Simulator Logo"
            className="w-40 mx-auto mb-3"
          />


          <div className="text-center mb-3">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Create Account</h2>
          </div>

          {/* Form - Ultra Compact */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Row 1: Full Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">Full Name *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={`w-full px-1.5 py-1 border rounded text-xs focus:ring-1 focus:ring-orange-500 focus:border-transparent ${errors.full_name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Your full name"
              />
              {errors.full_name && <p className="text-red-500 text-xs mt-0.5">{errors.full_name}</p>}
            </div>

            {/* Row 2: Company Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                placeholder="Your company name (optional)"
              />
            </div>

            {/* Row 3: Email */}
            <div className="w-full">
              <label className="block text-xs font-medium text-gray-700 mb-0.5">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-1.5 py-1 border rounded text-xs focus:ring-1 focus:ring-orange-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="email@domain.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
            </div>

            {/* Row 4: Password & Confirm Password with Show/Hide */}
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-1.5 py-1 pr-7 border rounded text-xs focus:ring-1 focus:ring-orange-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xs"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">Confirm *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    className={`w-full px-1.5 py-1 pr-7 border rounded text-xs focus:ring-1 focus:ring-orange-500 focus:border-transparent ${errors.password_confirm ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xs"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password_confirm && <p className="text-red-500 text-xs mt-0.5">{errors.password_confirm}</p>}
              </div>
            </div>

            {/* Row 5: Country & Phone */}
            <div className="grid grid-cols-2 gap-1.5">
              {/* Country Field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">Country *</label>
                <select
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleChange}
                  disabled={loadingCountries}
                  className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {loadingCountries ? (
                    <option>Loading countries...</option>
                  ) : (
                    countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5 whitespace-nowrap">Phone Number *</label>
                <div className="flex">
                  <div className="flex items-center px-1.5 py-1 bg-gray-50 border border-r-0 border-gray-300 rounded-l text-xs font-medium text-gray-700 min-w-[40px] justify-center">
                    {formData.phone_code}
                  </div>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className={`w-32 px-1.5 py-1 border rounded-r text-xs focus:ring-1 focus:ring-orange-500 focus:border-transparent ${errors.phone_number ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Phone number"
                  />
                </div>
                {errors.phone_number && <p className="text-red-500 text-xs mt-0.5">{errors.phone_number}</p>}
              </div>
            </div>

            {/* Row 6: Address */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                placeholder="Street address (optional)"
              />
            </div>

            {/* Row 7: City, State & Purpose in 3 columns */}
            <div className="grid grid-cols-3 gap-1.5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-1.5 py-1 border rounded text-xs focus:ring-1 focus:ring-orange-500 focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="City"
                />
                {errors.city && <p className="text-red-500 text-xs mt-0.5">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">State *</label>
                <select
                  name="state_province"
                  value={formData.state_province}
                  onChange={handleChange}
                  disabled={loadingStates || states.length === 0}
                  className={`w-full px-1.5 py-1 border rounded text-xs focus:ring-1 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.state_province ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">
                    {loadingStates ? 'Loading states...' : states.length === 0 ? 'No states available' : 'Select state'}
                  </option>
                  {states.map((state) => (
                    <option key={state.code} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state_province && <p className="text-red-500 text-xs mt-0.5">{errors.state_province}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">Purpose *</label>
                <select
                  name="purpose_of_use"
                  value={formData.purpose_of_use}
                  onChange={handleChange}
                  className={`w-full px-1.5 py-1 border rounded text-xs focus:ring-1 focus:ring-orange-500 focus:border-transparent ${errors.purpose_of_use ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Purpose</option>
                  <option value="personal">Personal</option>
                  <option value="commercial">Commercial</option>
                  <option value="rpto">RPTO</option>
                  <option value="educational">Educational</option>
                  <option value="training">Training</option>
                  <option value="other">Other</option>
                </select>
                {errors.purpose_of_use && <p className="text-red-500 text-xs mt-0.5">{errors.purpose_of_use}</p>}
              </div>
            </div>

            {formData.purpose_of_use === 'other' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">Specify Purpose</label>
                <input
                  type="text"
                  name="purpose_other"
                  value={formData.purpose_other}
                  onChange={handleChange}
                  className={`w-full px-1.5 py-1 border rounded text-xs focus:ring-1 focus:ring-orange-500 focus:border-transparent ${errors.purpose_other ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your specific purpose"
                />
                {errors.purpose_other && <p className="text-red-500 text-xs mt-0.5">{errors.purpose_other}</p>}
              </div>
            )}

            {errors.submit && <p className="text-red-500 text-xs text-center">{errors.submit}</p>}

            {/* Submit Button - Compact */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-40 mx-auto block bg-orange-500 hover:bg-orange-600 text-white font-medium py-[6px] px-3 rounded text-[11px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register