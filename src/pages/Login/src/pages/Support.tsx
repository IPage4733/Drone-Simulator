import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import axios from 'axios'
import { API_ENDPOINTS } from '@/config/api'

const Support: React.FC = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        department: 'Partnership',
        subject: '',
        message: ''
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)

    const SUPPORT_DEPARTMENTS: Record<string, string[]> = {
        "Partnership": ["Reseller / Distributor Inquiry", "Training Academy Collaboration", "Enterprise Solutions", "University / Education", "Others"],
        "Account & Licensing": ["Forgot License Key", "License Activation Failed", "Hardware Binding Reset (PC Spoiled/Changed)", "Login Issues", "Account Recovery", "Others"],
        "Technical Support": ["Simulator Crashing/Freezing", "Installation Issues", "Graphics/Performance", "Controller/Joystick Not Working", "Others"],
        "Billing & Sales": ["Payment Failed", "Invoice Request", "Upgrade Plan", "Enterprise Inquiry", "Others"],
        "General Inquiry": ["Feature Request", "Feedback", "Others"]
    }

    // Get available subjects based on selected department
    const availableSubjects = SUPPORT_DEPARTMENTS[formData.department] || []

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        // If department changes, reset the subject
        if (name === 'department') {
            setFormData(prev => ({ ...prev, department: value, subject: '' }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }
        if (!formData.department) newErrors.department = 'Please select a department'
        if (!formData.subject) newErrors.subject = 'Please select an issue/subject'
        if (!formData.message.trim()) newErrors.message = 'Message is required'
        else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsLoading(true)

        try {
            const response = await axios.post(API_ENDPOINTS.SUPPORT, formData)
            setShowSuccessDialog(true)
        } catch (error) {
            console.error('Support ticket submission error:', error)
            setErrors({ submit: 'Failed to submit support ticket. Please try again later.' })
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
                <div className="bg-white rounded-lg shadow-md px-6 py-6 w-full max-w-md">

                    {/* Logo */}
                    <img
                        src="/images/logonew.png"
                        alt="Drone Simulator Logo"
                        className="w-64 mx-auto mb-4"
                    />

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Contact Support</h2>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Registered Username / Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-input text-sm px-3 py-2 w-full ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="Enter your email"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Department Dropdown */}
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                            </label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className={`form-input text-sm px-3 py-2 w-full ${errors.department ? 'border-red-500' : ''}`}
                                required
                            >
                                {Object.keys(SUPPORT_DEPARTMENTS).map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                        </div>

                        {/* Issue/Subject Dropdown */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                Issue / Subject
                            </label>
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className={`form-input text-sm px-3 py-2 w-full ${errors.subject ? 'border-red-500' : ''}`}
                                required
                            >
                                <option value="">Select Issue / Subject</option>
                                {availableSubjects.map(subj => (
                                    <option key={subj} value={subj}>{subj}</option>
                                ))}
                            </select>
                            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                        </div>

                        {/* Message Textarea */}
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                Message / Description
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                className={`form-input text-sm px-3 py-2 w-full resize-none ${errors.message ? 'border-red-500' : ''}`}
                                placeholder="Please describe your issue..."
                                required
                            />
                            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                        </div>

                        {/* Error Message */}
                        {errors.submit && <p className="text-red-500 text-center text-sm">{errors.submit}</p>}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full text-sm py-2.5 mt-2"
                        >
                            {isLoading ? 'Submitting...' : 'Open Support Ticket'}
                        </button>

                        {/* Cancel Link */}
                        <div className="text-center mt-3">
                            <Link
                                to="/auth/login"
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </Link>
                        </div>

                    </form>

                </div>
            </div>

            {/* Success Dialog */}
            {showSuccessDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Success Message */}
                        <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                            Support Ticket Submitted!
                        </h3>
                        <p className="text-gray-600 text-center mb-6">
                            Thank you for contacting us. We have received your support ticket and will get back to you soon.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate('/')}
                                className="btn-primary w-full py-2.5"
                            >
                                Go to Home Page
                            </button>
                            <button
                                onClick={() => setShowSuccessDialog(false)}
                                className="w-full py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Support
