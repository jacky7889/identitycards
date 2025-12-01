"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
// Icons
import {
  FaUser,
  FaBlog,
  FaImage,
  FaIdCard,
  FaRibbon,
  FaBox,
  FaShoppingCart,
  FaList,
  FaIdBadge,
  FaPhoneAlt,
  FaComments,
  FaUsers,
  FaCog,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import { READ_ADMIN_URL, READ_URL, UPDATE_ADMIN_URL } from "@/libs/config";

export default function AdminDashboard() {
  const router = useRouter();
  const [userStatus, setUserStatus] = useState(true);
  const [blogStatus, setBlogStatus] = useState(true);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [onlineUsersList, setOnlineUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [stats, setStats] = useState({
    users: 0,
    banners: 0,
    products: 0,
    cards: 0,
    lanyards: 0,
    holders: 0,
    orders: 0,
    blogs: 0,
    carts: 0,
    ccards: 0,
    cenquiry: 0,
    reviews: 0
  });

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // ------------------------------
  // Fetch Stats - FIXED: Moved to top level and made stable
  // ------------------------------
  const fetchStats = useCallback(async () => {
    try {
      const endpoints = [
        "users",
        "banners",
        "products",
        "cards",
        "lanyards",
        "holders",
        "orders",
        "blogs",
        "carts",
        "custom_card_downloads",
        "contact_enquiry",
        "reviews"
      ];

      const results = await Promise.all(
        endpoints.map((ep) =>
          fetch(`${READ_ADMIN_URL}/${ep}.php`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache'
            }
          }).then((r) => {
            if (!r.ok) throw new Error(`Failed to fetch ${ep}`);
            return r.json();
          })
        )
      );

      setStats({
        users: Array.isArray(results[0]) ? results[0].length : 0,
        banners: Array.isArray(results[1]) ? results[1].length : 0,
        products: Array.isArray(results[2]) ? results[2].length : 0,
        cards: Array.isArray(results[3]) ? results[3].length : 0,
        lanyards: Array.isArray(results[4]) ? results[4].length : 0,
        holders: Array.isArray(results[5]) ? results[5].length : 0,
        orders: Array.isArray(results[6]) ? results[6].length : 0,
        blogs: Array.isArray(results[7]) ? results[7].length : 0,
        carts: Array.isArray(results[8]) ? results[8].length : 0,
        ccards: Array.isArray(results[9]) ? results[9].length : 0,
        cenquiry: Array.isArray(results[10]?.data) ? results[10].data.length : 0,
        reviews: Array.isArray(results[11]?.data) ? results[11].data.length : 0,
      });
    } catch (e) {
      console.error("Stats loading error", e);
    }
  }, []); // Empty dependency array since we don't use any external variables

  // ------------------------------
  // Fetch Online Users - FIXED: Moved to top level and made stable
  // ------------------------------
  const fetchOnlineUsers = useCallback(async () => {
    try {
      const res = await fetch(`${READ_ADMIN_URL}/get_online_users.php`, {
        cache: 'no-store'
      });
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const onlineUsers = data.filter(user => user.status === 'online');
        const onlineCount = onlineUsers.length;
        
        setOnlineUsers(onlineCount);
        setOnlineUsersList(onlineUsers);
      } else {
        setOnlineUsers(0);
        setOnlineUsersList([]);
      }
    } catch (error) {
      console.error("Error fetching online users:", error);
      setOnlineUsers(0);
      setOnlineUsersList([]);
    }
  }, []); // Empty dependency array since we don't use any external variables

  // ------------------------------
  // Load User Control Status
  // ------------------------------
  const fetchUserStatus = useCallback(async () => {
    try {
      const res = await fetch(`${READ_ADMIN_URL}/control.php`, {
        cache: 'no-store'
      });
      const json = await res.json();
      setUserStatus(json.user_status === 1);
    } catch (e) {
      console.log("Status load error", e);
    }
  }, []);

  // ------------------------------
  // Load Blog Status
  // ------------------------------
  const fetchBlogStatus = useCallback(async () => {
    try {
      const response = await fetch(`${READ_URL}/navigation.php`, {
        cache: 'no-store'
      });
      const data = await response.json();
      
      if (data.success && data.navigation) {
        const blogItem = data.navigation.find(item => 
          item.slug === 'blogs' || item.name?.toLowerCase() === 'blogs'
        );
        setBlogStatus(blogItem ? blogItem.is_active === 1 : true);
      }
    } catch (error) {
      console.log("Blog status load error", error);
      setBlogStatus(true);
    }
  }, []);

  // ------------------------------
  // Load Initial Data - FIXED: Added all dependencies
  // ------------------------------
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchUserStatus(),
        fetchBlogStatus(),
        fetchOnlineUsers()
      ]);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats, fetchUserStatus, fetchBlogStatus, fetchOnlineUsers]); // Added all dependencies

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // ------------------------------
  // Update User Status Switch - FIXED: Added proper error handling
  // ------------------------------
  const updateStatus = async (newStatus) => {
    if (!mounted) return;
    
    const previousStatus = userStatus;
    setUserStatus(newStatus);

    try {
      const response = await fetch(`${UPDATE_ADMIN_URL}/update_control.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_status: newStatus ? 1 : 0 }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      setUserStatus(previousStatus);
      console.error("Error updating user status:", error);
    }
  };

  // ------------------------------
  // Update Blog Status - FIXED: Added proper error handling
  // ------------------------------
  const updateBlogStatus = async (newBlogStatus) => {
    if (!mounted) return;
    
    setIsLoadingBlog(true);
    const previousStatus = blogStatus;
    
    setBlogStatus(newBlogStatus);

    try {
      const response = await fetch(`${UPDATE_ADMIN_URL}/navigation.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newBlogStatus ? 1 : 0 }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to update blog status");
      }
    } catch (error) {
      setBlogStatus(previousStatus);
      console.error("Error updating blog status:", error);
    } finally {
      setIsLoadingBlog(false);
    }
  };

  // ------------------------------
  // Update Last Active - FIXED: Added cleanup
  // ------------------------------
  useEffect(() => {
    if (!mounted) return;

    const updateActivity = async () => {
      try {
        await fetch(
          "http://localhost/php-backend/admin/update/update_last_active.php",
          {
            method: "POST",
            credentials: "include",
            cache: 'no-store'
          }
        );
      } catch (error) {
        console.error("Error updating activity:", error);
      }
    };

    updateActivity();
    const interval = setInterval(updateActivity, 60000);
    return () => clearInterval(interval);
  }, [mounted]);

  // ------------------------------
  // Online Users Polling - FIXED: Added proper dependencies
  // ------------------------------
  useEffect(() => {
    if (!mounted) return;

    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 30000);
    return () => clearInterval(interval);
  }, [mounted, fetchOnlineUsers]); // Added fetchOnlineUsers dependency

  // Format last active time
  const formatLastActive = (lastActive) => {
    if (!lastActive) return 'Never';
    
    const now = new Date();
    const activeTime = new Date(lastActive);
    const diffMinutes = Math.floor((now - activeTime) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // Render (same as before)
  // ------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your application and view analytics</p>
      </div>

      {/* Control Switches Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        {/* ONLINE USERS CARD */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 bg-green-100 rounded-lg">
                <FaUsers className="text-green-600 text-sm sm:text-base lg:text-lg" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Online Users</h2>
                <p className="text-xs text-gray-500">Active in last 5 minutes</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{onlineUsers}</div>
            </div>
          </div>
          
          {/* Online Users List */}
          {onlineUsersList.length > 0 ? (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Currently Online</p>
              <div className="space-y-1 sm:space-y-2 max-h-24 sm:max-h-32 overflow-y-auto">
                {onlineUsersList.map((user) => (
                  <div key={user.id} className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
                      <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500 flex-shrink-0"></span>
                      <span className="text-gray-600 truncate text-xs sm:text-sm">
                        {user.name || `User #${user.id}`}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 ml-1 sm:ml-2">
                      {formatLastActive(user.last_active)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500 text-center py-1 sm:py-2">No users currently online</p>
            </div>
          )}
        </div>

        {/* USER STATUS SWITCH */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 bg-blue-100 rounded-lg">
                <FaCog className="text-blue-600 text-sm sm:text-base lg:text-lg" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Custom Card Access</h2>
                <p className="text-xs text-gray-500">
                  {userStatus ? "Login required" : "Open access"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-600">
              {userStatus ? "Enabled" : "Disabled"}
            </span>
            <button
              onClick={() => updateStatus(!userStatus)}
              className={`cursor-pointer relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                userStatus ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                  userStatus ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* BLOG STATUS SWITCH */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 bg-purple-100 rounded-lg">
                {blogStatus ? (
                  <FaEye className="text-purple-600 text-sm sm:text-base lg:text-lg" />
                ) : (
                  <FaEyeSlash className="text-purple-600 text-sm sm:text-base lg:text-lg" />
                )}
              </div>
              <div>
                <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Blog Section</h2>
                <p className="text-xs text-gray-500">
                  {blogStatus ? "Visible to users" : "Hidden from users"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-600">
              {isLoadingBlog ? "Updating..." : (blogStatus ? "Enabled" : "Disabled")}
            </span>
            <button
              onClick={() => updateBlogStatus(!blogStatus)}
              disabled={isLoadingBlog}
              className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                blogStatus ? 'bg-green-500' : 'bg-gray-300'
              } ${isLoadingBlog ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                  blogStatus ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">Overview</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
          <StatCard label="Enquiries" value={stats.cenquiry} icon={<FaPhoneAlt />} color="blue" link="/admin/enquiries" router={router} />
          <StatCard label="Users" value={stats.users} icon={<FaUser />} color="blue" link="/admin/users" router={router} />
          <StatCard label="Blogs" value={stats.blogs} icon={<FaBlog />} color="indigo" link="/admin/blogs" router={router} />
          <StatCard label="Banners" value={stats.banners} icon={<FaImage />} color="purple" link="/admin/banners" router={router} />
          <StatCard label="Cards" value={stats.cards} icon={<FaIdCard />} color="purple" link="/admin/cards" router={router} />
          <StatCard label="Lanyards" value={stats.lanyards} icon={<FaRibbon />} color="orange" link="/admin/lanyards" router={router} />
          <StatCard label="Holders" value={stats.holders} icon={<FaIdBadge />} color="teal" link="/admin/holders" router={router} />
          <StatCard label="Carts" value={stats.carts} icon={<FaShoppingCart />} color="red" link="/admin/carts" router={router} />
          <StatCard label="Orders" value={stats.orders} icon={<FaBox />} color="yellow" link="/admin/orders" router={router} />
          <StatCard label="Custom Cards" value={stats.ccards} icon={<FaList />} color="green" link="/admin/customCards" router={router} />
          <StatCard label="Products" value={stats.products} icon={<FaBox />} color="green" link="/admin/products" router={router} />
          <StatCard label="Reviews" value={stats.reviews} icon={<FaComments />} color="green" link="/admin/reviews" router={router} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon, link, router }) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    green: "text-green-600 bg-green-50 border-green-100",
    red: "text-red-600 bg-red-50 border-red-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    teal: "text-teal-600 bg-teal-50 border-teal-100",
    yellow: "text-yellow-600 bg-yellow-50 border-yellow-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
  };

  return (
    <div
      className="bg-white rounded-md sm:rounded-lg border border-gray-200 p-2 sm:p-3 lg:p-4 text-center hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-gray-300"
      onClick={() => router.push(link)}
    >
      <div
        className={`inline-flex items-center justify-center p-1 sm:p-2 rounded-lg mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg ${colorClasses[color]} group-hover:scale-105 transition-transform duration-200`}
      >
        {icon}
      </div>

      <h2 className="text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1 leading-tight">{label}</h2>

      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}