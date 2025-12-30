import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navigation from '@/components/Navigation'
import Logo from '../components/Logo'
import { Eye, EyeOff } from 'lucide-react'
import { API_ENDPOINTS } from '@/config/api'

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
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
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        })
      })

      const data = await response.json()
      if (response.ok && data.data?.token) {
        sessionStorage.setItem('auth_token', data.data.token)
        sessionStorage.setItem('auth_user', JSON.stringify(data.data.user))
        sessionStorage.setItem('auth_email', data.data.user.email)
        if (data.data.user.email === 'dronesimulatorpro@gmail.com') {
          navigate('/dash/master/dashboard')
        } else {
          navigate('/')
        }
      } else {
        setErrors({ submit: data.message || data.error || 'Login failed' })
      }
    } catch (error) {
      console.error('Login Error:', error)
      setErrors({ submit: 'Login failed. Please try again later.' })
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <>
      <Navigation />

      <div
        className="min-h-[calc(100vh-80px)] w-full bg-cover bg-center bg-no-repeat flex items-center justify-end px-4 md:pr-24 mt-20"
        style={{ backgroundImage: "url('/images/l1.png')" }}
      >


        <div className="bg-white rounded-lg shadow-md px-4 py-5 w-full max-w-xs text-xs">


          <img
            src="/images/logonew.png"
            alt="Drone Simulator Logo"
            className="w-64 mx-auto mb-3"
          />



          <div className="text-center mb-3">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Welcome Back</h2>
            <p className="text-[11px] text-gray-500">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label htmlFor="email" className="block text-[11px] font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input text-[12px] px-2 py-1 w-full ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter email"
              />
              {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input text-[12px] px-2 py-1 pr-8 w-full ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errors.submit && <p className="text-red-500 text-center mt-1">{errors.submit}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-40 text-[11px] py-[6px] mt-1 mx-auto block"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          <div className="mt-4 text-center text-[11px]">
            <div className="flex justify-center gap-3">
              <Link to="/auth/forgot-password" className="text-orange-500 hover:text-orange-600 font-medium">
                Forgot password?
              </Link>
              <span className="text-gray-400">|</span>
              <Link to="/auth/support" className="text-orange-500 hover:text-orange-600 font-medium">
                Support
              </Link>
            </div>
            {/* <button
              type="button"
              onClick={() => navigate('/auth/studentregister')}
              className="btn-primary w-40 text-[11px] py-[6px] mt-2 mx-auto block"
            >
              Register as Student
            </button> */}

            <div className="pt-3 border-t border-gray-200 mt-3">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-orange-500 hover:text-orange-600 font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Login as Student button */}

          </div>

        </div>
      </div>
    </>
  )
}

export default Login
