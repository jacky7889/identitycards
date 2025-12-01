"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { CREATE_ADMIN_URL, DELETE_ADMIN_URL, IMG_URL, READ_ADMIN_URL } from "@/libs/config";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    buttonText: "",
    display_order: "",
    status: "active",
    displayDetails: ""
  });
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Search / Sort / Pagination states
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const router = useRouter();
  
  // Fetch banners
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${READ_ADMIN_URL}/banners.php`);
      const data = await res.json();
      console.log("Banners data:", data);
      setBanners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch banners:", err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Filter banners based on search query
  const filteredBanners = useMemo(() => {
    if (!query) return banners;
    const q = query.trim().toLowerCase();
    return banners.filter((banner) => {
      return (
        String(banner.id).toLowerCase().includes(q) ||
        String(banner.title || "").toLowerCase().includes(q) ||
        String(banner.description || "").toLowerCase().includes(q) ||
        String(banner.buttonText || "").toLowerCase().includes(q) ||
        String(banner.displayOrder || "").toLowerCase().includes(q) ||
        String(banner.status || "").toLowerCase().includes(q) ||
        String(banner.displayDetails || "").toLowerCase().includes(q)
      );
    });
  }, [banners, query]);

  // Sort banners
  const sortedBanners = useMemo(() => {
    const arr = [...filteredBanners];
    arr.sort((a, b) => {
      const A = (a[sortBy] ?? "").toString().toLowerCase();
      const B = (b[sortBy] ?? "").toString().toLowerCase();
      
      // Handle numeric fields specifically
      const numericFields = ["id", "display_order", "displayOrder"];
      if (numericFields.includes(sortBy) && !isNaN(Number(A)) && !isNaN(Number(B))) {
        return sortDir === "asc" ? Number(A) - Number(B) : Number(B) - Number(A);
      }
      
      // Handle status field with custom ordering
      if (sortBy === "status") {
        const statusOrder = { 'active': 1, 'inactive': 2 };
        const orderA = statusOrder[A] || 3;
        const orderB = statusOrder[B] || 3;
        return sortDir === "asc" ? orderA - orderB : orderB - orderA;
      }
      
      // Text comparison
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredBanners, sortBy, sortDir]);

  // Pagination
  const total = sortedBanners.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPageBanners = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedBanners.slice(start, start + pageSize);
  }, [sortedBanners, page, pageSize]);

  // Toggle sort
  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  // Handle single image upload
  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const preview = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setImage(preview);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImage(null);
    setFile(null);
  };

  // Save new banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.title.trim()) {
      alert("Please enter a banner title");
      return;
    }
    
    if (!file) {
      alert("Please upload a banner image");
      return;
    }

    setIsSaving(true);

    const formData = new FormData();
    for (const key in form) formData.append(key, form[key]);
    formData.append("image", file); // Single image

    try {
      const res = await fetch(`${CREATE_ADMIN_URL}/banner.php`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) {
        setForm({
          title: "",
          description: "",
          buttonText: "",
          display_order: "",
          status: "active",
          displayDetails: ""
        });
        setImage(null);
        setFile(null);
        setShowForm(false);
        fetchBanners();
      }
    } catch (error) {
      console.error("Error adding banner:", error);
      alert("Failed to add banner.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a banner
  const handleDelete = async (id) => {
    if (!confirm("Delete this banner?")) return;

    try {
      const res = await fetch(`${DELETE_ADMIN_URL}/banner.php?id=${id}`);
      const data = await res.json();
      alert(data.message);
      if (data.success) fetchBanners();
      router.push('/admin/banners')
    } catch (err) {
      console.error(err);
      alert("Failed to delete banner.");
    }
  };

  // Format status with color coding
  const formatStatus = (status) => {
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          status === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {status || "N/A"}
      </span>
    );
  };

  // Truncate text for descriptions - FIXED VERSION
  const truncateText = (text, maxLength = 80) => {
    if (!text || typeof text !== 'string') return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const columns = [
    "id",
    "image",
    "title",
    "description",
    "buttonText",
    "displayOrder",
    "status",
    "displayDetails"
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Banners</h1>

        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by title, description, status..."
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
            onClick={() => { fetchBanners(); }}
            className="cursor-pointer bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
            title="Refresh"
          >
            Refresh
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {showForm ? "Hide Form" : "Add New Banner"}
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-6 mb-8 space-y-4"
        >
          {/* Upload Single Image */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Upload Banner Image (Single Image Only)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {image ? (
                <div className="relative border rounded overflow-hidden">
                  <Image
                    width={300}
                    height={200}
                    priority
                    src={image}
                    alt="Banner Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-400 flex flex-col items-center justify-center h-48 rounded cursor-pointer hover:bg-gray-50 transition">
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-500 text-sm text-center px-2">
                    Click to Upload Banner Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Text Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Banner Title *
              </label>
              <input
                type="text"
                placeholder="Enter banner title"
                className="border p-2 rounded w-full"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Button Text
              </label>
              <input
                type="text"
                placeholder="Button text (e.g., Get Started)"
                className="border p-2 rounded w-full"
                value={form.buttonText}
                onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Display Order
              </label>
              <input
                type="number"
                placeholder="Order number"
                className="border p-2 rounded w-full"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Status
              </label>
              <select
                className="border p-2 rounded w-full"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Banner Description
            </label>
            <textarea
              placeholder="Enter banner description"
              className="border p-2 w-full rounded"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Display Details
            </label>
            <textarea
              placeholder="Additional display details"
              className="border p-2 w-full rounded"
              value={form.displayDetails}
              onChange={(e) => setForm({ ...form, displayDetails: e.target.value })}
              rows="2"
            />
          </div>

          <button
            disabled={isSaving}
            className={`${
              isSaving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-4 py-3 rounded w-full transition font-medium`}
          >
            {isSaving ? "Creating Banner..." : "Create Banner"}
          </button>
        </form>
      )}

      {/* Data Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer select-none whitespace-nowrap"
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
            ) : currentPageBanners.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-gray-500">
                  {banners.length === 0 ? "No banners found." : "No matching banners found."}
                </td>
              </tr>
            ) : (
              currentPageBanners.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{row.id}</td>
                  
                  <td className="px-4 py-3">
                    {row.image ? (
                      <Image
                        width={250}
                        height={200}
                        src={`${IMG_URL}/${row.image}`}
                        alt="banner"
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 font-medium max-w-xs">
                    {row.title || "N/A"}
                  </td>

                  <td className="px-4 py-3 max-w-xs">
                    <div title={row.description || ""}>
                      {truncateText(row.description)}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {row.buttonText || "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    {row.displayOrder || "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    {formatStatus(row.status)}
                  </td>

                  <td className="px-4 py-3 max-w-xs">
                    <div title={row.displayDetails || ""}>
                      {truncateText(row.displayDetails)}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        title="Edit Banner"
                        onClick={() => router.push(`/admin/banners/edit/${row.id}`)}
                        className="cursor-pointer p-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        title="Delete Banner"
                        onClick={() => handleDelete(row.id)}
                        className="cursor-pointer p-2 rounded bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <FaTrash size={16} />
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