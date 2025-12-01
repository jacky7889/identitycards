import { BASE_URL, DOMAIN_URL, IMG_URL, READ_URL } from "@/libs/config";
import LanyardDetails from "./LanyardDetails";

// Generate static paths for SSG
export async function generateStaticParams() {
  try {
    const res = await fetch(`${READ_URL}/lanyards.php`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!res.ok) {
      console.error('Failed to fetch lanyards for static generation');
      return [];
    }
    
    const lanyards = await res.json();
    
    // Return array of params for static generation
    return lanyards.map((lanyard) => ({
      id: lanyard.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  // Fetch lanyard data for metadata
  const res = await fetch(`${READ_URL}/lanyards.php`, {
    next: { revalidate: 3600 } // Cache for better performance
  });
  
  if (!res.ok) {
    return {
      title: "Lanyard Not Found | Identity Cards",
      description: "The requested lanyard was not found.",
    };
  }
  
  const lanyards = await res.json();
  const lanyard = lanyards?.find((c) => Number(c.id) === Number(id));

  if (!lanyard) {
    return {
      title: "Lanyard Not Found | Identity Cards",
      description: "The requested lanyard was not found.",
    };
  }

  // Create SEO-optimized metadata
  const metaDescription = lanyard.lanyard_detail 
    ? lanyard.lanyard_detail.slice(0, 160) + (lanyard.lanyard_detail.length > 160 ? "..." : "")
    : `Custom ${lanyard.lanyard_name} - High quality lanyards for your business needs.`;

  const imageUrl = lanyard.images 
    ? `${IMG_URL}/${lanyard.images}`
    : `${BASE_URL}/default-lanyard.jpg`;

  return {
    title: `${lanyard.lanyard_name} | Custom Lanyards | Identity Cards`,
    description: metaDescription,
    keywords: generateLanyardKeywords(lanyard.lanyard_name, lanyard.category),
    
    // Canonical URL
    alternates: {
      canonical: `${DOMAIN_URL}/lanyards/${id}`,
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
      title: `${lanyard.lanyard_name} | Custom Lanyards`,
      description: metaDescription,
      url: `${DOMAIN_URL}/lanyards/${id}`,
      type: "website",
      locale: "en_IN",
      siteName: "Identity Cards Company",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: lanyard.lanyard_name,
          type: "image/jpeg",
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: `${lanyard.lanyard_name} | Custom Lanyards`,
      description: metaDescription,
      images: [imageUrl],
    },
  };
}

// Keyword function for lanyards
function generateLanyardKeywords(title, category = "") {
  if (!title) {
    return "lanyards, custom lanyards, id card lanyards, neck lanyards, printed lanyards, promotional lanyards";
  }

  const baseKeywords = [
    "lanyards",
    "custom lanyards",
    "id card lanyards", 
    "neck lanyards",
    "printed lanyards",
    "promotional lanyards",
    "safety lanyards",
    "badge lanyards",
    "event lanyards",
    "corporate lanyards"
  ];
  
  const titleKeywords = String(title)
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(word => word.length > 2 && !['lanyard', 'lanyards'].includes(word))
    .slice(0, 4)
    .map(word => `${word} lanyards`);
  
  const categoryKeywords = category ? [
    String(category).toLowerCase(),
    `${String(category).toLowerCase()} lanyards`
  ] : [];
  
  const allKeywords = [...new Set([
    ...titleKeywords,
    ...categoryKeywords, 
    ...baseKeywords
  ])];
  
  return allKeywords.slice(0, 15).join(', ');
}

// JSON-LD Structured Data for Lanyard Product
function LanyardStructuredData({ lanyard, id }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": lanyard.lanyard_name,
    "description": lanyard.lanyard_detail || `Custom ${lanyard.lanyard_name} lanyards`,
    "image": lanyard.images ? `${IMG_URL}/${lanyard.images}` : "",
    "sku": `LANYARD-${id}`,
    "brand": {
      "@type": "Brand",
      "name": "Identity Cards Company"
    },
    "offers": {
      "@type": "Offer",
      "url": `${DOMAIN_URL}/lanyards/${id}`,
      "priceCurrency": "INR",
      "price": "0",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Identity Cards Company"
      }
    },
    "category": lanyard.category || "Lanyards & Holders"
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
  
  // If it's already a string with commas, return as is
  if (typeof features === 'string' && features.includes(',')) {
    return features;
  }
  
  // If it's an array, join with commas
  if (Array.isArray(features)) {
    return features.join(', ');
  }
  
  // If it's a string without commas, try to split by common separators
  const featureString = String(features);
  
  // Try different separators
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
  
  // If no separators found, return as single item
  return featureString;
}

// Function to render star ratings
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return (
    <div 
      className="flex items-center gap-1 text-yellow-500 text-xl"
      aria-label={`Rating: ${rating} out of 5 stars`}
    >
      {"★".repeat(fullStars)}
      {hasHalfStar && "★"}
      {"☆".repeat(5 - Math.ceil(rating))}
    </div>
  );
}

// Enhanced fetch with error handling
async function fetchLanyards() {
  try {
    const res = await fetch(`${READ_URL}/lanyards.php`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch lanyards: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching lanyards:', error);
    return [];
  }
}

async function fetchReviews(productId) {
  try {
    const res = await fetch(`${READ_URL}/reviews.php?product_id=${productId}&category=lanyard`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) {
      return [];
    }

    const responseText = await res.text();
    
    // Check if response contains HTML error
    if (responseText.includes('<br />') || responseText.includes('<b>')) {
      return [];
    }

    const reviewsData = JSON.parse(responseText);
    return Array.isArray(reviewsData) ? reviewsData : [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export default async function Page({ params }) {
  const { id } = await params;

  // Fetch data in parallel for better performance
  const [lanyards, reviews] = await Promise.all([
    fetchLanyards(),
    fetchReviews(id)
  ]);

  const lanyard = lanyards?.find((c) => Number(c.id) === Number(id));

  if (!lanyard) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500">Lanyard not found</h2>
        <p className="text-gray-600 mt-2">The requested lanyard could not be found.</p>
      </div>
    );
  }

  // Format features as comma-separated list
  const formattedFeatures = formatFeatures(lanyard.feature);

  // Calculate average rating with validation
  const validReviews = reviews.filter(review => 
    review.user_name && 
    review.rating && 
    parseFloat(review.rating) >= 1 && 
    parseFloat(review.rating) <= 5
  );

  const averageRating = validReviews.length > 0 
    ? validReviews.reduce((sum, review) => sum + parseFloat(review.rating), 0) / validReviews.length 
    : 0;

  return (
    <>
      {/* Add JSON-LD Structured Data */}
      <LanyardStructuredData lanyard={lanyard} id={id} />
      
      {/* Pass lanyard data to client component for interactivity */}
      <LanyardDetails lanyard={lanyard} id={id} />
      
      {/* Reviews */}
      <div className="container mx-auto p-6">
        {/* Title & Description */}
        <h1 className="text-4xl font-bold mb-3 text-gray-900 tracking-tight">
          {lanyard.lanyard_name}
        </h1>
        <p className="text-gray-600 mb-10 text-lg leading-relaxed">
          {lanyard.lanyard_detail}
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              ⭐ Customer Reviews
            </h3>
            
            {/* Average Rating */}
            {validReviews.length > 0 && (
              <div className="text-center bg-white p-4 rounded-xl shadow-md">
                <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                <div className="flex items-center gap-1 text-yellow-500 text-lg">
                  {renderStars(averageRating)}
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Based on {validReviews.length} review{validReviews.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {validReviews.length > 0 ? (
            <div className="space-y-6">
              {validReviews.map((review) => (
                <div 
                  key={review.id} 
                  className="p-6 border border-gray-200 rounded-2xl shadow-md bg-white hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between mb-2">
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
                    <div className="text-yellow-500 text-xl tracking-tight">
                      {renderStars(parseFloat(review.rating))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-base">
                    {review.review_text || 'No comment provided.'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            // No reviews message
            <div className="text-center py-8 sm:py-10 md:py-12 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 sm:mx-0">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">💬</div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 px-4 sm:px-0">
                No Reviews Yet
              </h4>
              <p className="text-gray-500 max-w-xs sm:max-w-full mx-auto px-4 sm:px-0 text-sm sm:text-base leading-relaxed">
                Be the first to share your experience with this product. Your review will help other customers make informed decisions.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}