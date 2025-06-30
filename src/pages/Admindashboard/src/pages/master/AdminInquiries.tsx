// File: AdminInquiries.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Eye } from 'lucide-react';
import { Dialog } from '@headlessui/react';

interface Inquiry {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  organization: string;
  i_am: string;
  purpose_of_contact: string;
  created_at: string;
}

const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchInquiries = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');
      const response = await axios.get('https://34-47-194-149.nip.io/api/inquiry/admin/all/', {
        headers: { Authorization: `Token ${token}` },
      });
      setInquiries(response.data.results);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const token = sessionStorage.getItem('auth_token');
      await axios.delete(`https://34-47-194-149.nip.io/api/inquiry/admin/${id}/delete/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const openDialog = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setSelectedInquiry(null);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  if (loading) return <div className="p-6">Loading inquiries...</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Training Inquiries</h2>
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow-sm rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Purpose</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {inquiries.map(inquiry => (
            <tr key={inquiry.id}>
              <td className="px-4 py-3 text-sm text-gray-900">{inquiry.full_name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{inquiry.email}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{inquiry.phone_number}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{inquiry.purpose_of_contact}</td>
              <td className="px-4 py-3 text-sm">
                <button onClick={() => openDialog(inquiry)} className="text-blue-500 hover:text-blue-700 mr-2">
                  <Eye size={16} />
                </button>
                <button onClick={() => handleDelete(inquiry.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedInquiry && (
        <Dialog open={isOpen} onClose={closeDialog} className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <Dialog.Panel className="bg-white p-6 rounded-lg max-w-md w-full">
            <Dialog.Title className="text-lg font-bold mb-2">Inquiry Details</Dialog.Title>
            <p><strong>Name:</strong> {selectedInquiry.full_name}</p>
            <p><strong>Email:</strong> {selectedInquiry.email}</p>
            <p><strong>Phone:</strong> {selectedInquiry.phone_number}</p>
            <p><strong>Organization:</strong> {selectedInquiry.organization}</p>
            <p><strong>I am:</strong> {selectedInquiry.i_am}</p>
            <p><strong>Purpose:</strong> {selectedInquiry.purpose_of_contact}</p>
            <p><strong>Submitted on:</strong> {new Date(selectedInquiry.created_at).toLocaleString()}</p>
            <div className="mt-4 text-right">
              <button onClick={closeDialog} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                Close
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      )}
    </div>
  );
};

export default AdminInquiries;
