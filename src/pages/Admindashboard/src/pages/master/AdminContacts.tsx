// File: AdminContacts.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Eye } from 'lucide-react';
import { Dialog } from '@headlessui/react';

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  user_details: {
    id: number;
    username: string;
    email: string;
    full_name: string;
    phone_number: string;
    city: string;
    state_province: string;
    country: string;
    purpose_of_use: string;
    is_active: boolean;
    plan: string;
    plan_expiry_date: string;
    last_login_date: string;
    is_social_login: boolean;
    is_paid_user: boolean;
    is_superuser: boolean;
    is_staff: boolean;
    created_at: string;
    updated_at: string;
  };
}

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContacts = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');
      const response = await axios.get('https://34-47-194-149.nip.io/api/contact/admin/all/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setContacts(response.data.results);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      const token = sessionStorage.getItem('auth_token');
<<<<<<< HEAD
      await axios.delete(`https://34-47-194-149.nip.io/api/contact/${id}/delete`, {
=======
      await axios.delete(`https://34-47-194-149.nip.io/api/contact/admin/${id}/delete/`, {
>>>>>>> 93e8ef0ac17dbb3b9917d985c99e0bef1a9e5910
        headers: { Authorization: `Token ${token}` },
      });
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleView = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) return <div className="p-6">Loading contacts...</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Contact Submissions</h2>
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow-sm rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Message</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contacts.map(contact => (
            <tr key={contact.id}>
              <td className="px-4 py-3 text-sm text-gray-900">{contact.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{contact.email}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{contact.message}</td>
              <td className="px-4 py-3 text-sm">
                <button
                  onClick={() => handleView(contact)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedContact && (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <Dialog.Panel className="bg-white p-6 rounded-lg max-w-md w-full">
            <Dialog.Title className="text-lg font-bold mb-2">Contact Details</Dialog.Title>
            <p><strong>Name:</strong> {selectedContact.user_details.full_name}</p>
            <p><strong>Email:</strong> {selectedContact.user_details.email}</p>
            <p><strong>Phone:</strong> {selectedContact.user_details.phone_number}</p>
            <p><strong>City:</strong> {selectedContact.user_details.city}</p>
            <p><strong>State:</strong> {selectedContact.user_details.state_province}</p>
            <p><strong>Country:</strong> {selectedContact.user_details.country}</p>
            <p><strong>Purpose:</strong> {selectedContact.user_details.purpose_of_use}</p>
            <p><strong>Plan:</strong> {selectedContact.user_details.plan}</p>
            <p><strong>Message:</strong> {selectedContact.message}</p>
            <div className="mt-4 text-right">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
            </div>
          </Dialog.Panel>
        </Dialog>
      )}
    </div>
  );
};

export default AdminContacts;
