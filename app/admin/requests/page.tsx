"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";



interface AnalysisRequest {
  id: number;
  name: string;
  institutions: string;
  email: string;
  phone: string;
  request: string;
  created_at: string;
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<AnalysisRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      const token = Cookies.get("admin_token");
      try {
        const res = await axios.get("/api/admin/requests", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(Array.isArray(res.data) ? res.data : []);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <div className="text-gray-500">Loading requests...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Analysis Requests</h2>
      
      {requests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-gray-500 text-center">
          No requests found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-gray-200 font-medium">ID</th>
                <th className="px-6 py-4 border-b border-gray-200 font-medium">Name</th>
                <th className="px-6 py-4 border-b border-gray-200 font-medium">Institution</th>
                <th className="px-6 py-4 border-b border-gray-200 font-medium">Contact</th>
                <th className="px-6 py-4 border-b border-gray-200 font-medium">Request Details</th>
                <th className="px-6 py-4 border-b border-gray-200 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{req.id}</td>
                  <td className="px-6 py-4 font-medium">{req.name}</td>
                  <td className="px-6 py-4">{req.institutions}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <a href={`mailto:${req.email}`} className="text-forest hover:underline">{req.email}</a>
                      <span className="text-gray-500 text-xs mt-1">{req.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs break-words">{req.request}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
