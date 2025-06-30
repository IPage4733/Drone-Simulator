// File: AdminInquiries.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');
      const response = await axios.get('https://34-47-194-149.nip.io/api/inquiry/', {
        headers: { Authorization: `Token ${token}` },
      });
      setInquiries(response.data);
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
      await axios.delete(`https://34-47-194-149.nip.io/api/inquiry/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  if (loading) return <div className="p-6">Loading inquiries...</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Training Inquiries</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Purpose</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map(inquiry => (
            <tr key={inquiry.id} className="border-t">
              <td className="px-4 py-2">{inquiry.name}</td>
              <td className="px-4 py-2">{inquiry.email}</td>
              <td className="px-4 py-2">{inquiry.phone}</td>
              <td className="px-4 py-2">{inquiry.purpose}</td>
              <td className="px-4 py-2">
                <button onClick={() => handleDelete(inquiry.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminInquiries;
