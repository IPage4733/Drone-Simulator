import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';

interface ZonePlanUpgradeProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ZoneLicense {
    id: number;
    license_key: string;
    license_key_masked: string;
    device_id: string;
    total_pcs: number;
    pc_number: number;
    expires_at: string;
    purchased_zones: { [key: string]: string };
    status: string;
    created_at: string;
}

const ZonePlanUpgrade: React.FC<ZonePlanUpgradeProps> = ({ isOpen, onClose }) => {
    const [zoneLicenses, setZoneLicenses] = useState<ZoneLicense[]>([]);
    const [selectedLicenseIds, setSelectedLicenseIds] = useState<{ [key: number]: boolean }>({});
    const [selectedNewZones, setSelectedNewZones] = useState<{ [key: string]: boolean }>({});
    const [availableZones, setAvailableZones] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isUpgrading, setIsUpgrading] = useState(false);

    const BASE_PRICE = 34.99;

    useEffect(() => {
        if (isOpen) {
            fetchZoneLicenses();
        }
    }, [isOpen]);

    // Clear selected zones when license selection changes
    useEffect(() => {
        setSelectedNewZones({});
    }, [selectedLicenseIds]);

    const fetchZoneLicenses = async () => {
        setIsLoading(true);
        setError('');

        try {
            const token = sessionStorage.getItem('auth_token');
            if (!token) {
                throw new Error('Please login to upgrade your plan');
            }

            // Fetch all zone licenses
            const licensesResponse = await fetch(`${API_ENDPOINTS.STRIPE_BASE}/my-zone-licenses/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (!licensesResponse.ok) {
                const errorData = await licensesResponse.json();
                throw new Error(errorData.message || 'Failed to fetch zone licenses');
            }

            const licensesData = await licensesResponse.json();

            if (!licensesData.zone_licenses || licensesData.zone_licenses.length === 0) {
                throw new Error('No zone licenses found');
            }

            // Filter out expired licenses
            const activeLicenses = licensesData.zone_licenses.filter((lic: ZoneLicense) => lic.status === 'active');

            if (activeLicenses.length === 0) {
                throw new Error('All your zone licenses have expired');
            }

            setZoneLicenses(activeLicenses);

            // Don't auto-select - let user choose which licenses to upgrade
            setSelectedLicenseIds({});

            // Fetch available zones (from my-zone-plan)
            const planResponse = await fetch(`${API_ENDPOINTS.STRIPE_BASE}/my-zone-plan/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (!planResponse.ok) {
                throw new Error('Failed to fetch zone plan details');
            }

            const planData = await planResponse.json();
            setAvailableZones(planData.available_zones || []);

        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching zone licenses:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLicense = (licenseId: number) => {
        setSelectedLicenseIds(prev => ({
            ...prev,
            [licenseId]: !prev[licenseId]
        }));
    };

    const toggleZone = (zoneName: string) => {
        setSelectedNewZones(prev => ({
            ...prev,
            [zoneName]: !prev[zoneName]
        }));
    };

    const getSelectedLicensesCount = () => {
        return Object.values(selectedLicenseIds).filter(Boolean).length;
    };

    const getAvailableZonesForSelected = () => {
        // If no licenses selected, return empty
        if (getSelectedLicensesCount() === 0) {
            return [];
        }

        // Get all possible zones from ALL licenses (union of all zones across all licenses)
        const allPossibleZones = new Set<string>();
        zoneLicenses.forEach(license => {
            if (license.purchased_zones) {
                Object.keys(license.purchased_zones).forEach(zone => {
                    allPossibleZones.add(zone);
                });
            }
        });
        // Also add zones from the global availableZones list
        availableZones.forEach(zone => allPossibleZones.add(zone));

        // Get zones that the SELECTED licenses already have
        const selectedLicenses = zoneLicenses.filter(lic => selectedLicenseIds[lic.id]);
        const zonesInSelectedLicenses = new Set<string>();

        selectedLicenses.forEach(license => {
            if (license.purchased_zones) {
                Object.keys(license.purchased_zones).forEach(zone => {
                    zonesInSelectedLicenses.add(zone);
                });
            }
        });

        // Return zones that are NOT in the selected licenses
        return Array.from(allPossibleZones).filter(zone => !zonesInSelectedLicenses.has(zone)).sort();
    };


    const getSelectedNewZonesCount = () => {
        return Object.values(selectedNewZones).filter(Boolean).length;
    };

    const calculateUpgradePrice = () => {
        const zonesCount = getSelectedNewZonesCount();
        let total = 0;

        // Each selected license is charged as 1 PC
        // (even if total_pcs shows the original purchase quantity, 
        // each license key represents 1 PC when upgrading)
        const selectedCount = getSelectedLicensesCount();
        total = zonesCount * selectedCount * BASE_PRICE;

        return total;
    };

    const getSelectedLicenses = () => {
        return zoneLicenses.filter(lic => selectedLicenseIds[lic.id]);
    };

    const handleUpgrade = async () => {
        if (getSelectedNewZonesCount() === 0) {
            setError('Please select at least one zone to add');
            return;
        }

        if (getSelectedLicensesCount() === 0) {
            setError('Please select at least one license to upgrade');
            return;
        }

        setIsUpgrading(true);
        setError('');

        try {
            const token = sessionStorage.getItem('auth_token');
            const selectedZones = Object.entries(selectedNewZones)
                .filter(([_, selected]) => selected)
                .map(([zoneName, _]) => zoneName);

            const selectedLicenses = Object.entries(selectedLicenseIds)
                .filter(([_, selected]) => selected)
                .map(([licenseId, _]) => parseInt(licenseId));

            const response = await fetch(`${API_ENDPOINTS.STRIPE_BASE}/upgrade-zone-plan/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    new_zones: selectedZones,
                    selected_license_ids: selectedLicenses
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
            <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
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
                                <p className="text-gray-600">Loading your zone licenses...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="p-6">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800">{error}</p>
                            </div>
                        </div>
                    ) : zoneLicenses.length > 0 ? (
                        <div className="flex flex-col lg:flex-row">
                            {/* Left Section - License & Zone Selection */}
                            <div className="flex-1 p-6 bg-gray-50 space-y-6">
                                {/* License Selection */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Select License Keys to Upgrade</h3>
                                    <div className="space-y-3">
                                        {zoneLicenses.map((license) => (
                                            <div
                                                key={license.id}
                                                onClick={() => toggleLicense(license.id)}
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedLicenseIds[license.id]
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 bg-white hover:border-orange-300'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mt-1 ${selectedLicenseIds[license.id]
                                                            ? 'bg-orange-500 border-orange-500'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            {selectedLicenseIds[license.id] && (
                                                                <CheckCircle size={16} className="text-white" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-gray-800 mb-1">
                                                                License {license.license_key_masked}
                                                            </div>
                                                            <div className="text-sm text-gray-600 space-y-1">
                                                                <div>
                                                                    PC: <span className="font-medium text-orange-600">
                                                                        #{license.pc_number || 1} of {license.total_pcs || 1}
                                                                    </span>

                                                                </div>
                                                                <div> Device ID :
                                                                    <span className="font-medium text-orange-600 pl-2">
                                                                        {license.device_id}
                                                                    </span>
                                                                </div>

                                                                {/* Zone expiry breakdown */}
                                                                {typeof license.purchased_zones === 'object' && Object.keys(license.purchased_zones).length > 0 ? (
                                                                    <div className="mt-2">
                                                                        <div className="text-xs font-semibold text-gray-700 mb-1">Zones & Expiry:</div>
                                                                        <div className="space-y-0.5">
                                                                            {Object.entries(license.purchased_zones)
                                                                                .sort((a, b) => new Date(b[1] as string).getTime() - new Date(a[1] as string).getTime())
                                                                                .map(([zoneName, expiryDate]) => (
                                                                                    <div key={zoneName} className="text-xs flex justify-between">
                                                                                        <span className="text-gray-600">{zoneName}</span>
                                                                                        <span className="text-gray-500">
                                                                                            {new Date(expiryDate as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                                        </span>
                                                                                    </div>
                                                                                ))}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 mt-1 pt-1 border-t border-gray-200">
                                                                            Latest expiry: {new Date(license.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div>Zones: {Object.keys(license.purchased_zones).join(', ')}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Zone Selection */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Select Zones to Add</h3>
                                    {getSelectedLicensesCount() === 0 ? (
                                        <div className="text-center py-8 text-gray-400">
                                            <p className="text-sm">Please select at least one license first</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {getAvailableZonesForSelected().map((zoneName: string) => (
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
                                                </div>
                                            ))}
                                            {getAvailableZonesForSelected().length === 0 && (
                                                <div className="text-center py-8 text-gray-400">
                                                    <p className="text-sm">All zones are already in the selected license(s)</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Section - Order Summary */}
                            <div className="w-full lg:w-96 bg-white p-6 border-t lg:border-t-0 lg:border-l border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Upgrade Summary</h3>

                                {/* Per-License Breakdown */}
                                <div className="space-y-4 mb-6">
                                    {getSelectedLicenses().map((license) => {
                                        const zonesCount = getSelectedNewZonesCount();
                                        if (zonesCount === 0) return null;

                                        return (
                                            <div key={license.id} className="pb-4 border-b border-gray-200">
                                                <div className="text-sm font-semibold text-gray-700 mb-2">
                                                    License {license.license_key_masked}
                                                </div>
                                                {Object.entries(selectedNewZones)
                                                    .filter(([_, selected]) => selected)
                                                    .map(([zoneName, _]) => (
                                                        <div key={zoneName} className="flex justify-between text-sm text-gray-600 mb-1">
                                                            <span>{zoneName} × 1 PC</span>
                                                            <span className="font-medium">${BASE_PRICE.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-sm font-semibold text-gray-800">
                                                    <span>Subtotal</span>
                                                    <span>${(zonesCount * BASE_PRICE).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        );
                                    })}

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
                                        {getSelectedNewZonesCount()} zone(s) × {getSelectedLicensesCount()} license(s)
                                    </p>
                                </div>

                                {/* Upgrade Button */}
                                <button
                                    onClick={handleUpgrade}
                                    disabled={getSelectedNewZonesCount() === 0 || getSelectedLicensesCount() === 0 || isUpgrading}
                                    className={`w-full py-4 rounded-xl font-bold text-white transition-all ${getSelectedNewZonesCount() === 0 || getSelectedLicensesCount() === 0 || isUpgrading
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
                                        <strong>Note:</strong> New zones will be added to each selected license with 1 year validity from the upgrade date.
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
