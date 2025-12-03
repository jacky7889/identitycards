import CardsPage from "./CardsPage";
import { READ_URL, DOMAIN_URL, BASE_URL, IMG_URL} from "@/libs/config";

// Fetch cards data on the server
async function getCards() {
  try {
    const res = await fetch(`${READ_URL}/cards.php`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch cards');
    }
    
    const data = await res.json();
    
    // Ensure it's an array (same logic as your client component)
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data)) {
      return data;
    } else {
      console.error("Unexpected response:", data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching cards:', error);
    return [];
  }
}

export const metadata = {
  title: "PVC Cards | Custom Plastic & PVC ID Cards | High-Quality Cards in India",
  description: "Explore our premium PVC cards including employee cards, student ID cards, membership cards, event badges, and custom plastic cards. High-quality PVC cards with durable printing.",
  keywords: "pvc cards, plastic cards, custom pvc id cards, employee cards, student id cards, membership cards, pvc card printing india, access cards, event cards, corporate id cards",

  alternates: {
    canonical: `${DOMAIN_URL}/cards`,
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

  openGraph: {
    title: "PVC Cards | Premium Plastic Identity Cards",
    description: "Browse our range of PVC and plastic identity cards designed for businesses, schools, and corporate uses. Durable and fully customizable.",
    url: `${DOMAIN_URL}/cards`,
    type: "website",
    locale: "en_IN",
    siteName: "Identity Cards Company",
    images: [
      {
        url: `${BASE_URL}/cards-og.jpg`,
        width: 1200,
        height: 630,
        alt: "PVC ID Cards Collection",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "PVC Cards | Custom Printed PVC & Plastic ID Cards",
    description: "High-quality PVC and plastic identity cards printed with precision. Discover our full collection of durable ID cards.",
    images: [`${BASE_URL}/cards-og.jpg`],
  },
};

// JSON-LD Structured Data
function CardsStructuredData({ cards }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "PVC Cards Collection",
    "description": "Premium collection of custom PVC and plastic identity cards",
    "url": `${DOMAIN_URL}/cards`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": cards.length,
      "itemListOrder": "https://schema.org/ItemListUnordered",
      "itemListElement": cards.slice(0, 10).map((card, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": card.card_name || card.title,
          "description": card.card_detail || card.description,
          "url": `${DOMAIN_URL}/cards/${card.id}`,
          "image": card.images ? `${IMG_URL}/${card.images}` : ""
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
  const cards = await getCards();

  return (
    <>
      <CardsStructuredData cards={cards} />
      
      {/* Pass server-fetched data to client component */}
      <CardsPage initialCards={cards} />
    </>
  );
}