import EditBlogClient from './EditBlogClient';

// This runs on the server at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${READ_ADMIN_URL}/blogs.php`);
    if (!res.ok) {
      throw new Error('Failed to fetch blogs');
    }
    
    const data = await res.json();
    const blogs = Array.isArray(data) ? data : (data ? [data] : []);
    
    if (blogs.length === 0) {
      return [{ id: '1' }];
    }
    
    return blogs.map((blog) => ({
      id: blog.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ id: '1' }];
  }
}

// Optional: Add metadata
export const metadata = {
  title: 'Edit Blog',
  description: 'Edit blog post',
};

export default function EditBlogPage({ params }) {
  return <EditBlogClient id={params.id} />;
}