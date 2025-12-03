import { READ_URL } from "@/libs/config";
import NavbarClient from "./NavbarClient";

// Icon mapping for dynamic navigation
const iconMap = {
  home: "FaHome",
  about: "FaInfoCircle", 
  products: "FaStore",
  blogs: "FaBlog",
  contact: "FaEnvelope",
  default: "FaStore",
};

// Default navigation items
const defaultNavItems = [
  { name: "Home", href: "/", icon: "FaHome" },
  { name: "About", href: "/about", icon: "FaInfoCircle" },
  { name: "Products", href: "/products", icon: "FaStore" },
  { name: "Blogs", href: "/blogs", icon: "FaBlog" },
  { name: "Contact", href: "/contact", icon: "FaEnvelope" },
];

async function getNavigation() {
  try {
    const response = await fetch(`${READ_URL}/navigation.php`, {
      next: { revalidate: 3600 }
    });
    
   if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.navigation && data.navigation.length > 0) {
      // Transform API data to match component structure
      const transformedNav = data.navigation.map((item) => {
        // Determine icon based on slug or name
        const iconKey = item.slug?.toLowerCase() || item.name?.toLowerCase();
        const iconName = iconMap[iconKey] || iconMap.default;
        
        return {
          name: item.name,
          href: item.url || `/${item.slug}`,
          icon: iconName, // Pass icon name instead of component
          originalData: item
        };
      });
      
      return transformedNav;
    } else {
      return defaultNavItems;
    }
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return defaultNavItems;
  }
}

async function getCompanyName() {
  try {
    const res = await fetch(`${READ_URL}/contact_locations.php`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

     if (data.data && data.data[0]) {
      return data.data[0].companyname || null;
    } else {
      throw new Error("No company name found");
    }
  } catch (error) {
    console.error("Error fetching company name:", error);
    return null;
  }
}

function parseCompanyName(companyname) {
  let brandlogo = "";
  let brandname = "";

  if (companyname) {
    const parts = companyname.split(",").map(p => p.trim());

    if (parts.length === 2) {
      brandlogo = parts[0];
      brandname = parts[1];
    } else {
      brandlogo = companyname.slice(0, 2).toUpperCase();
      brandname = companyname.slice(2) || companyname;
    }
  } else {
    brandlogo = "CG";
    brandname = "Creation Graphics";
  }
   
  return { brandlogo, brandname };
}

export default async function Navbar() {
   const companyName = await getCompanyName();
   const { brandlogo, brandname } = parseCompanyName(companyName);
  const navItems = await getNavigation();

  return (
    <NavbarClient 
      initialNavItems={navItems}
      brandlogo={brandlogo}
      brandname={brandname}
    />
  );
}