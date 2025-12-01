import Image from "next/image";
import Link from "next/link";
import { READ_URL, BASE_URL, DOMAIN_URL, IMG_URL } from "@/libs/config";

// timeAgo function (runs on server)
function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

async function getBlog(id) {
  try {
    const res = await fetch(
      `${READ_URL}/blogs.php?id=${id}`,
      { next: { revalidate: 3600 } } // Use revalidate instead of no-store for static export
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch blog: ${res.status}`);
    }

    const data = await res.json();

    if (data && data.id) return data;
    if (Array.isArray(data)) {
      return data.find((b) => String(b.id) === String(id)) || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

async function getRelatedBlogs(currentId) {
  try {
    const res = await fetch(`${READ_URL}/blogs.php`, {
      next: { revalidate: 3600 } // Use revalidate for static export
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.status}`);
    }

    const all = await res.json();

    if (!Array.isArray(all)) return [];

    return all
      .filter((b) => String(b.id) !== String(currentId))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return [];
  }
}

// Generate static paths for all blogs - FIXED VERSION
export async function generateStaticParams() {
  try {
    const res = await fetch(`${READ_URL}/blogs.php`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!res.ok) {
      console.error('Failed to fetch blogs for static generation');
      return [];
    }

    const blogs = await res.json();
    
    // Handle different response formats
    let blogArray = [];
    
    if (Array.isArray(blogs)) {
      blogArray = blogs;
    } else if (blogs && typeof blogs === 'object') {
      // If it's a single object, wrap it in array
      blogArray = [blogs];
    }
    
    console.log(`Generating static params for ${blogArray.length} blogs`);
    
    return blogArray.map((blog) => ({
      id: blog.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate dynamic metadata for each blog
export async function generateMetadata({ params }) {
  const { id } = params;
  const blog = await getBlog(id);

  if (!blog) {
    return {
      title: "Blog Not Found | Identity Cards",
      description: "The requested blog post was not found.",
    };
  }

  // Truncate description for meta tags
  const metaDescription = blog.description 
    ? blog.description.slice(0, 160) + (blog.description.length > 160 ? "..." : "")
    : "Read this informative blog post about ID cards and identity solutions.";

  const imageUrl = blog.image 
    ? `${BASE_URL}/${blog.image}`
    : `${IMG_URL}/default-blog.jpg`;

  return {
    title: `${blog.title} | Identity Cards Blog`,
    description: metaDescription,
    keywords: blog.tags || "id cards, pvc cards, identity solutions, employee cards, student id",
    
    // Canonical URL
    alternates: {
      canonical: `${DOMAIN_URL}/blogs/${id}`,
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
      title: blog.title,
      description: metaDescription,
      url: `${DOMAIN_URL}/blogs/${id}`,
      type: "article",
      locale: "en_IN",
      siteName: "Identity Cards Company",
      publishedTime: blog.date,
      authors: [blog.author || "Admin"],
      tags: blog.tags ? blog.tags.split(',').map(tag => tag.trim()) : ["ID Cards"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
          type: "image/jpeg",
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: metaDescription,
      images: [imageUrl],
    },

    // Additional article structured data
    other: {
      "article:published_time": blog.date,
      "article:author": blog.author || "Admin",
      "article:section": "Identity Solutions",
    },
  };
}

// JSON-LD Structured Data for better SEO
function BlogStructuredData({ blog }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.description,
    "image": blog.image ? `${IMG_URL}/${blog.image}` : "",
    "datePublished": blog.date,
    "dateModified": blog.date,
    "author": {
      "@type": "Person",
      "name": blog.author || "Admin"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Identity Cards Company",
      "logo": {
        "@type": "ImageObject",
        "url": `${DOMAIN_URL}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${DOMAIN_URL}/blogs/${blog.id}`
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Add dynamic params export for fallback behavior
export const dynamicParams = true; // Set to false if you want to 404 for non-generated paths

export default async function BlogDetail({ params }) {
  const { id } = params;

  const blog = await getBlog(id);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Blog not found</h2>
          <Link href="/blogs" className="text-blue-600 hover:underline">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const relatedBlogs = await getRelatedBlogs(blog.id);

  return (
    <>
      {/* Add JSON-LD Structured Data */}
      <BlogStructuredData blog={blog} />
      
      <section className="py-20 container mx-auto px-6">
        <Link href="/blogs" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Blogs
        </Link>

        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

        {/* IMAGE */}
        {blog.image && (
          <div className="relative rounded-xl mb-6 overflow-hidden">
            <Image
              src={`${IMG_URL}/${blog.image}`}
              alt={blog.title}
              width={900}
              height={500}
              className="w-full object-cover"
            />

            {/* META */}
            <div className="absolute bottom-0 right-0 bg-black/70 text-white px-4 py-2 rounded-tl-xl">
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {timeAgo(blog.date)}
                </span>

                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {blog.author || "Admin"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAGS */}
        {blog.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.split(',').map((tag, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* CONTENT */}
        <div className="prose prose-lg max-w-none mb-16">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {blog.content || blog.description}
          </p>
        </div>

        {/* RELATED BLOGS */}
        {relatedBlogs.length > 0 && (
          <RelatedBlogs relatedBlogs={relatedBlogs} />
        )}

        <div className="flex justify-center mt-12">
          <Link 
            href="/blogs" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            View All Blogs
          </Link>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------
   REUSABLE SSR RELATED BLOG COMPONENT
------------------------------------------- */
function RelatedBlogs({ relatedBlogs }) {
  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Related <span className="text-blue-600">Blogs</span>
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedBlogs.map((b) => (
          <Link 
            key={b.id} 
            href={`/blogs/${b.id}`}
            className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100 h-full"
          >
            <div className="relative h-60 w-full">
              <Image
                src={b.image ? `${BASE_URL}/${b.image}` : `${IMG_URL}/default-blog.jpg`}
                alt={b.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center text-xs text-gray-500 mb-3 space-x-3">
                <span className="flex items-center">
                  {timeAgo(b.date)}
                </span>
                <span className="flex items-center">
                  {b.author || "Admin"}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                {b.title}
              </h3>

              <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4 text-sm flex-grow">
                {b.description}
              </p>

              <div className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 mt-auto shadow-md hover:shadow-lg">
                Read More
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}