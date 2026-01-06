import { API_ENDPOINTS } from '@/config/api'
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, User, Activity, Clock, BarChart3 } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import axios from 'axios';

// Helper function to format date to dd-mm-yyyy
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper function to format zone/location names to proper title case
const formatZoneName = (zoneName: string | null | undefined): string => {
  if (!zoneName) return '';

  const zoneMap: Record<string, string> = {
    'rpto_ground': 'RPTO Ground',
    'agriculture_zone': 'Agriculture Zone',
    'defence_zone': 'Defence Zone',
    'hv_line_solar_panel': 'HV Line Solar Panel',
    'factory': 'Factory',
    'bridge_and_road': 'Bridge and Road',
    'city': 'City',
    // Short names from database
    'defence': 'Defence Zone',
    'agriculture': 'Agriculture Zone',
    'hv_lines_solar_panel': 'HV Line Solar Panel',
    'rail_road_canal_bridge': 'Bridge and Road',
    'rpto': 'RPTO Ground'
  };

  // Normalize the input (lowercase and replace spaces with underscores)
  const normalized = zoneName.toLowerCase().replace(/\s+/g, '_');
  return zoneMap[normalized] || zoneName;
};

// Helper function to format drone names to proper title case
const formatDroneName = (droneName: string | null | undefined): string => {
  if (!droneName) return '';

  const droneMap: Record<string, string> = {
    'agriculture_drone': 'Agriculture Drone',
    'dji_matrice_350_400_rtk': 'DJI - Matrice 350/400 RTK',
    'dji_-_matrice_350/400_rtk': 'DJI - Matrice 350/400 RTK',
    'racing_kamikaze_drone': 'Racing / Kamikaze Drone',
    'racing_/_kamikaze_drone': 'Racing / Kamikaze Drone',
    'fighter_vtol_drone': 'Fighter - VTOL Drone',
    'fighter_-_vtol_drone': 'Fighter - VTOL Drone',
    'crystal_ball_model_v_drone': 'Crystal Ball - Model V Drone',
    'crystal_ball_-_model_v_drone': 'Crystal Ball - Model V Drone',
    'dji_mavic_drone': 'DJI Mavic Drone'
  };

  // Normalize the input (lowercase and replace spaces with underscores)
  const normalized = droneName.toLowerCase().replace(/\s+/g, '_');
  return droneMap[normalized] || droneName;
};

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

  const fetchUserDetails = async () => {
    try {
      const userDetailsRes = await axios.post(API_ENDPOINTS.GET_SINGLE_USER, {
        email: email
      });

      if (userDetailsRes.data.status === 'success') {
        const userData = userDetailsRes.data.data;
        const transaction = userData.transaction;

        // Get actual plan type from license_info or fallback to user.plan
        const actualPlanType = userData.license_info?.plan_type || userData.plan;

        // Map plan names for display
        const planDisplay = (() => {
          if (actualPlanType) {
            switch (actualPlanType.toLowerCase()) {
              case 'free': return 'Free';
              case 'zone': return 'Zone';
              case 'pro': return 'Pro';
              case 'enterprise': return 'Enterprise';
              case 'trial': return 'Demo';
              case 'basic': return 'Free';
              case 'premium': return 'Pro';
              default: return actualPlanType.charAt(0).toUpperCase() + actualPlanType.slice(1);
            }
          }
          return 'Free';
        })();

        const formatted = {
          id: userData.user_id,
          name: userData.full_name || userData.username || 'N/A',
          email: userData.email,
          address: userData.address || '',
          city: userData.city || '',
          stateProvince: userData.state_province || '',
          country: userData.country || '',
          phoneNumber: userData.phone_number || '',
          status: userData.is_active ? 'Active' : 'Inactive',
          plan: planDisplay,
          planExpiry: userData.plan_expiry_date
            ? formatDate(userData.plan_expiry_date)
            : 'N/A',
          rawPlanExpiry: userData.plan_expiry_date || null, // Store raw ISO date for editing
          addOns: {},
          paidAmount: userData.total_paid ? parseFloat(userData.total_paid) : 0,
          paymentDate: transaction?.payment_date || null,
          nextPaymentDate: transaction?.plan_expiry_date || userData.plan_expiry_date || null,
          customPlan: null,
          usage: {
            simulationsThisMonth: userData.statistics.total_scenarios_completed || 0,
            totalSimulations: userData.statistics.total_app_sessions || 0,
            totalDuration: userData.statistics.total_duration_formatted || '00:00:00'
          },
          registrationDate: formatDate(userData.created_at),
          lastLogin: userData.last_login_date
            ? formatDate(userData.last_login_date)
            : 'N/A',
          scenarios: userData.all_scenarios?.scenarios || [],
          transactionHistory: userData.transaction_history || [],
          licenseKeys: userData.license_keys || [],  // Add license keys array
          zoneExpiries: {}, // Track zone-specific expiry date changes
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

  useEffect(() => {
    fetchUserDetails();
  }, [email]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }
  const groupScenarioSummary = (scenarios: any[]) => {
    const grouped: Record<string, { count: number; totalSeconds: number }> = {};

    scenarios.forEach(({ scenario_name, drone_name, location_name, duration_formatted }) => {
      const key = `${scenario_name}|||${drone_name}|||${location_name}`;

      // Convert duration to seconds safely
      let seconds = 0;
      if (typeof duration_formatted === 'string' && duration_formatted.includes(':')) {
        const parts = duration_formatted.split(':').map(Number);
        if (parts.length === 3) {
          const [hrs, mins, secs] = parts;
          seconds = (hrs || 0) * 3600 + (mins || 0) * 60 + (secs || 0);
        }
      }

      if (!grouped[key]) {
        grouped[key] = { count: 1, totalSeconds: seconds };
      } else {
        grouped[key].count += 1;
        grouped[key].totalSeconds += seconds;
      }
    });

    const result = Object.entries(grouped).map(([key, value]) => {
      const [Scenario, Drone, Location] = key.split('|||');
      const hrs = Math.floor(value.totalSeconds / 3600);
      const mins = Math.floor((value.totalSeconds % 3600) / 60);
      const secs = value.totalSeconds % 60;

      return {
        Scenario: formatZoneName(Scenario),
        Drone: formatDroneName(Drone),
        Location: formatZoneName(Location),
        Count: value.count,
        Total_Duration: `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
          .toString()
          .padStart(2, '0')}`,
      };
    });

    return result;
  };

  const sumDurations = (durations: (string | null | undefined)[]) => {
    let totalSeconds = 0;

    durations.forEach((duration) => {
      if (typeof duration === 'string' && duration.includes(':')) {
        const [hours, minutes, seconds] = duration.split(':').map(Number);
        totalSeconds += (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
  const overallDuration = sumDurations(
    groupScenarioSummary(user.scenarios || []).map((item) => item.Total_Duration)
  );

  const handleSave = async () => {
    // Normalize values
    const is_active = editData.status === 'Active';
    const sanitizedPlan = editData.plan?.toLowerCase();
    const formatToIsoDate = (dateString: string) => {
      // Handle empty, null, undefined, or "N/A" values
      if (!dateString || dateString === 'N/A') {
        return null;
      }

      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateString);
        return null;
      }

      return date.toISOString().split('.')[0]; // "2027-06-16T00:00:00"
    };
    const formattedExpiry = formatToIsoDate(editData.rawPlanExpiry || editData.planExpiry);

    // Call local update functions if there are changes
    if (editData.plan !== user.plan) {
      updateUserPlan(user.id, sanitizedPlan, currentUser?.name || 'Master Admin');
    }

    if (JSON.stringify(editData.addOns) !== JSON.stringify(user.addOns)) {
      updateUserAddOns(user.id, editData.addOns, currentUser?.name || 'Master Admin');
    }


    try {
      const payload: any = {
        email: editData.email,
        full_name: editData.name,
        address: editData.address,
        plan: sanitizedPlan,
        is_active: is_active,
      };

      // Only include plan_expiry_date if it's valid
      if (formattedExpiry) {
        payload.plan_expiry_date = formattedExpiry;
      }

      // Include zone expiry changes if they exist
      console.log('editData.zoneExpiries:', editData.zoneExpiries);
      if (editData.zoneExpiries && Object.keys(editData.zoneExpiries).length > 0) {
        // Format zone expiries to ISO format
        const formattedZoneExpiries: Record<string, string> = {};
        for (const [zone, dateStr] of Object.entries(editData.zoneExpiries)) {
          const formatted = formatToIsoDate(dateStr as string);
          if (formatted) {
            formattedZoneExpiries[zone] = formatted;
          }
        }

        if (Object.keys(formattedZoneExpiries).length > 0) {
          payload.zone_expiries = formattedZoneExpiries;
          console.log('Adding zone_expiries to payload:', payload.zone_expiries);
        }
      }


      console.log('Full payload being sent:', payload);

      await axios.put(
        API_ENDPOINTS.UPDATE_USER,
        payload,
        {
          headers: {
            Authorization: `Token ${sessionStorage.getItem("drone_auth_token")}`,
          },
        }
      );

      console.log('Update successful');

      // Refetch user details to immediately update UI
      await fetchUserDetails();

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
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-orange-500 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-black">User Information</h2>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              <span className="text-xs">{isEditing ? 'Save' : 'Edit'}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black">{user.name}</h3>
                <p className="text-xs text-gray-600">{user.email}</p>
                <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full mt-1 ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-black mb-0.5">Full Name</label>
                <input
                  type="text"
                  value={isEditing ? editData.name : user.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className={`w-full px-3 py-1.5 border border-gray-300 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-orange-500' : 'bg-gray-50'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-0.5">Email</label>
                <input
                  type="email"
                  value={isEditing ? editData.email : user.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className={`w-full px-3 py-1.5 border border-gray-300 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-orange-500' : 'bg-gray-50'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-0.5">Status</label>
                <select
                  value={isEditing ? editData.status : user.status}
                  onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                  disabled={!isEditing}
                  className={`w-full px-3 py-1.5 border border-gray-300 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-orange-500' : 'bg-gray-50'}`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-0.5">Registration Date</label>
                <input
                  type="text"
                  value={user.registrationDate}
                  disabled
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-0.5">Address</label>
                <input
                  type="text"
                  value={isEditing ? editData.address : user.address}
                  onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!isEditing}
                  className={`w-full px-3 py-1.5 border border-gray-300 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-orange-500' : 'bg-gray-50'}`}
                  placeholder="Street address"
                />
              </div>
            </div>

            <div className="border-t border-orange-500 pt-3">
              <h3 className="text-sm font-medium text-black mb-3">Usage Statistics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-lg border border-orange-500">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-medium text-black">This Month</span>
                  </div>
                  <div className="text-[20px] text-gray-900"> Count : {user.usage.simulationsThisMonth}</div>

                </div>
                <div className="bg-white p-3 rounded-lg border border-orange-500">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-medium text-black">Total</span>
                  </div>
                  <p className="text-xl font-bold text-black mt-1">{user.usage.totalDuration}</p>
                  <p className="text-xs text-gray-600">{user.usage.totalSimulations} simulations</p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-orange-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-medium text-black">Last Active</span>
                  </div>
                  <p className="text-xs font-bold text-black mt-1">{user.lastLogin}</p>
                  <p className="text-xs text-gray-600">activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
      {/* ✅ Drone Flight Summary section */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Drone Flight Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from(
            new Set(groupScenarioSummary(user.scenarios || []).map((x) => x.Location))
          ).map((location, idx) => {
            const data = groupScenarioSummary(user.scenarios || []).filter(
              (item) => item.Location === location
            );

            return (
              <div
                key={idx}
                className="bg-white rounded-md shadow-sm border border-orange-500 p-3 hover:shadow-md transition duration-300"
              >
                <h4 className="text-md font-bold text-orange-600 mb-4 flex justify-between">
                  <span>{location}</span>
                  <span> (Total: {sumDurations(data.map(item => item.Total_Duration))})</span>
                </h4>

                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-orange-50 text-orange-700">
                      <th className="px-2 py-1 text-left font-semibold">Drone</th>
                      <th className="px-2 py-1 text-left font-semibold">Scenario</th>
                      <th className="px-2 py-1 text-left font-semibold">Count</th>
                      <th className="px-2 py-1 text-left font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, i) => (
                      <tr key={i} className="border-t hover:bg-orange-50 transition duration-200">
                        <td className="px-2 py-1 text-gray-800">{item.Drone}</td>
                        <td className="px-2 py-1 text-gray-800 capitalize">{item.Scenario}</td>
                        <td className="px-2 py-1 text-gray-800">{item.Count}</td>
                        <td className="px-2 py-1 text-gray-800">{item.Total_Duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscription Plan - moved below Drone Flight Summary */}
      <div className="mt-10">
        <div className="bg-white rounded-xl shadow-lg border border-orange-500 p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Subscription Plan</h2>
          <div className="space-y-4">
            {/* Plan Information Card - Combined */}
            <div className="p-4 bg-white border border-orange-500 rounded-lg">
              <div className={`grid grid-cols-1 ${user.raw?.license_info?.plan_type === 'zone' ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Current Plan</h3>
                  <p className="font-semibold text-black text-lg">{user.plan}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {user.raw?.license_info?.plan_type === 'zone' ? 'Zone-based Plan' : `$${plans.find(p => p.name === user.plan)?.price || 0}/month`}
                  </p>
                </div>

                {/* Only show Plan Expiry Date for non-zone plans */}
                {user.raw?.license_info?.plan_type !== 'zone' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Plan Expiry Date</h3>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.rawPlanExpiry ? new Date(editData.rawPlanExpiry).toISOString().split('T')[0] : ''}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            rawPlanExpiry: e.target.value,
                            planExpiry: e.target.value // Keep both in sync
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="font-semibold text-black text-lg">{user.planExpiry || 'N/A'}</p>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Payment Information */}
            {user.raw?.transaction && (
              <>
                <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Total Amount Paid</p>
                      <p className="font-bold text-green-700 text-lg">
                        ${parseFloat(user.raw.total_paid).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Latest Payment</p>
                      <p className="font-semibold text-green-700">
                        ${parseFloat(user.raw.transaction.amount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Date</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(user.raw.transaction.payment_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Status</p>
                      <p className="font-semibold text-green-700 capitalize">
                        {user.raw.transaction.payment_status}
                      </p>
                    </div>
                    {user.transactionHistory && user.transactionHistory.length > 1 && (
                      <div className="col-span-2">
                        <p className="text-gray-600 mb-1">Total Transactions</p>
                        <p className="font-semibold text-gray-900">
                          {user.transactionHistory.length} payment(s)
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Plan Expires</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(user.raw.transaction.plan_expiry_date)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transaction History and Zone Plan Details - Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Transaction History Table */}
                  {user.transactionHistory && user.transactionHistory.length > 1 && (
                    <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-3">Transaction History</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Amount</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Plan</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {user.transactionHistory.map((txn: any, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-100">
                                <td className="px-3 py-2 text-gray-900">
                                  {formatDate(txn.payment_date)}
                                </td>
                                <td className="px-3 py-2 font-semibold text-green-700">
                                  ${parseFloat(txn.amount).toFixed(2)}
                                </td>
                                <td className="px-3 py-2 text-gray-900 capitalize">
                                  {txn.plan_name}
                                  {txn.selected_zones && ` (${txn.selected_zones.length} zone${txn.selected_zones.length > 1 ? 's' : ''})`}
                                </td>
                                <td className="px-3 py-2">
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs capitalize">
                                    {txn.payment_status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Zone Plan Details */}
                  {user.raw?.license_info?.plan_type === 'zone' && user.raw.license_info.selected_zones && (
                    <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
                      <h3 className="font-medium text-blue-800 mb-2">Zone Plan Details</h3>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">Total PCs: <span className="font-semibold text-gray-900">{user.raw.license_info.total_pcs}</span></p>
                        <p className="text-sm text-gray-600">Overall Plan Expires: <span className="font-semibold text-gray-900">{formatDate(user.raw.license_info.expires_at)}</span></p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Selected Zones {isEditing && <span className="text-xs text-gray-500">(Edit expiry dates)</span>}:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {Object.entries(user.raw.license_info.selected_zones).map(([zone, expiry]) => (
                            <div key={zone} className="bg-white p-3 rounded border border-blue-200">
                              <div className="flex justify-between items-start">
                                <span className="text-sm font-medium text-gray-900 flex-1">
                                  {formatZoneName(zone)}
                                </span>
                                <div className="flex-1 ml-4">
                                  {isEditing ? (
                                    <input
                                      type="date"
                                      value={
                                        editData.zoneExpiries?.[zone] ||
                                        new Date(expiry as string).toISOString().split('T')[0]
                                      }
                                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                      onChange={(e) => {
                                        // Store zone expiry changes in editData
                                        console.log(`Zone ${zone} expiry changed to:`, e.target.value);
                                        const zoneExpiries = { ...(editData.zoneExpiries || {}) };
                                        zoneExpiries[zone] = e.target.value;
                                        console.log('Updated zoneExpiries object:', zoneExpiries);
                                        setEditData(prev => ({ ...prev, zoneExpiries }));
                                      }}
                                    />
                                  ) : (
                                    <span className="text-xs text-gray-600">
                                      Expires: {formatDate(expiry as string)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {isEditing && (
                          <p className="text-xs text-gray-500 mt-2">
                            💡 Tip: You can set different expiry dates for each zone
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <div>

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
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-black capitalize">
                      {key} Module
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* License Keys Section */}
      <div className="mt-10">
        <div className="bg-white rounded-xl shadow-lg border border-orange-500 p-6">
          <h2 className="text-lg font-semibold text-black mb-4">License Keys</h2>

          {user.licenseKeys && user.licenseKeys.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700">License Key</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700">Plan Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700">Expires</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700">Device ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {user.licenseKeys.map((license: any, idx: number) => {
                    const isExpired = license.expires_at && new Date(license.expires_at) < new Date();
                    const statusColors = {
                      activated: 'bg-green-100 text-green-800',
                      generated: 'bg-blue-100 text-blue-800',
                      expired: 'bg-red-100 text-red-800',
                      revoked: 'bg-gray-100 text-gray-800'
                    };

                    return (
                      <React.Fragment key={idx}>
                        <tr className="hover:bg-orange-50">
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {license.key}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="capitalize font-medium text-gray-900">
                              {license.plan_type}
                            </span>
                            {license.plan_type === 'zone' && license.pc_number && (
                              <span className="ml-2 text-xs text-gray-500">
                                (PC {license.pc_number}/{license.total_pcs})
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[license.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                              }`}>
                              {license.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {license.expires_at ? (
                              <span className={isExpired ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                                {formatDate(license.expires_at)}
                                {isExpired && <span className="ml-1">⚠️</span>}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {license.device_id ? (
                              <span className="font-mono text-xs text-gray-700">{license.device_id}</span>
                            ) : (
                              <span className="text-gray-400">Not activated</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {formatDate(license.created_at)}
                          </td>
                        </tr>

                        {/* Zone details row for zone plans */}
                        {license.plan_type === 'zone' && license.selected_zones && (
                          <tr className="bg-blue-50">
                            <td colSpan={6} className="px-4 py-2">
                              <div className="flex items-start">
                                <span className="text-xs font-medium text-blue-800 mr-2">Zones:</span>
                                <div className="flex flex-wrap gap-2">
                                  {typeof license.selected_zones === 'object' && !Array.isArray(license.selected_zones) ? (
                                    // Zone plan with expiry dates (new format)
                                    Object.entries(license.selected_zones).map(([zone, expiry]: [string, any]) => {
                                      const zoneExpired = new Date(expiry) < new Date();
                                      return (
                                        <span
                                          key={zone}
                                          className={`text-xs px-2 py-1 rounded ${zoneExpired ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                            }`}
                                        >
                                          {formatZoneName(zone)}
                                          <span className="ml-1 text-xs opacity-75">
                                            (exp: {formatDate(expiry)})
                                          </span>
                                          {zoneExpired && ' ⚠️'}
                                        </span>
                                      );
                                    })
                                  ) : Array.isArray(license.selected_zones) ? (
                                    // Old format - array of zones
                                    license.selected_zones.map((zone: string) => (
                                      <span key={zone} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {formatZoneName(zone)}
                                      </span>
                                    ))
                                  ) : null}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No license keys found for this user.</p>
            </div>
          )}
        </div>
      </div>

    </div>

  );
};
