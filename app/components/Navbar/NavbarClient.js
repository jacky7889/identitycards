"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaShoppingCart, 
  FaUserCircle, 
  FaChevronDown,
  FaSignOutAlt,
  FaUserCog,
  FaBox,
  FaHome,
  FaInfoCircle,
  FaStore,
  FaBlog,
  FaEnvelope
} from "react-icons/fa";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { READ_URL } from "@/libs/config";

// Client-side icon mapping
const clientIconMap = {
  FaHome: FaHome,
  FaInfoCircle: FaInfoCircle,
  FaStore: FaStore,
  FaBlog: FaBlog,
  FaEnvelope: FaEnvelope,
};

export default function NavbarClient({ initialNavItems, brandlogo, brandname }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [navItems] = useState(initialNavItems);

  // Get icon component from icon name
  const getIconComponent = (iconName) => {
    return clientIconMap[iconName] || FaStore;
  };

  const fetchUserData = async (userId) => {
    if (!userId) return null;

    setIsLoadingUser(true);
    try {
      const response = await fetch(`${READ_URL}/users.php?id=${userId}`);
      const data = await response.json();
      
      if (data.success && data.user) {
        setUserName(data.user.name || data.user.username || data.user.email);
        return data.user;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  };

  // ✅ Load user and cart status on mount
  useEffect(() => {
    const initializeAppData = async () => {
      const signedInStatus = localStorage.getItem("isSignedIn") === "true";
      setIsSignedIn(signedInStatus);

      const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartCount(savedCart.length);

      if (signedInStatus) {
        const userId = localStorage.getItem("userId");
        if (userId) {
          await fetchUserData(userId);
        }
      }
    };

    initializeAppData();
  }, []);

  // ✅ Update when auth state changes
  useEffect(() => {
    const handleAuthChange = async () => {
      const signedInStatus = localStorage.getItem("isSignedIn") === "true";
      setIsSignedIn(signedInStatus);

      if (signedInStatus) {
        const userId = localStorage.getItem("userId");
        if (userId) {
          await fetchUserData(userId);
        }
      } else {
        setUserName("");
      }
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  // ✅ Update count when cart changes
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartCount(updatedCart.length);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleCartClick = () => {
    if (isSignedIn) {
      router.push("/cart");
    } else {
      setShowAuthPopup(true);
    }
  };

  const handleSignOut = () => {
      localStorage.removeItem("isSignedIn");
      localStorage.removeItem("userId");
      localStorage.removeItem("loginTime");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("grandTotal");
      localStorage.removeItem("shippingCost");
      localStorage.removeItem("totalPrice");
      localStorage.removeItem("totalWeight");
    setIsSignedIn(false);
    setUserName("");
    setShowAccountMenu(false);
    window.dispatchEvent(new Event("authChange"));
    
    setTimeout(() => {
      router.push("/");
    }, 100);
  };

  const getDisplayName = () => {
    if (!userName) return "User";
    if (userName.includes('@')) {
      return userName.split('@')[0];
    }
    const names = userName.split(' ');
    return names[0];
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-100 w-full top-0 left-0 z-50 sticky">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{brandlogo}</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {brandname}
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const IconComponent = getIconComponent(item.icon);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                      pathname === item.href
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="relative p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 group"
              >
                <FaShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
                <div className="absolute inset-0 rounded-lg bg-blue-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
              </button>

              {/* Account Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="cursor-pointer flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <FaUserCircle className={`w-5 h-5 ${isSignedIn ? "text-blue-600" : "text-gray-400"}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {isSignedIn ? (isLoadingUser ? "..." : getDisplayName()) : "Account"}
                  </span>
                  <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showAccountMenu ? "rotate-180" : ""}`} />
                </button>

                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {isSignedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900 truncate">
                            {userName || "User"}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Welcome back!</p>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setShowAccountMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <FaUserCog className="w-4 h-4" />
                          <span>Manage Account</span>
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setShowAccountMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <FaBox className="w-4 h-4" />
                          <span>My Orders</span>
                        </Link>
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="cursor-pointer flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <FaSignOutAlt className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">Welcome!</p>
                          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
                        </div>
                        <Link
                          href="/signin"
                          onClick={() => setShowAccountMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <FaUserCircle className="w-4 h-4" />
                          <span>Sign In</span>
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setShowAccountMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <FaUserCircle className="w-4 h-4" />
                          <span>Create Account</span>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            >
              {isOpen ? <IoMdClose className="w-6 h-6" /> : <IoMdMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl animate-in slide-in-from-top">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const IconComponent = getIconComponent(item.icon);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      pathname === item.href
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* User Section */}
              {isSignedIn && (
                <div className="px-4 py-3 border-t border-gray-100 mt-2">
                  <div className="flex items-center space-x-3">
                    <FaUserCircle className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {isLoadingUser ? "Loading..." : getDisplayName()}
                      </p>
                      <p className="text-sm text-gray-500">Welcome back!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart in Mobile */}
              <button
                onClick={() => {
                  handleCartClick();
                  setIsOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  <FaShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Cart ({cartCount})</span>
              </button>

              {/* Account Options */}
              <div className="border-t border-gray-100 pt-2">
                {isSignedIn ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <FaUserCog className="w-5 h-5" />
                      <span>Manage Account</span>
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <FaBox className="w-5 h-5" />
                      <span>My Orders</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaSignOutAlt className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <FaUserCircle className="w-5 h-5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <FaUserCircle className="w-5 h-5" />
                      <span>Create Account</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Popup */}
      {showAuthPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 mx-4 animate-in zoom-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sign In Required</h2>
              <p className="text-gray-600 text-sm">
                Please sign in to access your shopping cart and continue with your purchase.
              </p>
            </div>
            <div className="space-y-3">
              <Link
                href="/signin"
                onClick={() => setShowAuthPopup(false)}
                className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setShowAuthPopup(false)}
                className="block w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
              >
                Create Account
              </Link>
              <button
                onClick={() => setShowAuthPopup(false)}
                className="block w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}