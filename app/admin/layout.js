"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaNewspaper,
  FaFileAlt,
  FaMinusSquare,
  FaRing,
  FaRegIdCard,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaCartArrowDown,
  FaComments,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { LiaShoppingCartSolid } from "react-icons/lia";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check authentication on component mount and route changes
    const checkAuth = () => {
      const adminSignedIn = localStorage.getItem('adminSignedIn') === 'true';
      setIsAuthenticated(adminSignedIn);
            
      if (!adminSignedIn) {
        router.push('/auth');
      }
    };

    checkAuth();

    // Check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    // Optional: Listen for storage changes (if user logs out from another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [router]);

  // Browser close signout functionality
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear admin authentication data when browser/tab closes
      localStorage.removeItem("adminSignedIn");
      localStorage.removeItem("adminLoginTime");
      
      // Dispatch event for other admin components
      window.dispatchEvent(new Event("adminAuthChange"));
    };

    // Add event listener for browser/tab close
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const menus = [
    { href: "/admin", icon: <FaTachometerAlt />, label: "Dashboard" },
    { href: "/admin/blogs", icon: <FaNewspaper />, label: "Blogs" },
    { href: "/admin/banners", icon: <FaUsers />, label: "Banners" },
    { href: "/admin/enquiries", icon: <FaFileAlt />, label: "Enquiries" },
    { href: "/admin/users", icon: <FaUsers />, label: "Users" },
    { href: "/admin/products", icon: <FaBox />, label: "Products" },
    { href: "/admin/cards", icon: <FaRegIdCard />, label: "Cards" },
    { href: "/admin/lanyards", icon: <FaRing />, label: "Lanyards" },
    { href: "/admin/holders", icon: <FaMinusSquare />, label: "Holders" },
    { href: "/admin/carts", icon: <LiaShoppingCartSolid />, label: "Carts" },
    { href: "/admin/orders", icon: <FaCartArrowDown />, label: "Orders" },
    { href: "/admin/reviews", icon: <FaComments />, label: "Reviews" },
    { href: "/admin/brandDetails", icon: <FaFileAlt />, label: "Brand" },
    { href: "/admin/customCards", icon: <FaFileAlt />, label: "Custom Cards" },
  ];

  const handleLogout = () => {
    // Clear all admin-related data
    localStorage.removeItem("adminSignedIn");
      localStorage.removeItem("adminLoginTime");
    
    setIsAuthenticated(false);
    
    // Dispatch event for other components
    window.dispatchEvent(new Event("adminAuthChange"));
    
    router.push("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-16 flex items-center justify-between px-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          {isSidebarOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
        </button>
        <h1 className="text-lg font-bold text-blue-600">Admin Panel</h1>
        <div className="w-8"></div> {/* Spacer for balance */}
      </div>

      {/* Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-50
        w-64 bg-white shadow-md flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:transform-none
      `}>
        <div>
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
          </div>
          <nav className="mt-6 space-y-1 px-3">
            {menus.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                onClick={closeSidebar}
                className="flex items-center w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-100 transition-colors duration-200 text-sm md:text-base"
              >
                <span className="mr-3 text-base">{m.icon}</span>
                {m.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer User Info */}
        <div className="border-t p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-2xl md:text-3xl text-gray-600" />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">
                {isAuthenticated ? "Admin User" : "Guest"}
              </p>
              <p className="text-xs text-gray-500">
                {isAuthenticated ? "admin" : "Not logged in"}
              </p>
            </div>
          </div>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 cursor-pointer p-2 rounded-lg hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <FaSignOutAlt className="text-lg" />
            </button>
          ) : (
            <button
              onClick={() => router.push("/admin/signin")}
              className="text-green-500 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
              title="Login"
            >
              <FaSignInAlt className="text-lg" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-auto mt-16 md:mt-0">
        {children}
      </main>
    </div>
  );
}