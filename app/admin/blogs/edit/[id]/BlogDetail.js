import Link from "next/link";
import Image from "next/image";
import { BASE_URL, IMG_URL } from "@/libs/config";
import { timeAgo } from "../utils/dateUtils";

export default function RelatedBlogs({ relatedBlogs }) {
  if (!relatedBlogs.length) return null;

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Related <span className="text-blue-600">Blogs</span>
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedBlogs.map((blog) => (
          <Link 
            key={blog.id} 
            href={`/blogs/${blog.id}`}
            className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100 h-full"
          >
            <div className="relative h-60 w-full">
              <Image
                src={blog.image ? `${BASE_URL}/${blog.image}` : `${IMG_URL}/default-blog.jpg`}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center text-xs text-gray-500 mb-3 space-x-3">
                <span className="flex items-center">
                  {timeAgo(blog.date)}
                </span>
                <span className="flex items-center">
                  {blog.author || "Admin"}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                {blog.title}
              </h3>

              <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4 text-sm flex-grow">
                {blog.description}
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