import LanyardsPage from "./LanyardsPage";
import { DOMAIN_URL,BASE_URL, READ_URL, IMG_URL} from "@/libs/config";

// Fetch lanyards data on the server
async function getLanyards() {
  try {
    const res = await fetch(`${READ_URL}/lanyards.php`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch lanyards');
    }
    
    const data = await res.json();
    
    // Ensure valid array (same logic as your client component)
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.error("Unexpected response:", data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching lanyards:', error);
    return [];
  }
}

export const metadata = {
  title: "Lanyards / Neck Dori | High-Quality ID Card Lanyards at Best Prices",
  description: "Buy premium-quality lanyards and neck dori for employee ID cards, school ID cards, and event badges. Available in plain, printed, and customized options at affordable prices.",
  keywords: "lanyards, neck dori, id card lanyards, custom lanyards, printed lanyards, polyester lanyards, id card accessories, neck dori for id cards, corporate lanyards, event lanyards",

  openGraph: {
    title: "Lanyards / Neck Dori | Premium ID Card Lanyards – Plain & Custom Printed",
    description: "Explore durable lanyards and neck dori perfect for office ID cards, schools, and events. Get custom logo printing and bulk order discounts.",
    url: `${DOMAIN_URL}/lanyards`,
    type: "website",
    locale: "en_IN",
    siteName: "Identity Cards Company",
    images: [
      {
        url: `${BASE_URL}/lanyards-og.jpg`,
        width: 1200,
        height: 630,
        alt: "ID Card Lanyards and Neck Dori",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Lanyards / Neck Dori | Premium Quality ID Card Lanyards",
    description: "Shop plain, printed, and custom lanyards for ID cards. Affordable and durable neck dori for office, school, and corporate use.",
    images: [`${BASE_URL}/lanyards-og.jpg`],
  },

  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: `${DOMAIN_URL}/lanyards`,
  },
};

// JSON-LD Structured Data for Lanyards Collection
function LanyardsStructuredData({ lanyards }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Lanyards Collection",
    "description": "Premium collection of ID card lanyards and neck dori for various organizational needs",
    "url": `${DOMAIN_URL}/lanyards`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": lanyards.length,
      "itemListOrder": "https://schema.org/ItemListUnordered",
      "itemListElement": lanyards.slice(0, 10).map((lanyard, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": lanyard.lanyard_name || lanyard.title,
          "description": lanyard.lanyard_detail || lanyard.description,
          "url": `${DOMAIN_URL}/lanyards/${lanyard.id}`,
          "image": lanyard.images ? `${IMG_URL}/${lanyard.images}` : ""
        }
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default async function Page() {
  // Fetch data on the server and pass to client component
  const lanyards = await getLanyards();

  return (
    <>
      <LanyardsStructuredData lanyards={lanyards} />
      
      {/* Pass server-fetched data to client component */}
      <LanyardsPage initialLanyards={lanyards} />
    </>
  );
}