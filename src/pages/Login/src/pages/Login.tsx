import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
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
      const success = await login(formData.email, formData.password)
      if (success) {
        navigate('/')
      } else {
        setErrors({ submit: 'Invalid email or password' })
      }
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <Logo />
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
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
          <label htmlFor="password" className="form-label">
            Password
          </label>
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

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center space-y-4">
        <Link
          to="/auth/forgot-password"
          className="text-orange-500 hover:text-orange-600 font-medium"
        >
          Forgot your password?
        </Link>
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login