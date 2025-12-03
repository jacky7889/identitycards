import HoldersPage from "./HoldersPage";
import { DOMAIN_URL,BASE_URL, READ_URL, IMG_URL} from "@/libs/config";

// Fetch holders data on the server
async function getHolders() {
  try {
    const res = await fetch(`${READ_URL}/holders.php`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch holders');
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
    console.error('Error fetching holders:', error);
    return [];
  }
}

export const metadata = {
  title: "ID Card Holders | PVC, Plastic, Transparent & Multi-Color Holders",
  description: "Explore a wide range of ID card holders including PVC, plastic, vertical, horizontal, transparent, and premium card holders for staff and students.",
  keywords: "id card holders, plastic card holder, pvc holder, transparent holder, vertical holder, horizontal holder, identity card holder, badge holders, card cases, id card accessories",

  alternates: {
    canonical: `${DOMAIN_URL}/holders`,
  },

  openGraph: {
    title: "ID Card Holders | Premium PVC & Plastic Holders",
    description: "Shop durable and stylish ID card holders for offices, schools, corporates, and events.",
    url: `${DOMAIN_URL}/holders`,
    type: "website",
    locale: "en_IN",
    siteName: "Identity Cards Company",
    images: [
      {
        url: `${BASE_URL}/holders-og.jpg`,
        width: 1200,
        height: 630,
        alt: "PVC and Plastic ID Card Holders",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ID Card Holders | PVC, Plastic & Transparent Holders",
    description: "Durable and stylish ID card holders for office, school, and corporate use.",
    images: [`${BASE_URL}/holders-og.jpg`],
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
};

// JSON-LD Structured Data for Holders Collection
function HoldersStructuredData({ holders }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "ID Card Holders Collection",
    "description": "Premium collection of PVC and plastic ID card holders for various organizational needs",
    "url": `https://identitycards.co.in/holders`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": holders.length,
      "itemListOrder": "https://schema.org/ItemListUnordered",
      "itemListElement": holders.slice(0, 10).map((holder, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": holder.holder_name || holder.title,
          "description": holder.holder_detail || holder.description,
          "url": `${DOMAIN_URL}/holders/${holder.id}`,
          "image": holder.images ? `${IMG_URL}/${holder.images}` : ""
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
  const holders = await getHolders();

  return (
    <>
      <HoldersStructuredData holders={holders} />
      
      {/* Pass server-fetched data to client component */}
      <HoldersPage initialHolders={holders} />
    </>
  );
}