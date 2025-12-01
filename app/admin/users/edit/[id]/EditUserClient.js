"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { READ_ADMIN_URL, UPDATE_ADMIN_URL } from "@/libs/config";

export default function EditUserClient({ id }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    password: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${READ_ADMIN_URL}/users.php?id=${id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }
        
        const data = await res.json();
        let userData;
        
        if (Array.isArray(data)) {
          userData = data.find((item) => String(item.id) === String(id));
        } else {
          userData = data;
        }

        if (userData) {
          setForm({
            name: userData.name || "",
            email: userData.email || "",
            contact: userData.contact || "",
            password: "" // Don't pre-fill password for security
          });
        } else {
          alert("User not found");
          router.push("/admin/users");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        alert("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.name?.trim() || !form.email?.trim()) {
      alert("Name and email are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate contact number if provided
    if (form.contact && !/^[0-9]{10}$/.test(form.contact)) {
      alert("Please enter a valid 10-digit contact number");
      return;
    }

    setSaving(true);
    try {
      // Prepare update data
      const updateData = {
        id: id,
        name: form.name.trim(),
        email: form.email.trim(),
        contact: form.contact || ""
      };

      // Only include password if provided
      if (form.password.trim()) {
        updateData.password = form.password.trim();
      }

      const res = await fetch(
        `${UPDATE_ADMIN_URL}/user.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const result = await res.json();
      if (result.success) {
        alert("✅ User updated successfully!");
        router.push("/admin/users");
      } else {
        alert("❌ Update failed: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error updating user:", err);
      alert("❌ Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For contact field, only allow numbers and limit to 10 digits
    if (name === 'contact') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
      setForm(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-2">Edit User</h1>
      <p className="text-gray-600 mb-6">Update user information and details</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Enter full name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Enter email address"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number
          </label>
          <input
            type="tel"
            name="contact"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="10-digit contact number"
            value={form.contact}
            onChange={handleChange}
            pattern="[0-9]{10}"
            maxLength="10"
          />
          <p className="text-xs text-gray-500 mt-2">
            Optional: Enter 10-digit contact number without spaces or special characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Leave blank to keep current password"
            value={form.password}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500 mt-2">
            {`Leave blank if you don't want to change the password`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="cursor-pointer w-full sm:flex-1 bg-gray-500 text-white px-4 sm:px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`cursor-pointer w-full sm:flex-1 px-4 sm:px-6 py-3 rounded-lg font-medium transition text-sm sm:text-base ${
              saving
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {saving ? "Updating..." : "Update User"}
          </button>
        </div>
      </form>
    </div>
  );
}