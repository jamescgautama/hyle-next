"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";



interface AdminUser {
  id: number;
  username: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [status, setStatus] = useState("");
  const currentUsername = Cookies.get("admin_username");

  const fetchUsers = async () => {
    const token = Cookies.get("admin_token");
    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Creating...");
    try {
      await axios.post("/api/auth/register", formData);
      setStatus("Admin created successfully.");
      setFormData({ username: "", password: "" });
      fetchUsers();
    } catch (err: any) {
      setStatus(err.response?.data?.error || "Failed to create admin.");
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (username === currentUsername) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!confirm(`Are you sure you want to delete admin "${username}"?`)) return;

    const token = Cookies.get("admin_token");
    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete admin.");
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
        <p className="text-sm text-gray-500 mt-1">Manage platform administrators and access control.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Create New Admin</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-forest focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-forest focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-forest text-white px-4 py-2 rounded-md font-medium hover:bg-forest/90 transition-colors"
            >
              Add Admin
            </button>
          </form>
          {status && (
            <p className={`mt-4 text-sm font-medium ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {status}
            </p>
          )}
        </section>

        <section className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <h3 className="text-lg font-bold p-6 border-b border-gray-200 text-gray-900 bg-gray-50/50">
            Current Administrators
          </h3>
          {loading ? (
            <div className="p-6 text-gray-500">Loading administrators...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-200">Username</th>
                    <th className="px-6 py-3 border-b border-gray-200">Created At</th>
                    <th className="px-6 py-3 border-b border-gray-200 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                        {user.username}
                        {user.username === currentUsername && (
                          <span className="text-[10px] font-bold bg-forest/10 text-forest px-1.5 py-0.5 rounded uppercase">You</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(user.id, user.username)}
                          disabled={user.username === currentUsername}
                          className={`text-sm font-bold transition-colors ${user.username === currentUsername
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-red-600 hover:text-red-800"
                            }`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

