// File: AdminFeedbacks.tsx

import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Trash2, Eye } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

interface Feedback {
  id: string;
  description: string;
  image_urls: string[];
  user: {
    username?: string;
    email?: string;
    full_name?: string;
  };
}

const AdminFeedbacks: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');
      const response = await axios.get('https://34-47-194-149.nip.io/api/feedback/admin/all/', {
        headers: { Authorization: `Token ${token}` },
      });
      setFeedbacks(response.data.results || []);
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
      await axios.delete(`https://34-47-194-149.nip.io/api/feedback/admin/${id}/delete/`, {
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

  const closeModal = () => setIsOpen(false);
  const openModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsOpen(true);
  };

  const closeImageModal = () => setImageModalUrl(null);

  if (loading) return <div className="p-6">Loading feedback...</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">User Feedback</h2>
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow-sm rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Username</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Images</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {feedbacks.map((feedback) => (
            <tr key={feedback.id}>
              <td className="px-4 py-3 text-sm text-gray-900">{feedback.user?.username || 'Anonymous'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{feedback.user?.email || 'N/A'}</td>
              <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs">{feedback.description}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {feedback.image_urls?.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`feedback-${index}`}
                      className="w-10 h-10 object-cover rounded border cursor-pointer"
                      onClick={() => setImageModalUrl(url)}
                    />
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-sm">
                <button
                  onClick={() => openModal(feedback)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleDelete(feedback.id)}
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

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                    Feedback Details
                  </Dialog.Title>
                  <div className="mt-2 space-y-1">
                    <p><strong>Name:</strong> {selectedFeedback?.user?.username || 'Anonymous'}</p>
                    <p><strong>Email:</strong> {selectedFeedback?.user?.email || 'N/A'}</p>
                    <p><strong>Description:</strong> {selectedFeedback?.description}</p>
                    {selectedFeedback?.image_urls?.length > 0 && (
                      <div className="mt-2">
                        <strong>Images:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedFeedback.image_urls.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`feedback-image-${i}`}
                              className="w-20 h-20 rounded object-cover border cursor-pointer"
                              onClick={() => setImageModalUrl(url)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-right">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Full Image Modal */}
      <Transition appear show={!!imageModalUrl} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeImageModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="relative bg-white p-4 rounded shadow-lg">
                <img src={imageModalUrl || ''} alt="Full View" className="max-h-[80vh] max-w-[90vw] object-contain" />
                <div className="mt-2 text-right">
                  <button onClick={closeImageModal} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Close</button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AdminFeedbacks;