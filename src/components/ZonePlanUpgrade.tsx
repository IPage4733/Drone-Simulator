import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';

interface ZonePlanUpgradeProps {
    isOpen: boolean;
    onClose: () => void;
}

const ZonePlanUpgrade: React.FC<ZonePlanUpgradeProps> = ({ isOpen, onClose }) => {
    const [zonePlanData, setZonePlanData] = useState<any>(null);
    const [selectedNewZones, setSelectedNewZones] = useState<{ [key: string]: boolean }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isUpgrading, setIsUpgrading] = useState(false);

    const BASE_PRICE = 34.99;

    useEffect(() => {
        if (isOpen) {
            fetchZonePlanData();
        }
    }, [isOpen]);

    const fetchZonePlanData = async () => {
        setIsLoading(true);
        setError('');

        try {
            const token = sessionStorage.getItem('auth_token');
            if (!token) {
                throw new Error('Please login to upgrade your plan');
            }

            const response = await fetch(`${API_ENDPOINTS.STRIPE_BASE}/my-zone-plan/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch zone plan details');
            }

            const data = await response.json();

            if (!data.has_zone_plan) {
                throw new Error('You do not have an active zone plan');
            }

            if (!data.is_upgradeable) {
                throw new Error('Your zone plan cannot be upgraded at this time');
            }

            setZonePlanData(data);
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching zone plan:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleZone = (zoneName: string) => {
        setSelectedNewZones(prev => ({
            ...prev,
            [zoneName]: !prev[zoneName]
        }));
    };

    const getSelectedNewZonesCount = () => {
        return Object.values(selectedNewZones).filter(Boolean).length;
    };

    const calculateUpgradePrice = () => {
        const zonesCount = getSelectedNewZonesCount();
        const totalPCs = zonePlanData?.total_pcs || 1;
        return zonesCount * totalPCs * BASE_PRICE;
    };

    const handleUpgrade = async () => {
        if (getSelectedNewZonesCount() === 0) {
            setError('Please select at least one zone to add');
            return;
        }

        setIsUpgrading(true);
        setError('');

        try {
            const token = sessionStorage.getItem('auth_token');
            const selectedZones = Object.entries(selectedNewZones)
                .filter(([_, selected]) => selected)
                .map(([zoneName, _]) => zoneName);

            const response = await fetch(`${API_ENDPOINTS.STRIPE_BASE}/upgrade-zone-plan/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    new_zones: selectedZones
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create upgrade checkout');
            }

            const data = await response.json();

            if (data.checkout_url) {
                // Redirect to Stripe checkout
                window.location.href = data.checkout_url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err: any) {
            setError(err.message);
            console.error('Upgrade error:', err);
        } finally {
            setIsUpgrading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
            <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800">Upgrade Zone Plan</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
                                <p className="text-gray-600">Loading your zone plan...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="p-6">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800">{error}</p>
                            </div>
                        </div>
                    ) : zonePlanData ? (
                        <div className="flex flex-col md:flex-row">
                            {/* Left Section - Zone Selection */}
                            <div className="flex-1 p-6 bg-gray-50">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">Add More Zones</h3>
                                            <p className="text-sm text-orange-600">PC Count: {zonePlanData.total_pcs} (locked)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Current Zones */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Current Zones</h4>
                                    <div className="space-y-2">
                                        {Object.entries(zonePlanData.purchased_zones || {}).map(([zoneName, expiryDate]: [string, any]) => (
                                            <div
                                                key={zoneName}
                                                className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-300 bg-gray-100 opacity-75"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-md bg-gray-400 flex items-center justify-center">
                                                        <CheckCircle size={16} className="text-white" />
                                                    </div>
                                                    <span className="font-medium text-gray-600">{zoneName}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    Expires: {new Date(expiryDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Available Zones */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Available Zones to Add</h4>
                                    <div className="space-y-2">
                                        {zonePlanData.available_zones?.map((zoneName: string) => (
                                            <div
                                                key={zoneName}
                                                onClick={() => toggleZone(zoneName)}
                                                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedNewZones[zoneName]
                                                        ? 'border-orange-500 bg-orange-50'
                                                        : 'border-gray-200 bg-white hover:border-orange-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${selectedNewZones[zoneName]
                                                            ? 'bg-orange-500 border-orange-500'
                                                            : 'border-gray-300'
                                                        }`}>
                                                        {selectedNewZones[zoneName] && (
                                                            <CheckCircle size={16} className="text-white" />
                                                        )}
                                                    </div>
                                                    <span className={`font-medium ${selectedNewZones[zoneName] ? 'text-gray-800' : 'text-gray-600'
                                                        }`}>
                                                        {zoneName}
                                                    </span>
                                                </div>
                                                {selectedNewZones[zoneName] && (
                                                    <span className="text-orange-600 font-semibold text-sm">
                                                        ${(zonePlanData.total_pcs * BASE_PRICE).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Section - Order Summary */}
                            <div className="w-full md:w-96 bg-white p-6 border-t md:border-t-0 md:border-l border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Upgrade Summary</h3>

                                {/* Selected Zones */}
                                <div className="space-y-3 mb-6">
                                    {Object.entries(selectedNewZones)
                                        .filter(([_, selected]) => selected)
                                        .map(([zoneName, _]) => (
                                            <div key={zoneName} className="pb-3 border-b border-gray-100">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-gray-800 font-medium text-sm">
                                                        {zoneName} × {zonePlanData.total_pcs} PC(s)
                                                    </span>
                                                    <span className="text-gray-800 font-semibold">
                                                        ${(zonePlanData.total_pcs * BASE_PRICE).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-orange-600">
                                                    1 year validity from upgrade date
                                                </div>
                                            </div>
                                        ))}

                                    {getSelectedNewZonesCount() === 0 && (
                                        <div className="text-center py-8 text-gray-400">
                                            <p className="text-sm">No zones selected</p>
                                            <p className="text-xs mt-1">Select zones to see pricing</p>
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="border-t-2 border-gray-200 pt-4 mb-6">
                                    <div className="mb-2">
                                        <span className="text-gray-700 font-semibold">Total Upgrade Cost</span>
                                        <p className="text-xs text-gray-500">Inclusive of all taxes</p>
                                    </div>
                                    <div className="text-3xl font-bold text-orange-600">
                                        ${calculateUpgradePrice().toFixed(2)}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {getSelectedNewZonesCount()} zone(s) × {zonePlanData.total_pcs} PC(s) × ${BASE_PRICE}
                                    </p>
                                </div>

                                {/* Upgrade Button */}
                                <button
                                    onClick={handleUpgrade}
                                    disabled={getSelectedNewZonesCount() === 0 || isUpgrading}
                                    className={`w-full py-4 rounded-xl font-bold text-white transition-all ${getSelectedNewZonesCount() === 0 || isUpgrading
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg'
                                        }`}
                                >
                                    {isUpgrading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        'Proceed to Checkout'
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    SSL Encrypted • Secure Checkout
                                </p>

                                {/* Info */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-xs text-blue-800">
                                        <strong>Note:</strong> New zones will have 1 year validity from the upgrade date.
                                        Your existing zones will keep their original expiration dates.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ZonePlanUpgrade;
