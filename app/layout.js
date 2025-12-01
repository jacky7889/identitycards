// app/layout.js
import "./globals.css";
import Footer from "./components/Footer";
import { CartProvider } from "@/app/components/Context";
import { READ_URL } from "@/libs/config";

export const metadata = {
  title: "Identity Cards",
  description: "PVC Identity Cards, Holders, and Lanyards",
};

async function getCopyright() {
  try {
    const res = await fetch(`${READ_URL}/contact_locations.php`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (data.data && data.data[0] && data.data[0].copyright) {
      // Return copyright if it exists and is not empty
      return data.data[0].copyright;
    } else {
      // Return fallback if copyright is empty or doesn't exist
      return `© ${new Date().getFullYear()} Creation Graphics`;
    }
  } catch (error) {
    console.error("Error fetching copyright:", error);
    // Return fallback on any error
    return `© ${new Date().getFullYear()} Creation Graphics`;
  }
}

// Client component for handling browser close signout
function BrowserCloseHandler() {
  // This will only run on the client side
  if (typeof window !== 'undefined') {
    const handleBeforeUnload = () => {
      // Clear authentication data
      localStorage.removeItem("isSignedIn");
      localStorage.removeItem("userId");
      localStorage.removeItem("loginTime");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("grandTotal");
      localStorage.removeItem("shippingCost");
      localStorage.removeItem("totalPrice");
      localStorage.removeItem("totalWeight");
      // Dispatch auth change event for other components
      window.dispatchEvent(new Event("authChange"));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup happens automatically when component unmounts
  }
  
  return null; // This component doesn't render anything
}

export default async function RootLayout({ children }) {
  const copyright = await getCopyright();
  
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Identity Cards",
              url: "https://identitycards.co.in/",
              description: "Idcards, Plastic Cards, PVC Identity Cards, Holders, and Lanyards",
              image: "https://identitycards.co.in/idcards1.jpg"
            })
          }}
        />

        {/* Font Awesome for icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className={`min-h-screen flex flex-col bg-white text-gray-900`}>
        <CartProvider>
          {/* Browser close handler component */}
          <BrowserCloseHandler />
          {children}
          <Footer copyright={copyright} />
        </CartProvider>
        
        {/* Alternative: Using script tag for browser close handling */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('beforeunload', function() {
                  localStorage.removeItem("isSignedIn");
                  localStorage.removeItem("userId");
                  localStorage.removeItem("loginTime");
                  localStorage.removeItem("cartItems");
                  localStorage.removeItem("grandTotal");
                  localStorage.removeItem("shippingCost");
                  localStorage.removeItem("totalPrice");
                  localStorage.removeItem("totalWeight");
                window.dispatchEvent(new Event("authChange"));
              });
            `
          }}
        />
      </body>
    </html>
  );
}