import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FileText, AlertCircle } from 'lucide-react';
import API_URL from '../../config/api';

export default function AdminTranscriptions() {
  const [transcriptions, setTranscriptions] = useState([]);

  useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/calls/transcriptions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.ok ? await res.json() : [];
        setTranscriptions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load transcriptions');
      }
    };

    fetchTranscriptions();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
        <FileText className="w-6 h-6 text-red-600" />
        Transcriptions
      </h3>

      <div className="space-y-4">
        {transcriptions.length === 0 ? (
          <div className="flex items-center gap-2 text-gray-500">
            <AlertCircle className="w-5 h-5" />
            <p>No transcriptions available.</p>
          </div>
        ) : (
          transcriptions.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">{item.transcript}</p>
              <p className="text-xs text-gray-400 mt-2">
                {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}