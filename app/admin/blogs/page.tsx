"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";



interface Blog {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({ title: "", content: "", image_url: "" });
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchBlogs = async () => {
    const token = Cookies.get("admin_token");
    try {
      const res = await axios.get("/api/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setFormData({ title: blog.title, content: blog.content, image_url: blog.image_url || "" });
    setStatus("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", content: "", image_url: "" });
    setStatus("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");
    const token = Cookies.get("admin_token");
    
    try {
      if (editingId) {
        await axios.patch(`/api/admin/blogs/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatus("Blog updated successfully!");
        setEditingId(null);
      } else {
        await axios.post("/api/admin/blogs", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatus("Blog created successfully!");
      }
      
      setFormData({ title: "", content: "", image_url: "" });
      fetchBlogs();
    } catch (err: any) {
      console.error(err);
      setStatus("Error occurred: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    const token = Cookies.get("admin_token");
    try {
      await axios.delete(`/api/admin/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBlogs();
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete blog.");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Manage Blogs</h2>

      <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm max-w-3xl">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          {editingId ? "Edit Blog" : "Create New Blog"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              name="title" 
              placeholder="Blog title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-forest focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
            <input 
              name="image_url" 
              placeholder="https://example.com/image.jpg" 
              value={formData.image_url} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-forest focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea 
              name="content" 
              placeholder="Write the blog content here..." 
              value={formData.content} 
              onChange={handleChange} 
              required 
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-forest focus:outline-none resize-y"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button 
              type="submit"
              className="bg-forest text-white px-4 py-2 rounded-md font-medium hover:bg-forest/90 transition-colors"
            >
              {editingId ? "Update Blog" : "Publish Blog"}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={cancelEdit}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        
        {status && (
          <div className={`mt-4 p-3 rounded-md text-sm font-medium ${status.includes('Error') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {status}
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <h3 className="text-lg font-bold p-6 border-b border-gray-200 text-gray-800 bg-gray-50">
          Published Blogs
        </h3>
        
        {loading ? (
          <div className="p-6 text-gray-500">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="p-6 text-gray-500 text-center">No blogs published yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <li key={blog.id} className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-lg text-gray-900">{blog.title}</h4>
                    <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-full">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 max-w-3xl">
                    {blog.content}
                  </p>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => handleEdit(blog)}
                    className="text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-50 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="text-sm bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded hover:bg-red-50 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
