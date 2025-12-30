import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

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

interface UserInfo {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    country: string;
    countryCode: string;
    phoneCode: string;
    city: string;
    stateProvince: string;
    password: string;
}

interface LicenseResponse {
    success: boolean;
    message: string;
    data?: {
        license_key: string;
        plan_type: string;
        plan_name: string;
        expires_at: string;
        status: string;
        total_licenses?: number;
        licenses?: Array<{
            license_key: string;
            pc_number: number;
            total_pcs: number;
        }>;
        selected_zones?: string[];
        user: {
            email: string;
            username: string;
            full_name: string;
            email_verified: boolean;
        };
        generated_by: string;
    };
    warning?: string;
    error?: string;
}
const PLANS = [
    { id: 'free', title: 'Free Demo Plan' },
    { id: 'zone', title: 'Zone Plan' },
    { id: 'pro', title: 'Pro Plan' },
    { id: 'enterprise', title: 'Enterprise Plan' }
];

const AdminLicenseGenerator: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'register' | 'license'>('register');
    const [userInfo, setUserInfo] = useState<UserInfo>({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        country: 'India',
        countryCode: 'IN',
        phoneCode: '+91',
        city: '',
        stateProvince: '',
        password: ''
    });
    const [licenseEmail, setLicenseEmail] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('pro');
    const [quantity, setQuantity] = useState(1);
    const [pcCount, setPcCount] = useState(1);
    const [availableZones, setAvailableZones] = useState<Array<{ id: string; name: string }>>([]);
    const [selectedZones, setSelectedZones] = useState<string[]>([]);
    const [validity, setValidity] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    const [generatedLicense, setGeneratedLicense] = useState<LicenseResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = useState<string>('');

    // API data states
    const [countries, setCountries] = useState<Array<{ code: string; name: string; phone: string }>>([]);
    const [states, setStates] = useState<Array<{ name: string; code: string }>>([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingZones, setLoadingZones] = useState(false);

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

    // Fetch available zones on component mount
    useEffect(() => {
        const fetchZones = async () => {
            setLoadingZones(true);
            try {
                const response = await fetch(API_ENDPOINTS.AVAILABLE_ZONES, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('drone_auth_token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setAvailableZones(data.zones || []);
                } else {
                    console.error('Failed to fetch zones');
                    setAvailableZones([]);
                }
            } catch (error) {
                console.error('Error fetching zones:', error);
                setAvailableZones([]);
            } finally {
                setLoadingZones(false);
            }
        };

        fetchZones();
    }, []);

    // Auto-set validity period based on selected plan
    useEffect(() => {
        const today = new Date();
        let endDate: Date;

        if (selectedPlan === 'free') {
            // Free plan: 1 day validity
            endDate = new Date(today);
            endDate.setDate(endDate.getDate() + 1);
        } else {
            // All other plans: 1 year validity
            endDate = new Date(today);
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        setValidity({
            start: today.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
        });
    }, [selectedPlan]);

    // Fetch states when country changes
    useEffect(() => {
        const fetchStates = async () => {
            if (!userInfo.countryCode) return;

            setLoadingStates(true);
            try {
                const response = await fetch(
                    `https://api.countrystatecity.in/v1/countries/${userInfo.countryCode}/states`,
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
    }, [userInfo.countryCode]);
    function generatePasswordFromUserInfo(fullName: string, email: string, phone: string): string {
        // Get first 4 characters of email
        const emailPart = email.trim().substring(0, 4).toLowerCase();
        // Capitalize first character
        const emailPartCapitalized = emailPart.charAt(0).toUpperCase() + emailPart.slice(1);
        // Get last 4 digits from phone number (remove non-numeric characters)
        const phoneDigits = phone.replace(/\D/g, ''); // Remove all non-digits
        const phonePart = phoneDigits.slice(-4).padStart(4, '0'); // Get last 4 digits, pad with 0 if needed
        // Combine: First4EmailChars (first uppercase) + @ + Last4PhoneDigits
        return `${emailPartCapitalized}@${phonePart}`;
    }

    const handleUserInfoChange = (field: keyof UserInfo, value: string) => {
        // Handle country selection
        if (field === 'countryCode') {
            const selectedCountry = countries.find(c => c.code === value);
            if (selectedCountry) {
                setUserInfo(prev => ({
                    ...prev,
                    countryCode: value,
                    country: selectedCountry.name,
                    phoneCode: selectedCountry.phone,
                    stateProvince: '' // Reset state when country changes
                }));
            }
        } else {
            setUserInfo(prev => {
                const updated = { ...prev, [field]: value };
                // Auto-regenerate password when relevant fields change
                if (field === 'fullName' || field === 'email' || field === 'phone') {
                    updated.password = generatePasswordFromUserInfo(
                        field === 'fullName' ? value : updated.fullName,
                        field === 'email' ? value : updated.email,
                        field === 'phone' ? value : updated.phone
                    );
                }
                return updated;
            });
        }

        // Clear field-level errors
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateRegistrationForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!userInfo.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!userInfo.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (userInfo.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(userInfo.username)) {
            newErrors.username = 'Username can only contain letters, numbers, and underscores';
        }

        if (!userInfo.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!userInfo.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{7,15}$/.test(userInfo.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number (7-15 digits)';
        }

        if (!userInfo.city) {
            newErrors.city = 'City is required';
        }

        if (!userInfo.stateProvince) {
            newErrors.stateProvince = 'State/Province is required';
        }

        if (!userInfo.country) {
            newErrors.country = 'Country is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateLicenseForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!licenseEmail.trim()) {
            newErrors.licenseEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(licenseEmail)) {
            newErrors.licenseEmail = 'Email is invalid';
        }

        if (!selectedPlan) {
            newErrors.plan = 'Plan type is required';
        }

        if (selectedPlan === 'zone' && selectedZones.length === 0) {
            newErrors.zones = 'Please select at least one zone for Zone plan';
        }

        if (!validity.end) {
            newErrors.validity = 'Expiry date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleGenerateUser = async () => {
        // Validate and create the user account
        if (!validateRegistrationForm()) return;

        setLoading(true);
        setErrors({});
        setGeneratedLicense(null);

        try {
            // Register the user
            const requestBody = {
                full_name: userInfo.fullName,
                username: userInfo.username,
                email: userInfo.email,
                phone_number: userInfo.phone,
                city: userInfo.city,
                state_province: userInfo.stateProvince,
                country: userInfo.country,
                password: userInfo.password,
                password_confirm: userInfo.password
            };
            const response = await fetch(API_ENDPOINTS.ADMIN_CREATE_USER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('drone_auth_token')}`
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            console.log("🔴 Full registration response:", data); // For debugging

            if (response.ok) {
                // ✅ Registration successful - switch to license tab
                const registeredEmail = userInfo.email;
                setSuccessMessage(`User registered successfully! Email: ${registeredEmail}. Now generate a license key.`);
                setLicenseEmail(registeredEmail); // Pre-fill the email in license tab
                setActiveTab('license'); // Switch to license generation tab

                // Reset registration form
                setUserInfo({
                    fullName: '',
                    username: '',
                    email: '',
                    phone: '',
                    country: 'India',
                    countryCode: 'IN',
                    phoneCode: '+91',
                    city: '',
                    stateProvince: '',
                    password: ''
                });
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

        } catch (err: any) {
            console.error('Error creating user:', err);
            setErrors({ submit: 'An unexpected error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };
    const handleGenerateLicenseOnly = async () => {
        if (!validateLicenseForm()) return;

        setLoading(true);
        setErrors({});
        setSuccessMessage('');
        setGeneratedLicense(null);

        try {
            // Get auth token from localStorage or context
            const token = localStorage.getItem('drone_auth_token'); // Adjust based on your auth implementation
            // Calculate expires_at date
            const expiresAt = new Date(validity.end);
            expiresAt.setHours(23, 59, 59, 999);

            // Build request body
            const requestBody: any = {
                user_email: licenseEmail,
                plan_type: selectedPlan,
                expires_at: expiresAt.toISOString(),
            };

            // Add zone-specific fields if zone plan selected
            if (selectedPlan === 'zone') {
                requestBody.selected_zones = selectedZones;
                requestBody.total_pcs = pcCount;
            }

            const response = await axios.post<LicenseResponse>(
                API_ENDPOINTS.GENERATE_LICENSE,
                requestBody,
                {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setGeneratedLicense(response.data);
            // Reset form or keep for next generation
            // Optionally clear the form here
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to generate license key';
            setErrors({ submit: errorMessage });
            console.error('Error generating license:', err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="space-y-6 animate-fade-in max-w-5xl">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => {
                            setActiveTab('register');
                            setErrors({});
                            setGeneratedLicense(null);
                            setSuccessMessage('');
                        }}
                        className={`flex-1 px-6 py-4 font-bold text-sm transition-colors ${activeTab === 'register'
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        📝 Register New User
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('license');
                            setErrors({});
                            setGeneratedLicense(null);
                            setSuccessMessage('');
                        }}
                        className={`flex-1 px-6 py-4 font-bold text-sm transition-colors ${activeTab === 'license'
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        🔑 Generate License Key
                    </button>
                </div>
            </div>

            {/* Tab Content - Register New User */}
            {activeTab === 'register' && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Section 1: User Information */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded flex items-center justify-center text-xs">1</span>
                                User Information
                            </h2>
                            <div className="space-y-3">
                                <div className="flex flex-col mb-4 w-full">
                                    <label className="text-gray-600 text-sm font-medium mb-1.5">Full Name *</label>
                                    <input
                                        type="text"
                                        value={userInfo.fullName}
                                        onChange={(e) => handleUserInfoChange('fullName', e.target.value)}
                                        placeholder="e.g. John Pilot"
                                        className={`w-full px-4 py-2.5 rounded-md border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                </div>
                                <div className="flex flex-col mb-4 w-full">
                                    <label className="text-gray-600 text-sm font-medium mb-1.5">Username *</label>
                                    <input
                                        type="text"
                                        value={userInfo.username}
                                        onChange={(e) => handleUserInfoChange('username', e.target.value)}
                                        placeholder="e.g. pilot_01"
                                        className={`w-full px-4 py-2.5 rounded-md border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                    />
                                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                                </div>
                                <div className="flex flex-col mb-4 w-full">
                                    <label className="text-gray-600 text-sm font-medium mb-1.5">Email Address (ID) *</label>
                                    <input
                                        type="email"
                                        value={userInfo.email}
                                        onChange={(e) => handleUserInfoChange('email', e.target.value)}
                                        placeholder="pilot@example.com"
                                        className={`w-full px-4 py-2.5 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div className="flex flex-col mb-4 w-full">
                                    <label className="text-gray-600 text-sm font-medium mb-1.5">Country *</label>
                                    <select
                                        value={userInfo.countryCode}
                                        onChange={(e) => handleUserInfoChange('countryCode', e.target.value)}
                                        disabled={loadingCountries}
                                        className={`w-full px-4 py-2.5 rounded-md border ${errors.country ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
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
                                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                </div>
                                <div className="flex flex-col mb-4 w-full">
                                    <label className="text-gray-600 text-sm font-medium mb-1.5">Phone Number *</label>
                                    <div className="flex">
                                        <div className="flex items-center px-3 py-2.5 bg-gray-50 border border-r-0 border-gray-300 rounded-l text-sm font-medium text-gray-700 min-w-[60px] justify-center">
                                            {userInfo.phoneCode}
                                        </div>
                                        <input
                                            type="tel"
                                            value={userInfo.phone}
                                            onChange={(e) => handleUserInfoChange('phone', e.target.value)}
                                            placeholder="1234567890"
                                            className={`flex-1 px-4 py-2.5 border rounded-r ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col mb-4 w-full">
                                        <label className="text-gray-600 text-sm font-medium mb-1.5">City *</label>
                                        <input
                                            type="text"
                                            value={userInfo.city}
                                            onChange={(e) => handleUserInfoChange('city', e.target.value)}
                                            placeholder="City"
                                            className={`w-full px-4 py-2.5 rounded-md border ${errors.city ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                        />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                    </div>
                                    <div className="flex flex-col mb-4 w-full">
                                        <label className="text-gray-600 text-sm font-medium mb-1.5">State/Province *</label>
                                        <select
                                            value={userInfo.stateProvince}
                                            onChange={(e) => handleUserInfoChange('stateProvince', e.target.value)}
                                            disabled={loadingStates || states.length === 0}
                                            className={`w-full px-4 py-2.5 rounded-md border ${errors.stateProvince ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
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
                                        {errors.stateProvince && <p className="text-red-500 text-xs mt-1">{errors.stateProvince}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Section 2: Password Information */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded flex items-center justify-center text-xs">2</span>
                                Auto-Generated Password
                            </h2>
                            <div className="bg-slate-50 p-4 rounded border border-slate-200">
                                <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Generated Password</label>
                                <p className="font-mono font-bold text-slate-800 text-2xl mb-4 break-all">{userInfo.password || 'Fill in user details...'}</p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                                    <p className="text-xs text-blue-800 font-medium mb-2">📋 Password Format:</p>
                                    <p className="text-xs text-blue-700 mb-1">• First 4 characters of email (first letter uppercase)</p>
                                    <p className="text-xs text-blue-700 mb-1">• @ symbol</p>
                                    <p className="text-xs text-blue-700 mb-1">• Last 4 digits of phone number</p>
                                    <p className="text-xs text-blue-600 mt-3 italic font-medium">Example: John@1234</p>
                                    <p className="text-xs text-blue-600 italic">From: john@example.com, phone ending in 1234</p>
                                </div>
                            </div>
                            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <p className="text-xs text-orange-800 font-medium mb-2">ℹ️ Note:</p>
                                <p className="text-xs text-orange-700">This password will be automatically set for the new user. After registration, you'll be redirected to generate their license key.</p>
                            </div>
                        </div>
                    </div>
                    {/* Error Display */}
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <p className="font-medium">Error:</p>
                            <p className="text-sm">{errors.submit}</p>
                        </div>
                    )}
                    {/* Action Button */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                        <button
                            onClick={handleGenerateUser}
                            disabled={loading}
                            className="w-full md:w-auto px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Registering User...' : 'Register User'}
                        </button>
                    </div>
                </>
            )}

            {/* Tab Content - Generate License Key */}
            {activeTab === 'license' && (
                <>
                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            <p className="font-medium">✓ Success!</p>
                            <p className="text-sm">{successMessage}</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Section 1: Email Input */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded flex items-center justify-center text-xs">1</span>
                                User Email
                            </h2>
                            <div className="space-y-3">
                                <div className="flex flex-col mb-4 w-full">
                                    <label className="text-gray-600 text-sm font-medium mb-1.5">Email Address *</label>
                                    <input
                                        type="email"
                                        value={licenseEmail}
                                        onChange={(e) => {
                                            setLicenseEmail(e.target.value);
                                            if (errors.licenseEmail) {
                                                setErrors(prev => ({ ...prev, licenseEmail: '' }));
                                            }
                                        }}
                                        placeholder="user@example.com"
                                        className={`w-full px-4 py-2.5 rounded-md border ${errors.licenseEmail ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                    />
                                    {errors.licenseEmail && <p className="text-red-500 text-xs mt-1">{errors.licenseEmail}</p>}
                                    <p className="text-xs text-slate-500 mt-2">Enter the email address of the registered user for whom you want to generate a license key.</p>
                                </div>
                            </div>
                        </div>
                        {/* Section 2 & 3: Plan Config & Validity */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded flex items-center justify-center text-xs">2</span>
                                    Plan Configuration
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex flex-col mb-4 w-full">
                                        <label className="text-gray-600 text-sm font-medium mb-1.5">Select Plan Type *</label>
                                        <select
                                            value={selectedPlan}
                                            onChange={(e) => setSelectedPlan(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            {PLANS.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {selectedPlan === 'zone' && (
                                        <>
                                            {/* PC Count Input */}
                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fade-in mt-2">
                                                <label className="text-sm font-bold text-black mb-2 block uppercase tracking-wide">Number of PCs *</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="50"
                                                    value={pcCount}
                                                    onChange={(e) => setPcCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                                                    className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Specify how many PCs this license will cover (1-50). Multiple licenses will be generated.</p>
                                            </div>
                                            {/* Zone Selection */}
                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fade-in mt-2">
                                                <p className="text-sm font-bold text-black mb-3 uppercase tracking-wide">Permitted Zones *</p>
                                                {loadingZones ? (
                                                    <div className="text-center py-4 text-gray-500">Loading zones...</div>
                                                ) : availableZones.length === 0 ? (
                                                    <div className="text-center py-4 text-gray-500">No zones available</div>
                                                ) : (
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {availableZones.map(zone => (
                                                            <label key={zone.id} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-white rounded-lg transition-colors">
                                                                <div className="relative flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedZones.includes(zone.id)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelectedZones([...selectedZones, zone.id]);
                                                                            } else {
                                                                                setSelectedZones(selectedZones.filter(id => id !== zone.id));
                                                                            }
                                                                        }}
                                                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow-sm transition-all checked:border-orange-600 checked:bg-orange-600 hover:border-orange-400"
                                                                    />
                                                                    <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                                    </svg>
                                                                </div>
                                                                <span className="text-sm font-bold text-black group-hover:text-orange-700 transition-colors">{zone.name}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded flex items-center justify-center text-xs">3</span>
                                    Validity Period
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-gray-600 text-sm font-medium mb-1">End Date *</label>
                                        <input
                                            type="date"
                                            value={validity.end}
                                            onChange={(e) => setValidity({ ...validity, end: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Error Display */}
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <p className="font-medium">Error:</p>
                            <p className="text-sm">{errors.submit}</p>
                        </div>
                    )}
                    {errors.plan && <p className="text-red-500 text-sm">{errors.plan}</p>}
                    {errors.zones && <p className="text-red-500 text-sm">{errors.zones}</p>}
                    {errors.validity && <p className="text-red-500 text-sm">{errors.validity}</p>}
                    {/* Action Button */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                        <button
                            onClick={handleGenerateLicenseOnly}
                            disabled={loading}
                            className="w-full md:w-auto px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Generating License Key...' : 'Generate License Key'}
                        </button>
                    </div>
                </>
            )}

            {/* Success Display - Shared for both tabs */}
            {generatedLicense && generatedLicense.success && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200 animate-scale-in">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-bold text-green-700 text-lg">
                                {generatedLicense.data?.total_licenses > 1
                                    ? `${generatedLicense.data.total_licenses} License Keys Generated Successfully`
                                    : 'License Key Generated Successfully'
                                }
                            </h3>
                            <p className="text-sm text-slate-500">
                                {generatedLicense.data?.user.full_name} ({generatedLicense.data?.user.email})
                            </p>
                        </div>
                    </div>
                    {generatedLicense.warning && (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4">
                            <p className="font-medium">Warning:</p>
                            <p className="text-sm">{generatedLicense.warning}</p>
                        </div>
                    )}

                    {/* Display all licenses */}
                    {generatedLicense.data?.licenses && generatedLicense.data.licenses.length > 1 ? (
                        // Multiple licenses - show list
                        <div className="space-y-3 mb-4">
                            <p className="text-sm font-semibold text-slate-700 mb-2">Generated License Keys:</p>
                            {generatedLicense.data.licenses.map((license: any, index: number) => (
                                <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-semibold text-orange-600 uppercase">
                                            PC #{license.pc_number} of {license.total_pcs}
                                        </span>
                                    </div>
                                    <div className="font-mono font-bold text-slate-800 text-lg select-all break-all">
                                        {license.license_key}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Single license - simple display
                        <div className="bg-slate-100 p-4 rounded-lg mb-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">License Key:</span>
                                <span className="font-mono font-bold text-slate-800 select-all">
                                    {generatedLicense.data?.license_key}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Plan and Status Info */}
                    <div className="bg-slate-100 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <span className="text-sm text-slate-600">Plan:</span>
                            <span className="font-bold text-slate-800">{generatedLicense.data?.plan_name}</span>
                        </div>

                        {generatedLicense.data?.selected_zones && generatedLicense.data.selected_zones.length > 0 && (
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span className="text-sm text-slate-600">Zones:</span>
                                <span className="font-bold text-slate-800">
                                    {generatedLicense.data.selected_zones.join(', ')}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <span className="text-sm text-slate-600">Status:</span>
                            <span className="font-bold text-green-600 uppercase">{generatedLicense.data?.status}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Expires At:</span>
                            <span className="text-sm text-slate-800">
                                {generatedLicense.data?.expires_at ? new Date(generatedLicense.data.expires_at).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-slate-600">
                        <p>✓ License key(s) have been sent to the user's email address</p>
                        <p>✓ User can activate the key(s) in their application</p>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AdminLicenseGenerator;