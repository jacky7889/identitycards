"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar/Navbar";
import { READ_URL, UPDATE_URL } from "@/libs/config";

export default function ProfileClient() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      alert("Please log in first");
      router.push("/login");
      return;
    }

    // Fetch user profile from users.php
    fetch(`${READ_URL}/users.php?id=${userId}`)
      .then((res) => res.json())
      .then((profileData) => {
        if (profileData.success) {
          setProfile(profileData.user);
        } else {
          console.error("Profile fetch error:", profileData.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });

    // Fetch user orders count only
    fetch(`${READ_URL}/orders.php?userId=${userId}`)
      .then((res) => res.json())
      .then((orderData) => {
        if (orderData.success) {
          setOrders(orderData.orders || []);
        }
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      });
  }, [router]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (passwordError) setPasswordError("");
    if (passwordSuccess) setPasswordSuccess("");
  };

  const validatePassword = () => {
    if (!passwordData.currentPassword) {
      return "Current password is required";
    }
    if (!passwordData.newPassword) {
      return "New password is required";
    }
    if (passwordData.newPassword.length < 6) {
      return "New password must be at least 6 characters long";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return "New passwords do not match";
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      return "New password must be different from current password";
    }
    return "";
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validatePassword();
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    setUpdatingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");

    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`${UPDATE_URL}/password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPasswordSuccess("Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess("");
        }, 2000);
      } else {
        setPasswordError(result.message || "Failed to update password");
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError("An error occurred while updating password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordError("");
    setPasswordSuccess("");
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto p-5">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto p-5">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto p-5">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-600 mt-2">Welcome back, {profile?.name || "User"}!</p>
          </div>

          {/* Profile Content */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
  {/* Header Section - Block layout on mobile */}
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
    <h2 className="text-xl font-semibold text-center sm:text-left block w-full sm:w-auto">Profile Information</h2>
    {/* Button will be moved to bottom in mobile */}
    <button
      onClick={() => setShowPasswordModal(true)}
      className="hidden sm:block bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors text-sm"
    >
      Change Password
    </button>
  </div>
  
  {profile ? (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-900 border-b pb-2">Personal Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium text-gray-500">User ID</span>
              <span className="text-gray-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {profile.id}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium text-gray-500">Full Name</span>
              <span className="text-gray-900">{profile.name || "Not provided"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium text-gray-500">Email Address</span>
              <span className="text-gray-900">{profile.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium text-gray-500">Phone Number</span>
              <span className="text-gray-900">{profile.contact || "Not provided"}</span>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-900 border-b pb-2">Account Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium text-gray-500">Member Since</span>
              <span className="text-gray-900">
                {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "Not available"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium text-gray-500">Total Orders</span>
              <span className="text-gray-900 font-semibold">{orders.length} orders</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium text-gray-500">Account Status</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm font-medium text-gray-500">Password</span>
              <span className="text-gray-400 text-sm">••••••••</span>
            </div>
          </div>
        </div>

        {/* Additional Information if available */}
        {(profile.address || profile.company) && (
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-4 text-gray-900 border-b pb-2">Additional Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {profile.address && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Address</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profile.address}</p>
                </div>
              )}
              {profile.company && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Company</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profile.company}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <p>Unable to load profile information.</p>
      </div>
    )}

    {/* Change Password Button - Mobile only, shown at bottom */}
    <div className="block sm:hidden mt-6">
      <button
        onClick={() => setShowPasswordModal(true)}
        className="w-full bg-red-700 text-white py-3 rounded-lg hover:bg-red-800 transition-colors text-sm"
      >
        Change Password
      </button>
    </div>
  </div>
        </div>
      </div>

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <button
                onClick={closePasswordModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter new password (min. 6 characters)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  {passwordSuccess}
                </div>
              )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={closePasswordModal}
              className="w-full sm:flex-1 bg-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-400 transition-colors"
              disabled={updatingPassword}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:flex-1 bg-red-700 text-white py-3 rounded-md hover:bg-red-800 transition-colors disabled:bg-red-400"
              disabled={updatingPassword}
            >
              {updatingPassword ? "Updating..." : "Update Password"}
            </button>
           </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}