"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaIdCard, 
  FaIdBadge, 
  FaRibbon, 
  FaUserCircle,
  FaChevronRight 
} from "react-icons/fa";

export default function ProductNav() {
  const pathname = usePathname();

  const navItems = [
    { 
      href: "/customCard", 
      label: "Custom Cards", 
      icon: FaIdCard,
      description: "Design your own",
      basePath: "/customCard"
    },
    { 
      href: "/cards", 
      label: "ID Cards", 
      icon: FaIdBadge,
      description: "Professional IDs",
      basePath: "/cards"
    },
    { 
      href: "/lanyards", 
      label: "Lanyards", 
      icon: FaRibbon,
      description: "Neck Ribbons",
      basePath: "/lanyards"
    },
    { 
      href: "/holders", 
      label: "Badge Holders", 
      icon: FaUserCircle,
      description: "Secure Holders",
      basePath: "/holders"
    },
  ];

  // Function to check if current path is active (including detail pages)
  const isActive = (basePath) => {
    return pathname === basePath || pathname.startsWith(`${basePath}/`);
  };

  // Get current active section for breadcrumb
  const getActiveSection = () => {
    const activeItem = navItems.find(item => 
      pathname === item.href || pathname.startsWith(`${item.basePath}/`)
    );
    return activeItem?.label || "Browse";
  };

  return (
    <nav className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Desktop Navigation - Horizontal Layout */}
        <div className="hidden lg:block">
          <div className="flex justify-center items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-gray-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.basePath);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex flex-col items-center px-4 xl:px-6 py-3 xl:py-4 rounded-xl transition-all duration-300 min-w-[120px] xl:min-w-[140px] ${
                    active
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200 transform scale-105"
                      : "text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-md"
                  }`}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                  
                  {/* Icon */}
                  <div className={`mb-1 xl:mb-2 transition-transform duration-300 group-hover:scale-110 ${
                    active ? "text-white" : "text-blue-500"
                  }`}>
                    <Icon className="w-5 h-5 xl:w-6 xl:h-6" />
                  </div>
                  
                  {/* Label */}
                  <span className={`font-semibold text-xs xl:text-sm mb-0.5 xl:mb-1 transition-colors ${
                    active ? "text-white" : "text-gray-800"
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Description */}
                  <span className={`text-xs transition-colors hidden xl:block ${
                    active ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {item.description}
                  </span>
                  
                  {/* Hover arrow */}
                  {!active && (
                    <FaChevronRight className="absolute right-2 xl:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tablet Navigation - Compact Horizontal */}
        <div className="hidden md:block lg:hidden">
          <div className="flex justify-center items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-sm border border-gray-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.basePath);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center px-3 py-2 rounded-lg transition-all duration-300 min-w-[100px] ${
                    active
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md shadow-blue-200"
                      : "text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  {/* Icon */}
                  <div className={`mr-2 transition-transform duration-300 group-hover:scale-110 ${
                    active ? "text-white" : "text-blue-500"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  {/* Label */}
                  <span className={`font-semibold text-xs transition-colors ${
                    active ? "text-white" : "text-gray-800"
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation - Grid Layout */}
        <div className="md:hidden">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1.5">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.basePath);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center p-2 rounded-lg transition-all duration-200 border ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                        : "border-transparent text-gray-600 hover:border-blue-200 hover:bg-blue-25"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      active 
                        ? "bg-blue-500 text-white" 
                        : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1 min-w-0 ml-2">
                      <span className={`block font-semibold text-xs transition-colors ${
                        active ? "text-blue-700" : "text-gray-800"
                      }`}>
                        {item.label}
                      </span>
                      <span className={`block text-xs transition-colors ${
                        active ? "text-blue-500" : "text-gray-500"
                      }`}>
                        {item.description}
                      </span>
                    </div>
                    
                    {/* Active indicator */}
                    {active && (
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full ml-1"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Breadcrumb for active page */}
        <div className="text-center mt-3 sm:mt-4">
          <div className="inline-flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 bg-white/50 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
            <span>Products</span>
            <FaChevronRight className="w-2 h-2 sm:w-3 sm:h-3" />
            <span className="font-medium text-blue-600">
              {getActiveSection()}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}