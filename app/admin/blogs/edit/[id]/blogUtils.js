import { READ_URL, BASE_URL, DOMAIN_URL, IMG_URL } from "@/libs/config";

// Generate static paths for all blogs
export async function generateStaticParams() {
  try {
    const res = await fetch(`${READ_URL}/blogs.php`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      console.error('Failed to fetch blogs for static generation');
      return [];
    }

    const blogs = await res.json();
    
    let blogArray = [];
    
    if (Array.isArray(blogs)) {
      blogArray = blogs;
    } else if (blogs && typeof blogs === 'object') {
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
    
    alternates: {
      canonical: `${DOMAIN_URL}/blogs/${id}`,
    },

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

    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: metaDescription,
      images: [imageUrl],
    },

    other: {
      "article:published_time": blog.date,
      "article:author": blog.author || "Admin",
      "article:section": "Identity Solutions",
    },
  };
}

// Data fetching functions
export async function getBlog(id) {
  try {
    const res = await fetch(
      `${READ_URL}/blogs.php?id=${id}`,
      { next: { revalidate: 3600 } }
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

export async function getRelatedBlogs(currentId) {
  try {
    const res = await fetch(`${READ_URL}/blogs.php`, {
      next: { revalidate: 3600 }
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