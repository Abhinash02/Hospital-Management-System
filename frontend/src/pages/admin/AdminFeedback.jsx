import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';
import API_URL from '../../config/api';

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/feedbacks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.ok ? await res.json() : [];
        setFeedbacks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load feedback');
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
        <Star className="w-6 h-6 text-yellow-500" />
        Patient Feedback
      </h3>

      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedback available.</p>
        ) : (
          feedbacks.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-medical-dark">
                    {item.userName || 'Patient'}
                  </p>
                  <p className="text-sm text-yellow-600 font-semibold">
                    Rating: {item.rating}/5
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    {item.message}
                  </p>
                </div>

                <div className="text-xs text-gray-400">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : 'N/A'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}