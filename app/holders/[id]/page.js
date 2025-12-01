import Link from "next/link";
import HolderDetails from "./HolderDetails";
import { DOMAIN_URL, BASE_URL, READ_URL, IMG_URL} from "@/libs/config";

// Generate static paths for all holders
export async function generateStaticParams() {
  try {
    const res = await fetch(`${READ_URL}/holders.php`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!res.ok) {
      console.error('Failed to fetch holders for static generation');
      return [];
    }
    
    const holders = await res.json();
    
    if (!Array.isArray(holders)) {
      return [];
    }
    
    return holders.map((holder) => ({
      id: holder.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    // Fetch specific holder data for metadata
    const res = await fetch(`${READ_URL}/holders.php?id=${id}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch holder for metadata');
    }
    
    const data = await res.json();
    
    let holder;
    if (Array.isArray(data)) {
      holder = data.find((c) => String(c.id) === String(id));
    } else {
      holder = data;
    }

    if (!holder) {
      return {
        title: "Holder Not Found | Identity Cards",
        description: "The requested card holder was not found.",
      };
    }

    // Create SEO-optimized metadata
    const metaDescription = holder.holder_detail 
      ? holder.holder_detail.slice(0, 160) + (holder.holder_detail.length > 160 ? "..." : "")
      : `Custom ${holder.holder_name} - High quality card holders for your business needs.`;

    const imageUrl = holder.images && holder.images[0]
      ? `${IMG_URL}/${holder.images[0]}`
      : `${BASE_URL}/default-holder.jpg`;

    return {
      title: `${holder.holder_name} | Custom Card Holders | Identity Cards`,
      description: metaDescription,
      keywords: generateHolderKeywords(holder.holder_name, holder.category),
      
      // Canonical URL
      alternates: {
        canonical: `${DOMAIN_URL}/holders/${id}`,
      },

      // Robots meta tags
      robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // OpenGraph
      openGraph: {
        title: `${holder.holder_name} | Custom Card Holders`,
        description: metaDescription,
        url: `${DOMAIN_URL}/holders/${id}`,
        type: "website",
        locale: "en_IN",
        siteName: "Identity Cards Company",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: holder.holder_name,
            type: "image/jpeg",
          },
        ],
      },

      // Twitter Card
      twitter: {
        card: "summary_large_image",
        title: `${holder.holder_name} | Custom Card Holders`,
        description: metaDescription,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Holder Details | Identity Cards",
      description: "View card holder details and customization options",
    };
  }
}

// Keyword function for card holders
function generateHolderKeywords(title, category = "") {
  if (!title) {
    return "card holders, id card holders, plastic holders, badge holders, card cases, id card cases";
  }

  const baseKeywords = [
    "card holders",
    "id card holders",
    "plastic holders", 
    "badge holders",
    "card cases",
    "id card cases",
    "lanyard holders",
    "security holders",
    "reusable holders",
    "custom holders"
  ];
  
  const titleKeywords = String(title)
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(word => word.length > 2 && !['holder', 'holders', 'card'].includes(word))
    .slice(0, 4)
    .map(word => `${word} holders`);
  
  const categoryKeywords = category ? [
    String(category).toLowerCase(),
    `${String(category).toLowerCase()} holders`
  ] : [];
  
  const allKeywords = [...new Set([
    ...titleKeywords,
    ...categoryKeywords, 
    ...baseKeywords
  ])];
  
  return allKeywords.slice(0, 15).join(', ');
}

// JSON-LD Structured Data for Holder Product
function HolderStructuredData({ holder, id }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": holder.holder_name,
    "description": holder.holder_detail || `Custom ${holder.holder_name} card holders`,
    "image": holder.images && holder.images[0] ? `${IMG_URL}/${holder.images[0]}` : "",
    "sku": `HOLDER-${id}`,
    "brand": {
      "@type": "Brand",
      "name": "Identity Cards Company"
    },
    "offers": {
      "@type": "Offer",
      "url": `${DOMAIN_URL}/holders/${id}`,
      "priceCurrency": "INR",
      "price": holder.price || "0.90",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Identity Cards Company"
      }
    },
    "category": holder.category || "Card Holders & Accessories"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Function to format features as comma-separated list
function formatFeatures(features) {
  if (!features) return "";
  
  if (typeof features === 'string' && features.includes(',')) {
    return features;
  }
  
  if (Array.isArray(features)) {
    return features.join(', ');
  }
  
  const featureString = String(features);
  const separators = ['\n', ';', '|', '-', '•'];
  
  for (const separator of separators) {
    if (featureString.includes(separator)) {
      return featureString
        .split(separator)
        .map(feature => feature.trim())
        .filter(feature => feature.length > 0)
        .join(', ');
    }
  }
  
  return featureString;
}

// Function to render star ratings
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return (
    <div className="flex items-center gap-1 text-yellow-500 text-xl">
      {"★".repeat(fullStars)}
      {hasHalfStar && "★"}
      {"☆".repeat(5 - Math.ceil(rating))}
    </div>
  );
}

async function getHolder(id) {
  try {
    const res = await fetch(`${READ_URL}/holders.php?id=${id}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch holder: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (Array.isArray(data)) {
      return data.find((c) => String(c.id) === String(id)) || null;
    }
    return data || null;
  } catch (error) {
    console.error("Error fetching holder:", error);
    return null;
  }
}

async function getReviews(holderId) {
  try {
    const res = await fetch(`${READ_URL}/reviews.php?product_id=${holderId}&category=holder`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch reviews: ${res.status}`);
    }

    const responseText = await res.text();
    
    if (responseText.includes('<br />') || responseText.includes('<b>')) {
      return [];
    }
    
    try {
      const reviewsData = JSON.parse(responseText);
      return Array.isArray(reviewsData) ? reviewsData : [];
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Network Error fetching reviews:", error);
    return [];
  }
}

export default async function Page({ params }) {
  const { id } = params;

  // Fetch holder data and reviews in parallel
  const [holder, reviews] = await Promise.all([
    getHolder(id),
    getReviews(id)
  ]);

  if (!holder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Holder not found</h2>
          <p className="text-gray-600 mb-4">The requested card holder could not be found.</p>
          <Link href="/holders" className="text-blue-600 hover:underline">
            Back to Holders
          </Link>
        </div>
      </div>
    );
  }

  // Format features as comma-separated list
  const formattedFeatures = formatFeatures(holder.feature);

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + (parseFloat(review.rating) || 0), 0) / reviews.length 
    : 0;

  return (
    <>
      <HolderStructuredData holder={holder} id={id} />
      <HolderDetails holder={holder} id={id} />
      
      {/* Additional Content Section */}
      <div className="container mx-auto p-6">
        {/* Title & Description */}
        <h1 className="text-4xl font-bold mb-3 text-gray-900 tracking-tight">
          {holder.holder_name}
        </h1>
        <p className="text-gray-600 mb-10 text-lg leading-relaxed">
          {holder.holder_detail}
        </p>

        {/* FEATURES */}
        {formattedFeatures && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <span className="text-green-600">✔</span> Key Features
            </h3>

            <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
              {formattedFeatures.split(",").map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl shadow-sm hover:shadow-md transition cursor-default"
                >
                  <span className="text-green-600 text-xl font-bold leading-none mt-1">
                    ✓
                  </span>
                  <span className="text-base">{feature.trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CUSTOMER REVIEWS */}
        <div className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              ⭐ Customer Reviews
            </h3>
            
            {/* Average Rating */}
            {reviews.length > 0 && (
              <div className="text-center bg-white p-4 rounded-xl shadow-md">
                <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                <div className="flex justify-center mt-1">
                  {renderStars(averageRating)}
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="p-6 border border-gray-200 rounded-2xl shadow-md bg-white hover:shadow-lg transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {review.user_name || 'Anonymous'}
                      </h4>
                      {review.created_at && (
                        <p className="text-gray-500 text-sm">
                          {new Date(review.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-start sm:justify-end">
                      {renderStars(parseFloat(review.rating) || 5)}
                    </div>
                  </div>
                  <p className="text-gray-600 text-base mt-3">
                    {review.review_text || 'No comment provided.'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-10 md:py-12 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">💬</div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
                No Reviews Yet
              </h4>
              <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                Be the first to share your experience with this product. Your review will help other customers make informed decisions.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}