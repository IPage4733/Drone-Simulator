// File: AdminFeedbacks.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const AdminFeedbacks: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');
      const response = await axios.get('https://34-93-79-185.nip.io/api/feedback/', {
        headers: { Authorization: `Token ${token}` },
      });
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      const token = sessionStorage.getItem('auth_token');
      await axios.delete(`https://34-93-79-185.nip.io/api/feedback/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setFeedbacks(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) return <div className="p-6">Loading feedback...</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">User Feedback</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <tr key={feedback.id} className="border-t">
              <td className="px-4 py-2">{feedback.user?.username || 'Anonymous'}</td>
              <td className="px-4 py-2">{feedback.user?.email || 'N/A'}</td>
              <td className="px-4 py-2">{feedback.description}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDelete(feedback.id)}
                  className="text-red-500 hover:text-red-700"
                >
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

export default AdminFeedbacks;
