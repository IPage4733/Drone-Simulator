import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';
import { Eye, X, Check, Clock, AlertCircle } from 'lucide-react';
import { Dialog } from '@headlessui/react';

// TypeScript Interfaces
interface SupportTicket {
    id: number;
    email: string;
    department: string;
    subject: string;
    message: string;
    admin_reply: string | null;
    status: 'pending' | 'in_progress' | 'resolved' | 'closed';
    is_resolved: boolean;
    created_at: string;
    updated_at: string;
}

interface FilterState {
    status: string;
    department: string;
    is_resolved: string; // 'all', 'true', 'false'
}

interface ApiResponse {
    status: string;
    message: string;
    count: number;
    data: SupportTicket[];
}

export const AdminSupport: React.FC = () => {
    // State Management
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adminReply, setAdminReply] = useState('');
    const [ticketStatus, setTicketStatus] = useState<string>('');
    const [isResolved, setIsResolved] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Filter States
    const [filters, setFilters] = useState<FilterState>({
        status: 'all',
        department: 'all',
        is_resolved: 'all'
    });

    // Show notification toast
    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    // Fetch Tickets with Filters
    const fetchTickets = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('drone_auth_token');

            if (!token) {
                showNotification('error', 'Authentication required. Please login.');
                return;
            }

            const params = new URLSearchParams();
            if (filters.status !== 'all') params.append('status', filters.status);
            if (filters.department !== 'all') params.append('department', filters.department);
            if (filters.is_resolved !== 'all') params.append('is_resolved', filters.is_resolved);

            const url = `${API_ENDPOINTS.SUPPORT_ADMIN_ALL}${params.toString() ? '?' + params.toString() : ''}`;

            const response = await axios.get<ApiResponse>(url, {
                headers: { Authorization: `Token ${token}` }
            });

            setTickets(response.data.data || []);
        } catch (error: any) {
            console.error('Error fetching support tickets:', error);
            if (error.response?.status === 401) {
                showNotification('error', 'Unauthorized. Please login again.');
            } else {
                showNotification('error', 'Failed to fetch support tickets.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Update Support Ticket
    const updateTicket = async () => {
        if (!selectedTicket) return;

        try {
            setUpdating(true);
            const token = localStorage.getItem('drone_auth_token');

            if (!token) {
                showNotification('error', 'Authentication required.');
                return;
            }

            const updateData: any = { ticket_id: selectedTicket.id };

            if (adminReply.trim()) updateData.admin_reply = adminReply.trim();
            if (ticketStatus) updateData.status = ticketStatus;
            updateData.is_resolved = isResolved;

            const response = await axios.post(API_ENDPOINTS.SUPPORT_ADMIN_UPDATE, updateData, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status === 'success') {
                showNotification('success', 'Ticket updated successfully!');
                setIsModalOpen(false);
                fetchTickets(); // Refresh the list
                resetModalState();
            }
        } catch (error: any) {
            console.error('Error updating ticket:', error);
            if (error.response?.status === 404) {
                showNotification('error', 'Ticket not found.');
            } else if (error.response?.status === 401) {
                showNotification('error', 'Unauthorized. Please login again.');
            } else {
                showNotification('error', 'Failed to update ticket. Please try again.');
            }
        } finally {
            setUpdating(false);
        }
    };

    // Open ticket detail modal
    const openTicketModal = (ticket: SupportTicket) => {
        setSelectedTicket(ticket);
        setAdminReply(ticket.admin_reply || '');
        setTicketStatus(ticket.status);
        setIsResolved(ticket.is_resolved);
        setIsModalOpen(true);
    };

    // Reset modal state
    const resetModalState = () => {
        setSelectedTicket(null);
        setAdminReply('');
        setTicketStatus('');
        setIsResolved(false);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        resetModalState();
    };

    // Get unique departments from tickets
    const uniqueDepartments = Array.from(new Set(tickets.map(t => t.department))).sort();

    // Statistics
    const stats = {
        total: tickets.length,
        pending: tickets.filter(t => t.status === 'pending').length,
        in_progress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.is_resolved).length
    };

    // Status Badge Component
    const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
            resolved: 'bg-green-100 text-green-800 border-green-300',
            closed: 'bg-gray-100 text-gray-800 border-gray-300'
        };

        const icons = {
            pending: <Clock className="w-3 h-3 mr-1" />,
            in_progress: <AlertCircle className="w-3 h-3 mr-1" />,
            resolved: <Check className="w-3 h-3 mr-1" />,
            closed: <X className="w-3 h-3 mr-1" />
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
                {icons[status as keyof typeof icons]}
                {status.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    // Effect: Fetch tickets on mount and filter change
    useEffect(() => {
        fetchTickets();
    }, [filters]);

    // Clear all filters
    const clearFilters = () => {
        setFilters({ status: 'all', department: 'all', is_resolved: 'all' });
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading support tickets...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    <div className="flex items-center gap-2">
                        {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-medium">{notification.message}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Support Ticket Management</h1>
            </div>

            {/* Dashboard Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-full">
                            <Eye className="w-6 h-6 text-gray-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">In Progress</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.in_progress}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <AlertCircle className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Resolved</p>
                            <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <Check className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Status:</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    {/* Department Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Department:</label>
                        <select
                            value={filters.department}
                            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Departments</option>
                            {uniqueDepartments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {/* Resolved Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Resolution:</label>
                        <select
                            value={filters.is_resolved}
                            onChange={(e) => setFilters({ ...filters, is_resolved: e.target.value })}
                            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All</option>
                            <option value="false">Unresolved Only</option>
                            <option value="true">Resolved Only</option>
                        </select>
                    </div>

                    {/* Clear Filters */}
                    <button
                        onClick={clearFilters}
                        className="ml-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1.5 rounded-md text-sm font-medium"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {tickets.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p className="text-lg font-medium">No tickets found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or check back later.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subject
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{ticket.id}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                            {ticket.email}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                            {ticket.department}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                                            {ticket.subject}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <StatusBadge status={ticket.status} />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(ticket.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => openTicketModal(ticket)}
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Ticket Detail Modal */}
            <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl">
                        {selectedTicket && (
                            <>
                                {/* Modal Header */}
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <Dialog.Title className="text-xl font-semibold text-gray-900">
                                            Ticket #{selectedTicket.id} - {selectedTicket.subject}
                                        </Dialog.Title>
                                        <button
                                            onClick={closeModal}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto space-y-4">
                                    {/* Ticket Information */}
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">User Email</p>
                                                <p className="text-sm text-gray-900 flex items-center gap-2">
                                                    {selectedTicket.email}
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(selectedTicket.email);
                                                            showNotification('success', 'Email copied to clipboard');
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 text-xs"
                                                    >
                                                        Copy
                                                    </button>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Department</p>
                                                <p className="text-sm text-gray-900">{selectedTicket.department}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Submitted On</p>
                                                <p className="text-sm text-gray-900">
                                                    {new Date(selectedTicket.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Last Updated</p>
                                                <p className="text-sm text-gray-900">
                                                    {new Date(selectedTicket.updated_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Current Status</p>
                                            <StatusBadge status={selectedTicket.status} />
                                        </div>
                                    </div>

                                    {/* User Message */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-semibold text-gray-900">User Message</h3>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(selectedTicket.message);
                                                    showNotification('success', 'Message copied to clipboard');
                                                }}
                                                className="text-xs text-blue-600 hover:text-blue-800"
                                            >
                                                Copy Message
                                            </button>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                                            <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedTicket.message}</p>
                                        </div>
                                    </div>

                                    {/* Previous Admin Reply (if exists) */}
                                    {selectedTicket.admin_reply && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Previous Admin Reply</h3>
                                            <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                                                <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedTicket.admin_reply}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Admin Response Section */}
                                    <div>
                                        <label htmlFor="admin-reply" className="block text-sm font-semibold text-gray-900 mb-2">
                                            Admin Reply {selectedTicket.admin_reply ? '(Update)' : ''}
                                        </label>
                                        <textarea
                                            id="admin-reply"
                                            value={adminReply}
                                            onChange={(e) => setAdminReply(e.target.value)}
                                            rows={5}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Type your response to the user..."
                                        />
                                        {adminReply && (
                                            <p className="text-xs text-gray-500 mt-1">{adminReply.length} characters</p>
                                        )}
                                    </div>

                                    {/* Status Update Controls */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="ticket-status" className="block text-sm font-semibold text-gray-900 mb-2">
                                                Update Status
                                            </label>
                                            <select
                                                id="ticket-status"
                                                value={ticketStatus}
                                                onChange={(e) => setTicketStatus(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Resolution
                                            </label>
                                            <div className="flex items-center h-10">
                                                <input
                                                    type="checkbox"
                                                    id="is-resolved"
                                                    checked={isResolved}
                                                    onChange={(e) => {
                                                        setIsResolved(e.target.checked);
                                                        if (e.target.checked) {
                                                            setTicketStatus('resolved');
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label htmlFor="is-resolved" className="ml-2 text-sm text-gray-900">
                                                    Mark as Resolved
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={updateTicket}
                                        disabled={updating}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {updating ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Save Reply & Update Status
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default AdminSupport;