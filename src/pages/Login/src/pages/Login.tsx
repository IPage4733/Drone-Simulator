import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import { jwtDecode } from 'jwt-decode';
interface CustomJwtPayload {
  email: string;
  name?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!validateForm()) return

  setIsLoading(true)

  try {
    const response = await fetch('https://13.203.213.111.nip.io/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.email.trim(),
        password: formData.password
      })
    })

    const data = await response.json()

    // Log to debug
    console.log('Login API Response:', data)

    if (response.ok && data.data?.token) {
      // Store token and user data in sessionStorage
      sessionStorage.setItem('auth_token', data.data.token)
      sessionStorage.setItem('auth_user', JSON.stringify(data.data.user))
      sessionStorage.setItem('auth_email', data.data.user.email)

      navigate('/') // ✅ Redirect to homepage
    } else {
      // Show fallback error from backend
      const errorMsg = data.message || data.error || 'Login failed'
      setErrors({ submit: errorMsg })
    }
  } catch (error) {
    console.error('Login Error:', error)
    setErrors({ submit: 'Login failed. Please try again later.' })
  } finally {
    setIsLoading(false)
  }
}

const handleGoogleLoginSuccess = async (credentialResponse: any) => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(credentialResponse.credential);
    const email = decoded.email;
    const username = decoded.name || email.split('@')[0];

    const response = await fetch('https://13.203.213.111.nip.io/api/social-login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential, email, username }),
    });

    const data = await response.json();

    if (!response.ok || !data.token) {
      throw new Error(data.message || 'Social login failed');
    }

    // Store user session
    sessionStorage.setItem('auth_token', data.token);
    sessionStorage.setItem('auth_user', JSON.stringify(data.user));
    sessionStorage.setItem('auth_email', email);
    sessionStorage.setItem('auth_username', username);

    // ✅ Immediately redirect
    navigate('/');
  } catch {
    // On error, you can optionally display something. Or silently fail:
    // setErrors({ submit: 'Social login failed.' });
  }
};


  return (
    <div className="auth-card">
      <Logo />

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Enter your email"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`form-input ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Enter your password"
          />
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>

        {errors.submit && <p className="form-error text-center">{errors.submit}</p>}

        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 mb-3">or</p>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => setErrors({ submit: 'Google sign-in was cancelled or failed.' })}
          />
        </div>
      </div>

      <div className="mt-6 text-center space-y-4">
        <Link to="/auth/forgot-password" className="text-orange-500 hover:text-orange-600 font-medium">
          Forgot your password?
        </Link>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-orange-500 hover:text-orange-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
