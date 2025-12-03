"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IMG_URL } from "@/libs/config";

export default function BlogClient({ blogs }) {
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

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

  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition"
      >
        ← Prev
      </button>
    );

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-blue-50 transition"
        >
          1
        </button>
      );

      if (startPage > 2)
        pages.push(<span key="ellipsis1" className="px-2">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg border transition ${
            currentPage === i
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-300 hover:bg-blue-50"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1)
        pages.push(<span key="ellipsis2" className="px-2">...</span>);

      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-blue-50 transition"
        >
          {totalPages}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition"
      >
        Next →
      </button>
    );

    return pages;
  };

  if (!blogs.length) {
    return (
      <section className="py-20 container mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Latest <span className="text-blue-600">Blogs</span>
        </h1>
        <p className="text-gray-500 text-lg">No blogs available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="py-20 container mx-auto px-6">
      <h1 className="text-4xl font-bold text-center mb-12">
        Latest <span className="text-blue-600">Blogs</span>
      </h1>

      {/* Blog Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {currentBlogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.id}`}
            className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
          >
            <div className="relative h-60 w-full">
              <Image
                src={`${IMG_URL}/${blog.image}`}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center text-xs text-gray-500 mb-3 space-x-3">
                <span className="flex items-center">{timeAgo(blog.date)}</span>
                <span className="flex items-center">{blog.author || "Admin"}</span>
              </div>

              <h2 className="text-lg font-bold mb-3 leading-tight group-hover:text-blue-600 transition line-clamp-2">
                {blog.title}
              </h2>

              <p className="text-gray-600 line-clamp-3 mb-4 text-sm flex-grow">
                {blog.description}
              </p>

              <div className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-auto">
                Read More →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center space-y-4">
        <p className="text-gray-600 text-sm">
          Showing {startIndex + 1}-{Math.min(startIndex + blogsPerPage, blogs.length)} of {blogs.length} blogs
        </p>

        <div className="flex items-center space-x-2 flex-wrap justify-center">
          {renderPagination()}
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <span className="text-sm text-gray-600">Go to page:</span>
          <select
            value={currentPage}
            onChange={(e) => handlePageChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg"
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <option key={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
