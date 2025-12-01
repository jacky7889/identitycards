"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { CREATE_ADMIN_URL, DELETE_ADMIN_URL, IMG_URL, READ_ADMIN_URL } from "@/libs/config";

export default function HoldersPage() {
  const [holders, setHolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    holder_name: "",
    holder_detail: "",
    price: "",
    color: "",
    feature: "",
    weight: "",
    quantity: "",
    amount: "",
    total: "",
  });
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Search / Sort / Pagination states
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const router = useRouter();
  
  // Fetch all holders
  const fetchHolders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${READ_ADMIN_URL}/holders.php`);
      const data = await res.json();
      setHolders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch holders:", err);
      setHolders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolders();
  }, []);

  // Filter holders based on search query
  const filteredHolders = useMemo(() => {
    if (!query) return holders;
    const q = query.trim().toLowerCase();
    return holders.filter((holder) => {
      return (
        String(holder.id).toLowerCase().includes(q) ||
        String(holder.holder_name || "").toLowerCase().includes(q) ||
        String(holder.holder_detail || "").toLowerCase().includes(q) ||
        String(holder.price || "").toLowerCase().includes(q) ||
        String(holder.color || "").toLowerCase().includes(q) ||
        String(holder.feature || "").toLowerCase().includes(q) ||
        String(holder.weight || "").toLowerCase().includes(q) ||
        String(holder.quantity || "").toLowerCase().includes(q) ||
        String(holder.amount || "").toLowerCase().includes(q) ||
        String(holder.total || "").toLowerCase().includes(q)
      );
    });
  }, [holders, query]);

  // Sort holders
  const sortedHolders = useMemo(() => {
    const arr = [...filteredHolders];
    arr.sort((a, b) => {
      const A = (a[sortBy] ?? "").toString().toLowerCase();
      const B = (b[sortBy] ?? "").toString().toLowerCase();
      
      // Handle numeric fields specifically
      const numericFields = ["id", "price", "weight", "quantity", "amount", "total"];
      if (numericFields.includes(sortBy) && !isNaN(Number(A)) && !isNaN(Number(B))) {
        return sortDir === "asc" ? Number(A) - Number(B) : Number(B) - Number(A);
      }
      
      // Text comparison
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredHolders, sortBy, sortDir]);

  // Pagination
  const total = sortedHolders.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPageHolders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedHolders.slice(start, start + pageSize);
  }, [sortedHolders, page, pageSize]);

  // Toggle sort
  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  // Handle new image uploads
  const handleAddImage = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setFiles((prev) => [...prev, ...selectedFiles]);
    setImages((prev) => [...prev, ...previews]);
  };

  // Remove selected image
  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Save new holder
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    for (const key in form) formData.append(key, form[key]);
    files.forEach((file) => formData.append("images[]", file));

    try {
      const res = await fetch(`${CREATE_ADMIN_URL}/holder.php`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) {
        setForm({
          holder_name: "",
          holder_detail: "",
          price: "",
          color: "",
          feature: "",
          weight: "",
          quantity: "",
          amount: "",
          total: "",
        });
        setImages([]);
        setFiles([]);
        setShowForm(false);
        fetchHolders();
      }
    } catch (error) {
      console.error("Error adding holder:", error);
      alert("Failed to add holder.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a holder
  const handleDelete = async (id) => {
    if (!confirm("Delete this holder?")) return;

    try {
      const res = await fetch(`${DELETE_ADMIN_URL}/holder.php?id=${id}`);
      const data = await res.json();
      alert(data.message);
      if (data.success) fetchHolders();
    } catch (err) {
      console.error(err);
      alert("Failed to delete holder.");
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return "N/A";
    const num = Number(value);
    return isNaN(num) ? value : `$${num.toFixed(2)}`;
  };

  const columns = [
    "id",
    "images",
    "holder_name",
    "holder_detail",
    "price",
    "color",
    "feature",
    "weight",    
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Holders</h1>

        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by name, color, feature..."
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
            onClick={() => { fetchHolders(); }}
            className="cursor-pointer bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
            title="Refresh"
          >
            Refresh
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {showForm ? "Hide Form" : "Add New Holder"}
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-6 mb-8 space-y-4"
        >
          {/* Upload Images */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Upload Images
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative border rounded overflow-hidden">
                  <Image
                    width={250}
                    height={200}
                    priority
                    src={img}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="cursor-pointer absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Upload Box */}
              <label className="border-2 border-dashed border-gray-400 flex items-center justify-center h-32 rounded cursor-pointer hover:bg-gray-50 col-span-full">
                <span className="text-gray-500 text-sm">
                  + Click to Upload Images
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAddImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Text Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Holder Name"
              className="border p-2 rounded"
              value={form.holder_name}
              onChange={(e) => setForm({ ...form, holder_name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Color"
              className="border p-2 rounded"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
            <input
              type="text"
              placeholder="Feature"
              className="border p-2 rounded"
              value={form.feature}
              onChange={(e) => setForm({ ...form, feature: e.target.value })}
            />
            <input
              type="text"
              placeholder="Weight"
              className="border p-2 rounded"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              className="border p-2 rounded"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
         </div>
         
          <textarea
            placeholder="Holder Details"
            className="border p-2 w-full rounded"
            value={form.holder_detail}
            onChange={(e) => setForm({ ...form, holder_detail: e.target.value })}
            rows={3}
          />

          <button
            disabled={isSaving}
            className={`${
              isSaving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-4 py-2 rounded w-full transition`}
          >
            {isSaving ? "Saving..." : "Save Holder"}
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
            ) : currentPageHolders.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-gray-500">
                  {holders.length === 0 ? "No holders found." : "No matching holders found."}
                </td>
              </tr>
            ) : (
              currentPageHolders.map((row) => {
                const imageUrl = Array.isArray(row.images) 
                  ? row.images[0] 
                  : row.images?.split(",")[0];
                
                return (
                  <tr key={row.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{row.id}</td>
                    <td className="px-4 py-3">
                      {imageUrl ? (
                        <Image
                          width={150}
                          height={100}
                          src={`${IMG_URL}/${imageUrl}`}
                          alt="holder"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{row.holder_name || "N/A"}</td>
                    <td className="px-4 py-3 max-w-xs truncate" title={row.holder_detail}>
                      {row.holder_detail || "N/A"}
                    </td>
                    <td className="px-4 py-3">{row.price}</td>
                    <td className="px-4 py-3">{row.color || "N/A"}</td>
                    <td className="px-4 py-3 max-w-xs truncate" title={row.feature}>
                      {row.feature || "N/A"}
                    </td>
                    <td className="px-4 py-3">{row.weight || "N/A"}</td>
                                                           
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="Edit"
                          onClick={() => router.push(`/admin/holders/edit/${row.id}`)}
                          className="cursor-pointer p-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          <FaEdit />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(row.id)}
                          className="cursor-pointer p-2 rounded bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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