import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, User, Activity, Clock, BarChart3 } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import axios from 'axios';

export const MasterUserDetail: React.FC = () => {
  const { id: email } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, plans, annotations, updateUser, updateUserPlan, updateUserAddOns } = useData();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const userAnnotations = annotations.filter(a => a.userId === user?.id);


  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user || {});
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetailsRes = await axios.post('https://34-47-194-149.nip.io/api/get-single-user-details/', {
          email: email
        });

        if (userDetailsRes.data.status === 'success') {
          const userData = userDetailsRes.data.data;

const formatted = {
  id: userData.user_id,
  name: userData.full_name || userData.username || 'N/A',
  email: userData.email,
  status: userData.is_active ? 'Active' : 'Inactive',
  plan: userData.plan?.toLowerCase() || 'trial',
  planExpiry: userData.plan_expiry_date
    ? new Date(userData.plan_expiry_date).toLocaleDateString()
    : 'N/A',
  addOns: {}, // assuming you fetch these from somewhere else
  paidAmount: 0,
  paymentDate: null,
  nextPaymentDate: null,
  customPlan: null,
  usage: {
    simulationsThisMonth: userData.statistics.total_scenarios_completed || 0,
    totalSimulations: userData.statistics.total_app_sessions || 0
  },
  registrationDate: new Date(userData.created_at).toLocaleDateString(),
  lastLogin: userData.last_login_date
    ? new Date(userData.last_login_date).toLocaleString()
    : 'N/A',
  raw: userData
};

          setUser(formatted);
          setEditData(formatted);
        } else {
          console.error('Failed to fetch user detail');
        }
      } catch (error) {
        console.error('Error fetching user detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [email]);




  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

const handleSave = async () => {
  // Normalize values
  const is_active = editData.status === 'Active';
  const sanitizedPlan = editData.plan?.toLowerCase();
  const formatToIsoDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('.')[0]; // "2027-06-16T00:00:00"
};
const formattedExpiry = formatToIsoDate(editData.planExpiry);

  // Call local update functions if there are changes
  if (editData.plan !== user.plan) {
    updateUserPlan(user.id, sanitizedPlan, currentUser?.name || 'Master Admin');
  }

  if (JSON.stringify(editData.addOns) !== JSON.stringify(user.addOns)) {
    updateUserAddOns(user.id, editData.addOns, currentUser?.name || 'Master Admin');
  }

  try {
    await axios.put(
      `https://34-47-194-149.nip.io/api/update-user-details/`,
      {
        email: editData.email,
        full_name: editData.name,
        plan: sanitizedPlan,
        plan_expiry_date: formattedExpiry,
        is_active: is_active,
      },
      {
        headers: {
          Authorization: `Token ${sessionStorage.getItem("drone_auth_token")}`,
        },
      }
    );
  } catch (err) {
    console.error("Error updating user details:", err);
  }

  updateUser(user.id, editData, currentUser?.name || 'Master Admin');
  setIsEditing(false);
};




  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/dash/master/users')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-500 mt-1">Manage user information and subscription plan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              <span>{isEditing ? 'Save' : 'Edit'}</span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                <p className="text-gray-500">{user.email}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${user.status === 'Active' ? 'bg-green-100 text-green-800' :
                    user.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                  }`}>
                  {user.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={isEditing ? editData.name : user.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                    }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={isEditing ? editData.email : user.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                    }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={isEditing ? editData.status : user.status}
                  onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                    }`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                <input
                  type="text"
                  value={user.registrationDate}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">This Month</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{user.usage.simulationsThisMonth}</p>
                  <p className="text-xs text-blue-700">simulations</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-1">{user.usage.totalSimulations}</p>
                  <p className="text-xs text-green-700">simulations</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Last Active</span>
                  </div>
                  <p className="text-sm font-bold text-purple-900 mt-1">{user.lastLogin}</p>
                  <p className="text-xs text-purple-700">activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Management */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h2>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900">Current Plan: {user.plan}</h3>
                <p className="text-sm text-blue-700 mt-1">
                  ${plans.find(p => p.name === user.plan)?.price || 0}/month
                </p>
              </div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Expiry Date</label>
  {isEditing ? (
    <input
      type="date"
      value={editData.planExpiry?.split('T')[0]}
      onChange={(e) =>
        setEditData((prev) => ({
          ...prev,
          planExpiry: e.target.value
        }))
      }
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  ) : (
    <p className="text-sm text-gray-800">{user.planExpiry || 'N/A'}</p>
  )}
</div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Change Plan</label>
            <select
  value={isEditing ? editData.plan : user.plan}
  onChange={(e) => setEditData(prev => ({ ...prev, plan: e.target.value }))}
  disabled={!isEditing}
  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'}`}
>
  <option value="trial">Trial - $0/month</option>
  <option value="basic">Basic - $10/month</option>
  <option value="premium">Premium - $25/month</option>
</select>

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Add-ons</label>
                <div className="space-y-2">
                  {Object.entries(user.addOns).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isEditing ? editData.addOns?.[key] : value}
                        onChange={(e) => setEditData(prev => ({
                          ...prev,
                          addOns: { ...prev.addOns, [key]: e.target.checked }
                        }))}
                        disabled={!isEditing}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {key} Module
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Changes</h2>
            <div className="space-y-3">
              {userAnnotations.slice(0, 5).map((annotation) => (
                <div key={annotation.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{annotation.changeSummary}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    By {annotation.adminName} • {new Date(annotation.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {userAnnotations.length === 0 && (
                <p className="text-sm text-gray-500">No recent changes</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};