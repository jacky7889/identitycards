import BlogStructuredData from "./BlogStructuredData";
import BlogHeader from "./BlogHeader";
import BlogImage from "./BlogImage";
import BlogTags from "./BlogTags";
import BlogContent from "./BlogContent";
import RelatedBlogs from "./RelatedBlogs";
import { getBlog, getRelatedBlogs } from "../blogUtils";

export default async function BlogDetailContent({ id }) {
  const [blog, relatedBlogs] = await Promise.all([
    getBlog(id),
    getRelatedBlogs(id)
  ]);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Blog not found</h2>
          <a href="/blogs" className="text-blue-600 hover:underline">
            Back to Blogs
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <BlogStructuredData blog={blog} />
      
      <section className="py-20 container mx-auto px-6">
        <BlogHeader />
        
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

        <BlogImage blog={blog} />
        
        <BlogTags tags={blog.tags} />
        
        <BlogContent content={blog.content || blog.description} />
        
        {relatedBlogs.length > 0 && (
          <RelatedBlogs relatedBlogs={relatedBlogs} />
        )}

        <div className="flex justify-center mt-12">
          <a 
            href="/blogs" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            View All Blogs
          </a>
        </div>
      </section>
    </>
  );
}