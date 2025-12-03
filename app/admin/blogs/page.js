"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { DELETE_ADMIN_URL, READ_ADMIN_URL } from "@/libs/config";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Search / Sort / Pagination states
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${READ_ADMIN_URL}/blogs.php`);
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter blogs based on search query
  const filteredBlogs = useMemo(() => {
    if (!query) return blogs;
    const q = query.trim().toLowerCase();
    return blogs.filter((blog) => {
      return (
        String(blog.id).toLowerCase().includes(q) ||
        String(blog.title || "").toLowerCase().includes(q) ||
        String(blog.description || "").toLowerCase().includes(q)
      );
    });
  }, [blogs, query]);

  // Sort blogs
  const sortedBlogs = useMemo(() => {
    const arr = [...filteredBlogs];
    arr.sort((a, b) => {
      const A = (a[sortBy] ?? "").toString().toLowerCase();
      const B = (b[sortBy] ?? "").toString().toLowerCase();
      
      // Handle numeric fields specifically
      const numericFields = ["id"];
      if (numericFields.includes(sortBy) && !isNaN(Number(A)) && !isNaN(Number(B))) {
        return sortDir === "asc" ? Number(A) - Number(B) : Number(B) - Number(A);
      }
      
      // Handle date fields
      const dateFields = ["created_at", "updated_at"];
      if (dateFields.includes(sortBy)) {
        const dateA = new Date(A);
        const dateB = new Date(B);
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          return sortDir === "asc" ? dateA - dateB : dateB - dateA;
        }
      }
      
      // Text comparison
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredBlogs, sortBy, sortDir]);

  // Pagination
  const total = sortedBlogs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPageBlogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedBlogs.slice(start, start + pageSize);
  }, [sortedBlogs, page, pageSize]);

  // Toggle sort
  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;

    try {
      const res = await fetch(`${DELETE_ADMIN_URL}/blog.php?id=${id}`);
      const data = await res.json();
      alert(data.message);
      if (data.success) fetchBlogs(); // Refresh list
    } catch (err) {
      alert("Failed to delete blog");
      console.error(err);
    }
  };

  // Format date
  const formatDate = (value) => {
    if (!value) return "N/A";
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      const n = Number(value);
      if (!isNaN(n)) {
        const dd = new Date(n * (String(n).length > 10 ? 1 : 1000));
        return dd.toLocaleDateString();
      }
      return value;
    }
    return d.toLocaleDateString();
  };

  // Truncate text for description
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "No description";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const columns = [
    "id",
    "image", 
    "title", 
    "description", 
    "created_at", 
    "updated_at"
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Blogs</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by title, description..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="border px-3 py-2 rounded w-64"
          />

          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="border px-2 py-2 rounded"
          >
            {[5, 10, 20, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>

          <button
            onClick={() => { fetchBlogs(); }}
            className="cursor-pointer bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
            title="Refresh"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer select-none"
                  onClick={() => handleSort(col)}
                >
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{col.replace(/_/g, " ")}</span>
                    {sortBy === col && (sortDir === "asc" ? "▲" : "▼")}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : currentPageBlogs.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-gray-500">
                  {blogs.length === 0 ? "No blogs found." : "No matching blogs found."}
                </td>
              </tr>
            ) : (
              currentPageBlogs.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{row.id}</td>
                  
                  <td className="px-4 py-3">
                    {row.image ? (
                      <Image
                        width={80}
                        height={60}
                        priority
                        src={row.image?.startsWith("http") ? row.image : `/images/${row.image}`}
                        alt={row.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 font-medium max-w-xs">
                    {row.title || "Untitled"}
                  </td>

                  <td className="px-4 py-3 max-w-md">
                    <div 
                      className="text-sm text-gray-600"
                      title={row.description}
                    >
                      {truncateText(row.description, 120)}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {formatDate(row.created_at)}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {formatDate(row.updated_at)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        title="Edit Blog"
                        onClick={() => router.push(`/admin/blogs/edit/${row.id}`)}
                        className="cursor-pointer p-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        <FaEdit />
                      </button>
                      <button
                        title="Delete Blog"
                        onClick={() => handleDelete(row.id)}
                        className="cursor-pointer p-2 rounded bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {total > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            >
              {"<<"}
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Prev
            </button>

            <span className="px-3 py-1 border rounded bg-gray-50">
              Page {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            >
              {">>"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}