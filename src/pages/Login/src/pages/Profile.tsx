import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const Profile: React.FC = () => {
  const { user, purchases, updateProfile, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    phone_number: '',
    city: '',
    state_province: '',
    country: '',
    purpose_of_use: '',
    purpose_other: ''
  })

  // Mock data for when user is not authenticated
  const mockUser = {
    email: 'demo@example.com',
    username: 'DemoUser',
    full_name: 'Demo User',
    phone_number: '+1 555-0123',
    city: 'Demo City',
    state_province: 'Demo State',
    country: 'Demo Country',
    purpose_of_use: 'personal',
    avatar_url: '',
    member_since: '2024-01-01',
    subscription_status: 'free' as const,
    total_flight_hours: 25.5,
    achievements: ['Welcome Aboard', 'First Flight', 'Night Pilot']
  }

  const mockPurchases = [
    {
      id: 'DEMO-001',
      product_name: 'DroneSimulator Basic License',
      product_type: 'software' as const,
      amount: 99.99,
      currency: 'USD',
      purchase_date: '2024-01-15',
      status: 'completed' as const,
      description: 'Basic drone simulation software with essential features',
      invoice_url: '#'
    },
    {
      id: 'DEMO-002',
      product_name: 'Beginner Training Course',
      product_type: 'training' as const,
      amount: 49.99,
      currency: 'USD',
      purchase_date: '2024-02-01',
      status: 'completed' as const,
      description: 'Introduction to drone piloting and basic safety protocols',
      invoice_url: '#'
    }
  ]

  // Use authenticated user data if available, otherwise use mock data
  const currentUser = user || mockUser
  const currentPurchases = purchases.length > 0 ? purchases : mockPurchases

  // Inline styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      borderBottom: '1px solid #e5e7eb'
    },
    headerContent: {
      maxWidth: '80rem',
      margin: '0 auto',
      padding: '0 1rem'
    },
    headerInner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '4rem'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    logoIcon: {
      backgroundColor: '#f97316',
      borderRadius: '0.5rem',
      padding: '0.5rem'
    },
    logoText: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#111827'
    },
    logoSubtext: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem'
    },
    navLink: {
      color: '#6b7280',
      textDecoration: 'none',
      fontWeight: '500',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      transition: 'all 0.2s',
      cursor: 'pointer'
    },
    navLinkHover: {
      color: '#f97316',
      backgroundColor: '#fff7ed'
    },
    logoutButton: {
      backgroundColor: '#f97316',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    mainContent: {
      maxWidth: '80rem',
      margin: '0 auto',
      padding: '2rem 1rem'
    },
    profileHeader: {
      background: 'linear-gradient(to right, #f97316, #ea580c)',
      borderRadius: '1rem',
      padding: '2rem',
      marginBottom: '2rem'
    },
    profileHeaderInner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    profileInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem'
    },
    avatar: {
      width: '6rem',
      height: '6rem',
      backgroundColor: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    avatarText: {
      fontSize: '1.875rem',
      fontWeight: '700',
      color: '#f97316'
    },
    profileName: {
      fontSize: '1.875rem',
      fontWeight: '700',
      color: 'white',
      marginBottom: '0.5rem'
    },
    profileUsername: {
      color: '#fed7aa',
      fontSize: '1.125rem'
    },
    profileMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginTop: '0.75rem'
    },
    badge: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    memberSince: {
      color: '#fed7aa',
      fontSize: '0.875rem'
    },
    flightHours: {
      textAlign: 'right' as const,
      color: 'white'
    },
    flightHoursNumber: {
      fontSize: '1.875rem',
      fontWeight: '700'
    },
    flightHoursLabel: {
      color: '#fed7aa'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    },
    statCardInner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    statLabel: {
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    statValue: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#111827'
    },
    statIcon: {
      padding: '0.75rem',
      borderRadius: '0.5rem'
    },
    tabsContainer: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    },
    tabsHeader: {
      borderBottom: '1px solid #e5e7eb'
    },
    tabsNav: {
      display: 'flex',
      gap: '2rem',
      padding: '0 2rem',
      paddingTop: '1.5rem'
    },
    tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem 0.25rem',
      borderBottom: '2px solid transparent',
      fontWeight: '500',
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: 'none',
      border: 'none'
    },
    tabActive: {
      borderBottomColor: '#f97316',
      color: '#ea580c'
    },
    tabInactive: {
      color: '#6b7280'
    },
    tabContent: {
      padding: '2rem'
    },
    formInput: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
      outline: 'none'
    },
    formInputFocused: {
      borderColor: '#f97316',
      boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.1)'
    },
    formInputDisabled: {
      backgroundColor: '#f9fafb',
      cursor: 'not-allowed'
    },
    formInputError: {
      borderColor: '#ef4444'
    },
    formLabel: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    formGridFull: {
      gridColumn: '1 / -1'
    },
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: 'none'
    },
    buttonPrimary: {
      backgroundColor: '#f97316',
      color: 'white'
    },
    buttonSecondary: {
      backgroundColor: '#6b7280',
      color: 'white'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    errorMessage: {
      color: '#ef4444',
      fontSize: '0.875rem',
      marginTop: '0.25rem'
    },
    successMessage: {
      padding: '1rem',
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '0.5rem',
      marginBottom: '1.5rem'
    },
    successMessageInner: {
      display: 'flex',
      alignItems: 'center'
    },
    successMessageText: {
      color: '#15803d',
      marginLeft: '0.75rem'
    },
    purchaseCard: {
      backgroundColor: '#f9fafb',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '1rem'
    },
    purchaseCardInner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    purchaseInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    purchaseIcon: {
      backgroundColor: 'white',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    purchaseDetails: {
      flex: 1
    },
    purchaseTitle: {
      fontWeight: '600',
      color: '#111827'
    },
    purchaseDescription: {
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    purchaseMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginTop: '0.5rem'
    },
    purchaseMetaItem: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    statusBadge: {
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    statusCompleted: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    statusPending: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    statusCancelled: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    },
    statusRefunded: {
      backgroundColor: '#f3f4f6',
      color: '#374151'
    },
    purchasePrice: {
      textAlign: 'right' as const
    },
    purchasePriceAmount: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#111827'
    },
    purchasePriceCurrency: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    achievementGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    achievementCard: {
      background: 'linear-gradient(135deg, #fefce8 0%, #fed7aa 100%)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid #fde68a'
    },
    achievementHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1rem'
    },
    achievementIcon: {
      backgroundColor: '#fef3c7',
      padding: '0.75rem',
      borderRadius: '50%'
    },
    achievementTitle: {
      fontWeight: '700',
      color: '#111827'
    },
    achievementSubtitle: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    achievementDescription: {
      backgroundColor: '#fef3c7',
      borderRadius: '0.5rem',
      padding: '0.75rem'
    },
    achievementDescriptionText: {
      fontSize: '0.875rem',
      color: '#92400e'
    },
    demoNotice: {
      backgroundColor: '#fef3c7',
      border: '1px solid #fde68a',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '2rem'
    },
    demoNoticeInner: {
      display: 'flex',
      alignItems: 'center'
    },
    demoNoticeText: {
      color: '#92400e',
      marginLeft: '0.75rem'
    }
  }

  useEffect(() => {
    // Try to get user from context first
    let savedUser = user

    // If not available, fallback to sessionStorage
    if (!savedUser) {
      const storedUser = sessionStorage.getItem('auth_user')
      if (storedUser) {
        try {
          savedUser = JSON.parse(storedUser)
        } catch (e) {
          console.error('Failed to parse auth_user from sessionStorage', e)
        }
      }
    }

    if (savedUser) {
      const isOtherPurpose = !['personal', 'commercial', 'educational', 'research'].includes(savedUser.purpose_of_use)
      setFormData({
        email: savedUser.email || '',
        username: savedUser.username || '',
        full_name: savedUser.full_name || '',
        phone_number: savedUser.phone_number || '',
        city: savedUser.city || '',
        state_province: savedUser.state_province || '',
        country: savedUser.country || '',
        purpose_of_use: isOtherPurpose ? 'other' : savedUser.purpose_of_use || '',
        purpose_other: isOtherPurpose ? savedUser.purpose_of_use : ''
      })

      // You can also optionally update any displayed mock fields here
    }
  }, [])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (successMessage) {
      setSuccessMessage('')
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

    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required'
    }

    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required'
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

    const tokenInStorage = sessionStorage.getItem('auth_token');
    if (!isAuthenticated && !tokenInStorage) {
      setErrors({ submit: 'Please log in to edit your profile.' });
      return;
    }


    setIsLoading(true)
    try {
      const submitData = {
        ...formData,
        purpose_of_use: formData.purpose_of_use === 'other' ? formData.purpose_other : formData.purpose_of_use
      }
      const success = await updateProfile(submitData)
      if (success) {
        setSuccessMessage('Profile updated successfully!')
        setIsEditing(false)
      } else {
        setErrors({ submit: 'Failed to update profile. Please try again.' })
      }
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    if (isAuthenticated) {
      logout()
      navigate('/auth/login')
    } else {
      navigate('/auth/login')
    }
  }

  const handleCancel = () => {
    if (currentUser) {
      const isOtherPurpose = !['personal', 'commercial', 'educational', 'research'].includes(currentUser.purpose_of_use)
      setFormData({
        email: currentUser.email,
        username: currentUser.username,
        full_name: currentUser.full_name,
        phone_number: currentUser.phone_number,
        city: currentUser.city,
        state_province: currentUser.state_province,
        country: currentUser.country,
        purpose_of_use: isOtherPurpose ? 'other' : currentUser.purpose_of_use,
        purpose_other: isOtherPurpose ? currentUser.purpose_of_use : ''
      })
    }
    setIsEditing(false)
    setErrors({})
    setSuccessMessage('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return styles.statusCompleted
      case 'pending': return styles.statusPending
      case 'cancelled': return styles.statusCancelled
      case 'refunded': return styles.statusRefunded
      default: return styles.statusRefunded
    }
  }

  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case 'software':
        return (
          <svg style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        )
      case 'hardware':
        return (
          <svg style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        )
      case 'subscription':
        return (
          <svg style={{ width: '1.25rem', height: '1.25rem', color: '#7c3aed' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      case 'training':
        return (
          <svg style={{ width: '1.25rem', height: '1.25rem', color: '#059669' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
      default:
        return (
          <svg style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerInner}>
            <div style={styles.logoContainer}>
              <div style={styles.logoIcon}>
                <svg style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 0 0 1-.37 1-1s-.37-1-1-1c-4.34-1.04-7-4.55-7-9V8.3l7-3.11 7 3.11V17c0 4.45-2.66 7.96-7 9 0 0-1 .37-1 1s1 1 1 1c5.16-1.26 9-5.45 9-11V7l-10-5z" />
                </svg>
              </div>
              <div>
                <h1 style={styles.logoText}>DroneSimulator</h1>
                <p style={styles.logoSubtext}>Profile Dashboard</p>
              </div>
            </div>
            <div style={styles.nav}>
              {isAuthenticated && (
                <Link
                  to="/"
                  style={styles.navLink}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = styles.navLinkHover.color
                    e.currentTarget.style.backgroundColor = styles.navLinkHover.backgroundColor
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = styles.navLink.color
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  Home
                </Link>
              )}

              <button
                onClick={handleLogout}
                style={{
                  ...styles.logoutButton,
                  ':hover': { backgroundColor: '#ea580c' }
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Demo Notice for non-authenticated users */}


        {/* Profile Header */}
        

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statCardInner}>
              <div>
                <p style={styles.statLabel}>Total Purchases</p>
                <p style={styles.statValue}>{currentPurchases.length}</p>
              </div>
              <div style={{ ...styles.statIcon, backgroundColor: '#dbeafe' }}>
                <svg style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statCardInner}>
              <div>
                <p style={styles.statLabel}>Total Spent</p>
                <p style={styles.statValue}>
                  ${currentPurchases.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                </p>
              </div>
              <div style={{ ...styles.statIcon, backgroundColor: '#dcfce7' }}>
                <svg style={{ width: '1.5rem', height: '1.5rem', color: '#16a34a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statCardInner}>
              <div>
                <p style={styles.statLabel}>Achievements</p>
                <p style={styles.statValue}>{currentUser.achievements.length}</p>
              </div>
              <div style={{ ...styles.statIcon, backgroundColor: '#fef3c7' }}>
                <svg style={{ width: '1.5rem', height: '1.5rem', color: '#d97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statCardInner}>
              <div>
                <p style={styles.statLabel}>Active Orders</p>
                <p style={styles.statValue}>
                  {currentPurchases.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <div style={{ ...styles.statIcon, backgroundColor: '#fed7aa' }}>
                <svg style={{ width: '1.5rem', height: '1.5rem', color: '#ea580c' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <div style={styles.tabsHeader}>
            <nav style={styles.tabsNav}>
              {[
                {
                  id: 'overview',
                  name: 'Overview',
                  icon: (
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  id: 'profile',
                  name: 'Profile Settings',
                  icon: (
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )
                },
                {
                  id: 'purchases',
                  name: 'Purchase History',
                  icon: (
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  )
                },
                {
                  id: 'achievements',
                  name: 'Achievements',
                  icon: (
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  )
                }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab.id ? styles.tabActive : styles.tabInactive)
                  }}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div style={styles.tabContent}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>Account Overview</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                    {/* Recent Activity */}
                    <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Recent Activity</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {currentPurchases.slice(0, 3).map((purchase) => (
                          <div key={purchase.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ backgroundColor: 'white', padding: '0.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                              {getProductTypeIcon(purchase.product_type)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontWeight: '500', color: '#111827' }}>{purchase.product_name}</p>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                {new Date(purchase.purchase_date).toLocaleDateString()}
                              </p>
                            </div>
                            <span style={{ ...styles.statusBadge, ...getStatusColor(purchase.status) }}>
                              {purchase.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Quick Stats</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#6b7280' }}>Account Status</span>
                          <span style={{ fontWeight: '600', color: '#059669' }}>Active</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#6b7280' }}>Subscription</span>
                          <span style={{ fontWeight: '600', color: '#ea580c' }}>{currentUser.subscription_status.toUpperCase()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#6b7280' }}>Location</span>
                          <span style={{ fontWeight: '600', color: '#111827' }}>{currentUser.city}, {currentUser.country}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#6b7280' }}>Purpose</span>
                          <span style={{ fontWeight: '600', color: '#111827', textTransform: 'capitalize' }}>{currentUser.purpose_of_use}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div>
                {/* Success Message */}
                {successMessage && (
                  <div style={styles.successMessage}>
                    <div style={styles.successMessageInner}>
                      <svg style={{ width: '1.25rem', height: '1.25rem', color: '#16a34a' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span style={styles.successMessageText}>{successMessage}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Profile Information</h3>
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => {
  const tokenInStorage = sessionStorage.getItem('auth_token');
  if (!isAuthenticated && !tokenInStorage) {
    setErrors({ submit: 'Please log in to edit your profile.' });
    return;
  }
  setIsEditing(true);
}}

                        style={{ ...styles.button, ...styles.buttonPrimary, padding: '0.75rem 1.5rem' }}
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={handleCancel}
                          style={{ ...styles.button, ...styles.buttonSecondary, padding: '0.5rem 1rem' }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          style={{
                            ...styles.button,
                            ...styles.buttonPrimary,
                            ...(isLoading ? styles.buttonDisabled : {}),
                            padding: '0.5rem 1rem'
                          }}
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label htmlFor="email" style={styles.formLabel}>Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{
                          ...styles.formInput,
                          ...(!isEditing ? styles.formInputDisabled : {}),
                          ...(errors.email ? styles.formInputError : {})
                        }}
                      />
                      {errors.email && <p style={styles.errorMessage}>{errors.email}</p>}
                    </div>

                    <div style={styles.formGroup}>
                      <label htmlFor="username" style={styles.formLabel}>Username</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{
                          ...styles.formInput,
                          ...(!isEditing ? styles.formInputDisabled : {}),
                          ...(errors.username ? styles.formInputError : {})
                        }}
                      />
                      {errors.username && <p style={styles.errorMessage}>{errors.username}</p>}
                    </div>

                    <div style={{ ...styles.formGroup, ...styles.formGridFull }}>
                      <label htmlFor="full_name" style={styles.formLabel}>Full Name</label>
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{
                          ...styles.formInput,
                          ...(!isEditing ? styles.formInputDisabled : {}),
                          ...(errors.full_name ? styles.formInputError : {})
                        }}
                      />
                      {errors.full_name && <p style={styles.errorMessage}>{errors.full_name}</p>}
                    </div>

                    <div style={styles.formGroup}>
                      <label htmlFor="phone_number" style={styles.formLabel}>Phone Number</label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{
                          ...styles.formInput,
                          ...(!isEditing ? styles.formInputDisabled : {}),
                          ...(errors.phone_number ? styles.formInputError : {})
                        }}
                      />
                      {errors.phone_number && <p style={styles.errorMessage}>{errors.phone_number}</p>}
                    </div>

                    <div style={styles.formGroup}>
                      <label htmlFor="purpose_of_use" style={styles.formLabel}>Purpose of Use</label>
                      <select
                        id="purpose_of_use"
                        name="purpose_of_use"
                        value={formData.purpose_of_use}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{
                          ...styles.formInput,
                          ...(!isEditing ? styles.formInputDisabled : {})
                        }}
                      >
                        <option value="personal">Personal</option>
                        <option value="commercial">Commercial</option>
                        <option value="educational">Educational</option>
                        <option value="research">Research</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {formData.purpose_of_use === 'other' && (
                      <div style={{ ...styles.formGroup, ...styles.formGridFull }}>
                        <label htmlFor="purpose_other" style={styles.formLabel}>Please specify your purpose</label>
                        <input
                          type="text"
                          id="purpose_other"
                          name="purpose_other"
                          value={formData.purpose_other}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Enter your specific purpose"
                          style={{
                            ...styles.formInput,
                            ...(!isEditing ? styles.formInputDisabled : {}),
                            ...(errors.purpose_other ? styles.formInputError : {})
                          }}
                        />
                        {errors.purpose_other && <p style={styles.errorMessage}>{errors.purpose_other}</p>}
                      </div>
                    )}

                    <div style={styles.formGroup}>
                      <label htmlFor="city" style={styles.formLabel}>City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{
                          ...styles.formInput,
                          ...(!isEditing ? styles.formInputDisabled : {}),
                          ...(errors.city ? styles.formInputError : {})
                        }}
                      />
                      {errors.city && <p style={styles.errorMessage}>{errors.city}</p>}
                    </div>

                    <div style={styles.formGroup}>
                      <label htmlFor="state_province" style={styles.formLabel}>State/Province</label>
                      <input
                        type="text"
                        id="state_province"
                        name="state_province"
                        value={formData.state_province}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{
                          ...styles.formInput,
                          ...(!isEditing ? styles.formInputDisabled : {}),
                          ...(errors.state_province ? styles.formInputError : {})
                        }}
                      />
                      {errors.state_province && <p style={styles.errorMessage}>{errors.state_province}</p>}
                    </div>

                    <div style={styles.formGroup}>
                      <label htmlFor="country" style={styles.formLabel}>Country</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{
                          ...styles.formInput,
                          ...(!isEditing ? styles.formInputDisabled : {}),
                          ...(errors.country ? styles.formInputError : {})
                        }}
                      />
                      {errors.country && <p style={styles.errorMessage}>{errors.country}</p>}
                    </div>
                  </div>

                  {errors.submit && <p style={{ ...styles.errorMessage, textAlign: 'center' }}>{errors.submit}</p>}
                </form>
              </div>
            )}

            {/* Purchase History Tab */}
            {activeTab === 'purchases' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Purchase History</h3>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Total: ${currentPurchases.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {currentPurchases.map((purchase) => (
                    <div key={purchase.id} style={styles.purchaseCard}>
                      <div style={styles.purchaseCardInner}>
                        <div style={styles.purchaseInfo}>
                          <div style={styles.purchaseIcon}>
                            {getProductTypeIcon(purchase.product_type)}
                          </div>
                          <div style={styles.purchaseDetails}>
                            <h4 style={styles.purchaseTitle}>{purchase.product_name}</h4>
                            <p style={styles.purchaseDescription}>{purchase.description}</p>
                            <div style={styles.purchaseMeta}>
                              <span style={styles.purchaseMetaItem}>
                                Order #{purchase.id}
                              </span>
                              <span style={styles.purchaseMetaItem}>
                                {new Date(purchase.purchase_date).toLocaleDateString()}
                              </span>
                              <span style={{ ...styles.statusBadge, ...getStatusColor(purchase.status) }}>
                                {purchase.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div style={styles.purchasePrice}>
                          <div style={styles.purchasePriceAmount}>
                            ${purchase.amount.toFixed(2)}
                          </div>
                          <div style={styles.purchasePriceCurrency}>{purchase.currency}</div>
                          {purchase.invoice_url && (
                            <button style={{ color: '#f97316', fontSize: '0.875rem', fontWeight: '500', marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                              Download Invoice
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>Your Achievements</h3>

                <div style={styles.achievementGrid}>
                  {currentUser.achievements.map((achievement, index) => (
                    <div key={index} style={styles.achievementCard}>
                      <div style={styles.achievementHeader}>
                        <div style={styles.achievementIcon}>
                          <svg style={{ width: '1.5rem', height: '1.5rem', color: '#d97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div>
                          <h4 style={styles.achievementTitle}>{achievement}</h4>
                          <p style={styles.achievementSubtitle}>Achievement unlocked</p>
                        </div>
                      </div>
                      <div style={styles.achievementDescription}>
                        <p style={styles.achievementDescriptionText}>
                          {achievement === 'First Flight' && 'Completed your first drone simulation flight'}
                          {achievement === 'Night Pilot' && 'Successfully completed 10 night flights'}
                          {achievement === 'Precision Landing' && 'Achieved 95% landing accuracy'}
                          {achievement === 'Weather Master' && 'Flew in all weather conditions'}
                          {achievement === '100 Hours' && 'Accumulated 100+ hours of flight time'}
                          {achievement === 'Welcome Aboard' && 'Welcome to DroneSimulator!'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile