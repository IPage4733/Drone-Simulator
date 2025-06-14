import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

// Country data with codes and phone prefixes
const countries = [
  { code: 'US', name: 'United States', phone: '+1' },
  { code: 'CA', name: 'Canada', phone: '+1' },
  { code: 'GB', name: 'United Kingdom', phone: '+44' },
  { code: 'AU', name: 'Australia', phone: '+61' },
  { code: 'DE', name: 'Germany', phone: '+49' },
  { code: 'FR', name: 'France', phone: '+33' },
  { code: 'IT', name: 'Italy', phone: '+39' },
  { code: 'ES', name: 'Spain', phone: '+34' },
  { code: 'NL', name: 'Netherlands', phone: '+31' },
  { code: 'BE', name: 'Belgium', phone: '+32' },
  { code: 'CH', name: 'Switzerland', phone: '+41' },
  { code: 'AT', name: 'Austria', phone: '+43' },
  { code: 'SE', name: 'Sweden', phone: '+46' },
  { code: 'NO', name: 'Norway', phone: '+47' },
  { code: 'DK', name: 'Denmark', phone: '+45' },
  { code: 'FI', name: 'Finland', phone: '+358' },
  { code: 'IE', name: 'Ireland', phone: '+353' },
  { code: 'PT', name: 'Portugal', phone: '+351' },
  { code: 'GR', name: 'Greece', phone: '+30' },
  { code: 'PL', name: 'Poland', phone: '+48' },
  { code: 'CZ', name: 'Czech Republic', phone: '+420' },
  { code: 'HU', name: 'Hungary', phone: '+36' },
  { code: 'SK', name: 'Slovakia', phone: '+421' },
  { code: 'SI', name: 'Slovenia', phone: '+386' },
  { code: 'HR', name: 'Croatia', phone: '+385' },
  { code: 'BG', name: 'Bulgaria', phone: '+359' },
  { code: 'RO', name: 'Romania', phone: '+40' },
  { code: 'LT', name: 'Lithuania', phone: '+370' },
  { code: 'LV', name: 'Latvia', phone: '+371' },
  { code: 'EE', name: 'Estonia', phone: '+372' },
  { code: 'MT', name: 'Malta', phone: '+356' },
  { code: 'CY', name: 'Cyprus', phone: '+357' },
  { code: 'LU', name: 'Luxembourg', phone: '+352' },
  { code: 'IS', name: 'Iceland', phone: '+354' },
  { code: 'JP', name: 'Japan', phone: '+81' },
  { code: 'KR', name: 'South Korea', phone: '+82' },
  { code: 'CN', name: 'China', phone: '+86' },
  { code: 'IN', name: 'India', phone: '+91' },
  { code: 'SG', name: 'Singapore', phone: '+65' },
  { code: 'HK', name: 'Hong Kong', phone: '+852' },
  { code: 'TW', name: 'Taiwan', phone: '+886' },
  { code: 'MY', name: 'Malaysia', phone: '+60' },
  { code: 'TH', name: 'Thailand', phone: '+66' },
  { code: 'PH', name: 'Philippines', phone: '+63' },
  { code: 'ID', name: 'Indonesia', phone: '+62' },
  { code: 'VN', name: 'Vietnam', phone: '+84' },
  { code: 'BD', name: 'Bangladesh', phone: '+880' },
  { code: 'PK', name: 'Pakistan', phone: '+92' },
  { code: 'LK', name: 'Sri Lanka', phone: '+94' },
  { code: 'NP', name: 'Nepal', phone: '+977' },
  { code: 'BT', name: 'Bhutan', phone: '+975' },
  { code: 'MV', name: 'Maldives', phone: '+960' },
  { code: 'AE', name: 'United Arab Emirates', phone: '+971' },
  { code: 'SA', name: 'Saudi Arabia', phone: '+966' },
  { code: 'QA', name: 'Qatar', phone: '+974' },
  { code: 'KW', name: 'Kuwait', phone: '+965' },
  { code: 'BH', name: 'Bahrain', phone: '+973' },
  { code: 'OM', name: 'Oman', phone: '+968' },
  { code: 'JO', name: 'Jordan', phone: '+962' },
  { code: 'LB', name: 'Lebanon', phone: '+961' },
  { code: 'IL', name: 'Israel', phone: '+972' },
  { code: 'TR', name: 'Turkey', phone: '+90' },
  { code: 'EG', name: 'Egypt', phone: '+20' },
  { code: 'ZA', name: 'South Africa', phone: '+27' },
  { code: 'NG', name: 'Nigeria', phone: '+234' },
  { code: 'KE', name: 'Kenya', phone: '+254' },
  { code: 'GH', name: 'Ghana', phone: '+233' },
  { code: 'UG', name: 'Uganda', phone: '+256' },
  { code: 'TZ', name: 'Tanzania', phone: '+255' },
  { code: 'ET', name: 'Ethiopia', phone: '+251' },
  { code: 'MA', name: 'Morocco', phone: '+212' },
  { code: 'DZ', name: 'Algeria', phone: '+213' },
  { code: 'TN', name: 'Tunisia', phone: '+216' },
  { code: 'LY', name: 'Libya', phone: '+218' },
  { code: 'SD', name: 'Sudan', phone: '+249' },
  { code: 'BR', name: 'Brazil', phone: '+55' },
  { code: 'AR', name: 'Argentina', phone: '+54' },
  { code: 'CL', name: 'Chile', phone: '+56' },
  { code: 'CO', name: 'Colombia', phone: '+57' },
  { code: 'PE', name: 'Peru', phone: '+51' },
  { code: 'VE', name: 'Venezuela', phone: '+58' },
  { code: 'EC', name: 'Ecuador', phone: '+593' },
  { code: 'UY', name: 'Uruguay', phone: '+598' },
  { code: 'PY', name: 'Paraguay', phone: '+595' },
  { code: 'BO', name: 'Bolivia', phone: '+591' },
  { code: 'GY', name: 'Guyana', phone: '+592' },
  { code: 'SR', name: 'Suriname', phone: '+597' },
  { code: 'GF', name: 'French Guiana', phone: '+594' },
  { code: 'MX', name: 'Mexico', phone: '+52' },
  { code: 'GT', name: 'Guatemala', phone: '+502' },
  { code: 'BZ', name: 'Belize', phone: '+501' },
  { code: 'SV', name: 'El Salvador', phone: '+503' },
  { code: 'HN', name: 'Honduras', phone: '+504' },
  { code: 'NI', name: 'Nicaragua', phone: '+505' },
  { code: 'CR', name: 'Costa Rica', phone: '+506' },
  { code: 'PA', name: 'Panama', phone: '+507' },
  { code: 'CU', name: 'Cuba', phone: '+53' },
  { code: 'JM', name: 'Jamaica', phone: '+1876' },
  { code: 'HT', name: 'Haiti', phone: '+509' },
  { code: 'DO', name: 'Dominican Republic', phone: '+1809' },
  { code: 'PR', name: 'Puerto Rico', phone: '+1787' },
  { code: 'TT', name: 'Trinidad and Tobago', phone: '+1868' },
  { code: 'BB', name: 'Barbados', phone: '+1246' },
  { code: 'RU', name: 'Russia', phone: '+7' },
  { code: 'UA', name: 'Ukraine', phone: '+380' },
  { code: 'BY', name: 'Belarus', phone: '+375' },
  { code: 'MD', name: 'Moldova', phone: '+373' },
  { code: 'GE', name: 'Georgia', phone: '+995' },
  { code: 'AM', name: 'Armenia', phone: '+374' },
  { code: 'AZ', name: 'Azerbaijan', phone: '+994' },
  { code: 'KZ', name: 'Kazakhstan', phone: '+7' },
  { code: 'KG', name: 'Kyrgyzstan', phone: '+996' },
  { code: 'TJ', name: 'Tajikistan', phone: '+992' },
  { code: 'TM', name: 'Turkmenistan', phone: '+993' },
  { code: 'UZ', name: 'Uzbekistan', phone: '+998' },
  { code: 'MN', name: 'Mongolia', phone: '+976' },
  { code: 'NZ', name: 'New Zealand', phone: '+64' },
  { code: 'FJ', name: 'Fiji', phone: '+679' },
  { code: 'PG', name: 'Papua New Guinea', phone: '+675' },
  { code: 'NC', name: 'New Caledonia', phone: '+687' },
  { code: 'VU', name: 'Vanuatu', phone: '+678' },
  { code: 'SB', name: 'Solomon Islands', phone: '+677' },
  { code: 'TO', name: 'Tonga', phone: '+676' },
  { code: 'WS', name: 'Samoa', phone: '+685' },
  { code: 'KI', name: 'Kiribati', phone: '+686' },
  { code: 'TV', name: 'Tuvalu', phone: '+688' },
  { code: 'NR', name: 'Nauru', phone: '+674' },
  { code: 'PW', name: 'Palau', phone: '+680' },
  { code: 'FM', name: 'Micronesia', phone: '+691' },
  { code: 'MH', name: 'Marshall Islands', phone: '+692' }
].sort((a, b) => a.name.localeCompare(b.name))

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    full_name: '',
    phone_number: '',
    country_code: 'US',
    phone_code: '+1',
    city: '',
    state_province: '',
    country: 'United States',
    purpose_of_use: 'personal',
    purpose_other: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

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
          phone_code: selectedCountry.phone
        }))
      }
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

    if (!formData.username) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
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
    } else if (!/^\d{7,15}$/.test(formData.phone_number.replace(/\D/g, ''))) {
      newErrors.phone_number = 'Please enter a valid phone number (7-15 digits)'
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
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const submitData = {
        ...formData,
        phone_number: `${formData.phone_code} ${formData.phone_number}`,
        purpose_of_use: formData.purpose_of_use === 'other' ? formData.purpose_other : formData.purpose_of_use
      }
      const success = await register(submitData)
      if (success) {
        navigate('/')
      } else {
        setErrors({ submit: 'Registration failed. Please try again.' })
      }
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-card" style={{ maxWidth: '600px' }}>
      <Logo />
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600">Join our drone simulation platform</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? 'border-red-500' : ''}`}
              placeholder="Enter username"
            />
            {errors.username && <p className="form-error">{errors.username}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Enter password"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password_confirm" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="password_confirm"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              className={`form-input ${errors.password_confirm ? 'border-red-500' : ''}`}
              placeholder="Confirm password"
            />
            {errors.password_confirm && <p className="form-error">{errors.password_confirm}</p>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="full_name" className="form-label">Full Name</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`form-input ${errors.full_name ? 'border-red-500' : ''}`}
            placeholder="Enter your full name"
          />
          {errors.full_name && <p className="form-error">{errors.full_name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="country_code" className="form-label">Country</label>
          <select
            id="country_code"
            name="country_code"
            value={formData.country_code}
            onChange={handleChange}
            className="form-input"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="phone_number" className="form-label">Phone Number</label>
          <div className="flex">
            <div className="flex items-center px-3 py-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-gray-700 font-medium">
              {formData.phone_code}
            </div>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className={`form-input rounded-l-none ${errors.phone_number ? 'border-red-500' : ''}`}
              placeholder="Enter phone number"
            />
          </div>
          {errors.phone_number && <p className="form-error">{errors.phone_number}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="city" className="form-label">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`form-input ${errors.city ? 'border-red-500' : ''}`}
              placeholder="Enter city"
            />
            {errors.city && <p className="form-error">{errors.city}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="state_province" className="form-label">State/Province</label>
            <input
              type="text"
              id="state_province"
              name="state_province"
              value={formData.state_province}
              onChange={handleChange}
              className={`form-input ${errors.state_province ? 'border-red-500' : ''}`}
              placeholder="Enter state/province"
            />
            {errors.state_province && <p className="form-error">{errors.state_province}</p>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="purpose_of_use" className="form-label">Purpose of Use</label>
          <select
            id="purpose_of_use"
            name="purpose_of_use"
            value={formData.purpose_of_use}
            onChange={handleChange}
            className="form-input"
          >
            <option value="personal">Personal</option>
            <option value="commercial">Commercial</option>
            <option value="educational">Educational</option>
            <option value="research">Research</option>
            <option value="other">Other</option>
          </select>
        </div>

        {formData.purpose_of_use === 'other' && (
          <div className="form-group">
            <label htmlFor="purpose_other" className="form-label">Please specify your purpose</label>
            <input
              type="text"
              id="purpose_other"
              name="purpose_other"
              value={formData.purpose_other}
              onChange={handleChange}
              className={`form-input ${errors.purpose_other ? 'border-red-500' : ''}`}
              placeholder="Enter your specific purpose"
            />
            {errors.purpose_other && <p className="form-error">{errors.purpose_other}</p>}
          </div>
        )}

        {errors.submit && <p className="form-error text-center">{errors.submit}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
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
  )
}

export default Register