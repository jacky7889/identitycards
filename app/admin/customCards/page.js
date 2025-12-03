"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaDownload, FaEye } from "react-icons/fa";
import { DELETE_ADMIN_URL, IMG_URL, READ_ADMIN_URL, UPDATE_ADMIN_URL } from "@/libs/config";
import Image from "next/image";

export default function BannersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search / Sort / Pagination / Bulk
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc"); // 'asc' | 'desc'
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectAllOnPage, setSelectAllOnPage] = useState(false);

  // Modal / Preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);

  // UI states
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [updatingStatusFor, setUpdatingStatusFor] = useState(null);

  const router = useRouter();
  
  // Fetch data
  const fetchRows = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${READ_ADMIN_URL}/custom_card_downloads.php`);
      const data = await res.json();
      // Expecting an array of objects with fields:
      // id, userId, cc_images, cc_count, download_type, status, created_at (optional)
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  // Derived & filtered rows
  const filteredRows = useMemo(() => {
    if (!query) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      // check few columns
      return (
        String(r.id).toLowerCase().includes(q) ||
        String(r.userId || "").toLowerCase().includes(q) ||
        String(r.cc_images || "").toLowerCase().includes(q) ||
        String(r.cc_count || "").toLowerCase().includes(q) ||
        String(r.download_type || "").toLowerCase().includes(q) ||
        String(r.status || "").toLowerCase().includes(q)
      );
    });
  }, [rows, query]);

  // Sorting
  const sortedRows = useMemo(() => {
    const arr = [...filteredRows];
    arr.sort((a, b) => {
      const A = (a[sortBy] ?? "").toString().toLowerCase();
      const B = (b[sortBy] ?? "").toString().toLowerCase();
      if (!isNaN(Number(A)) && !isNaN(Number(B))) {
        // numeric compare
        return sortDir === "asc" ? Number(A) - Number(B) : Number(B) - Number(A);
      }
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredRows, sortBy, sortDir]);

  // Pagination
  const total = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, page, pageSize]);

  // Toggle sort
  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  // Checkbox handlers
  const toggleRowSelect = (id) => {
    const s = new Set(selectedIds);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelectedIds(s);
    setSelectAllOnPage(false);
  };

  const toggleSelectAllOnPage = () => {
    const newSet = new Set(selectedIds);
    if (selectAllOnPage) {
      // unselect all visible
      currentPageRows.forEach((r) => newSet.delete(r.id));
      setSelectAllOnPage(false);
    } else {
      // select all visible
      currentPageRows.forEach((r) => newSet.add(r.id));
      setSelectAllOnPage(true);
    }
    setSelectedIds(newSet);
  };

  // Single delete (existing)
  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;
    try {
      const res = await fetch(`${DELETE_ADMIN_URL}/custom_card_downloads.php?id=${id}`);
      const data = await res.json();
      alert(data.message || "Deleted");
      if (data.success) fetchRows();
    } catch (err) {
      console.error(err);
      alert("Failed to delete.");
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      alert("Select at least one record to delete.");
      return;
    }
    if (!confirm("Delete selected records?")) return;

    setIsBulkDeleting(true);
    try {
      const ids = Array.from(selectedIds);
      const res = await fetch(`${DELETE_ADMIN_URL}/custom_card_downloads.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      alert(data.message || "Deleted selected records");
      if (data.success) {
        setSelectedIds(new Set());
        setSelectAllOnPage(false);
        fetchRows();
      }
    } catch (err) {
      console.error(err);
      alert("Bulk delete failed");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  // Status toggle
  const toggleStatus = async (row) => {
    const newStatus = row.status === "active" ? "inactive" : "active";
    setUpdatingStatusFor(row.id);
    try {
      const res = await fetch(`${UPDATE_ADMIN_URL}/custom_card_status.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // update in-place
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: newStatus } : r)));
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    } finally {
      setUpdatingStatusFor(null);
    }
  };

  // Image preview - handles comma-separated filenames too
  const openPreview = (row) => {
    const imgs = (row.cc_images || "")
      .split?.(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((fname) => `${IMG_URL}/customcards/${row.userId}_user/${fname}`);

    if (imgs.length === 0) {
      alert("No images to preview");
      return;
    }
    setPreviewImages(imgs);
    setPreviewIndex(0);
    setPreviewOpen(true);
  };

  // Download single file - opens in new tab (user can save)
  const handleDownload = (row) => {
    const imgs = (row.cc_images || "").split?.(",").map(s => s.trim()).filter(Boolean);
    if (!imgs || imgs.length === 0) {
      alert("No file to download");
      return;
    }
    // Prefer first file for single-download; user can open the folder or preview others
    const url = `${IMG_URL}/customcards/${row.userId}_user/${imgs[0]}`;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  // Helper: format date
  const formatDate = (value) => {
    if (!value) return "N/A";
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      // maybe it's a timestamp number
      const n = Number(value);
      if (!isNaN(n)) {
        const dd = new Date(n * (String(n).length > 10 ? 1 : 1000)); // best-effort
        return dd.toLocaleDateString();
      }
      return value;
    }
    return d.toLocaleString();
  };

  // Column list for table
  const columns = ["id", "userId", "cc_images", "cc_count", "download_type", "status", "created_at"];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Custom Card Downloads</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by id, userId, filename, status..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="border px-3 py-2 rounded w-64"
          />

          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="border px-2 py-2 rounded"
          >
            {[5,10,20,50,100].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>

          <button
            onClick={() => { fetchRows(); }}
            className="bg-gray-200 px-3 py-2 rounded"
            title="Refresh"
          >
            Refresh
          </button>

          <button
            onClick={handleBulkDelete}
            disabled={isBulkDeleting || selectedIds.size === 0}
            className={`px-3 py-2 rounded text-white ${selectedIds.size === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
          >
            {isBulkDeleting ? "Deleting..." : `Delete (${selectedIds.size})`}
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectAllOnPage}
                  onChange={toggleSelectAllOnPage}
                />
              </th>

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
              <tr><td colSpan={columns.length + 2} className="px-4 py-6 text-center">Loading...</td></tr>
            ) : currentPageRows.length === 0 ? (
              <tr><td colSpan={columns.length + 2} className="px-4 py-6 text-center text-gray-500">No records found.</td></tr>
            ) : (
              currentPageRows.map((row) => {
                const imgs = (row.cc_images || "").split?.(",").map(s => s.trim()).filter(Boolean);
                return (
                  <tr key={row.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(row.id)}
                        onChange={() => toggleRowSelect(row.id)}
                      />
                    </td>

                    <td className="px-4 py-3">{row.id}</td>
                    <td className="px-4 py-3">{row.userId}</td>

                    <td className="px-4 py-3">
                      {imgs && imgs.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <Image
                            src={`${IMG_URL}/customcards/${row.userId}_user/${imgs[0]}`}
                            alt="thumb"
                            className="w-16 h-16 object-cover rounded cursor-pointer"
                            onClick={() => openPreview(row)}
                          />
                          {imgs.length > 1 && <span className="text-xs text-gray-500">{imgs.length} files</span>}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No image</span>
                      )}
                    </td>

                    <td className="px-4 py-3">{row.cc_count ?? "N/A"}</td>
                    <td className="px-4 py-3">{row.download_type ?? "N/A"}</td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(row)}
                        disabled={updatingStatusFor === row.id}
                        className={`cursor-pointer px-3 py-1 rounded text-xs font-medium ${row.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {updatingStatusFor === row.id ? "..." : row.status ?? "N/A"}
                      </button>
                    </td>

                    <td className="px-4 py-3">{formatDate(row.created_at ?? row.createdAt ?? row.date)}</td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="Preview"
                          onClick={() => openPreview(row)}
                          className="cursor-pointer p-2 rounded bg-gray-100 hover:bg-gray-200"
                        >
                          <FaEye />
                        </button>

                        <button
                          title="Download"
                          onClick={() => handleDownload(row)}
                          className="cursor-pointer p-2 rounded bg-gray-100 hover:bg-gray-200"
                        >
                          <FaDownload />
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
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {"<<"}
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1 border rounded">
            Page {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {">>"}
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="text-sm font-medium">{previewIndex + 1} / {previewImages.length}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setPreviewIndex((i) => Math.max(0, i - 1)); }}
                  disabled={previewIndex === 0}
                  className="cursor-pointer px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => { setPreviewIndex((i) => Math.min(previewImages.length - 1, i + 1)); }}
                  disabled={previewIndex === previewImages.length - 1}
                  className="cursor-pointer px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>

                <a
                  href={previewImages[previewIndex]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer px-3 py-1 border rounded bg-blue-600 text-white"
                >
                  Open / Download
                </a>

                <button onClick={() => { setPreviewOpen(false); setPreviewImages([]); }} className="cursor-pointer px-3 py-1 border rounded">
                  Close
                </button>
              </div>
            </div>

            <div className="p-4 flex items-center justify-center">
              <Image
              src={previewImages[previewIndex]}
              alt="preview"
              width={800}  // Set appropriate width
              height={600} // Set appropriate height
              className="max-h-[70vh] object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            </div>

            {/* thumbnails */}
            {previewImages.length > 1 && (
              <div className="p-3 border-t flex gap-2 overflow-x-auto">
                {previewImages.map((url, idx) => (
                  <div
                    key={url + idx}
                    className={`relative w-20 h-20 rounded cursor-pointer ${
                      idx === previewIndex ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setPreviewIndex(idx)}
                  >
                    <Image
                      src={url}
                      alt={`thumb-${idx}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
