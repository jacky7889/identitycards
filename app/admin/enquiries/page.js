"use client";

import { DELETE_ADMIN_URL, READ_ADMIN_URL } from "@/libs/config";
import { useEffect, useState, useMemo } from "react";
import { FaTrash } from "react-icons/fa";

export default function ContactEnquiryPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search / Sort / Pagination states
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${READ_ADMIN_URL}/contact_enquiry.php`);
      const data = await res.json();
      setEnquiries(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Failed to fetch enquiry:", err);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Filter enquiries based on search query
  const filteredEnquiries = useMemo(() => {
    if (!query) return enquiries;
    const q = query.trim().toLowerCase();
    return enquiries.filter((enquiry) => {
      return (
        String(enquiry.id).toLowerCase().includes(q) ||
        String(enquiry.name || "").toLowerCase().includes(q) ||
        String(enquiry.email || "").toLowerCase().includes(q) ||
        String(enquiry.contactno || "").toLowerCase().includes(q) ||
        String(enquiry.message || "").toLowerCase().includes(q)
      );
    });
  }, [enquiries, query]);

  // Sort enquiries
  const sortedEnquiries = useMemo(() => {
    const arr = [...filteredEnquiries];
    arr.sort((a, b) => {
      const A = (a[sortBy] ?? "").toString().toLowerCase();
      const B = (b[sortBy] ?? "").toString().toLowerCase();
      if (!isNaN(Number(A)) && !isNaN(Number(B))) {
        return sortDir === "asc" ? Number(A) - Number(B) : Number(B) - Number(A);
      }
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredEnquiries, sortBy, sortDir]);

  // Pagination
  const total = sortedEnquiries.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPageEnquiries = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedEnquiries.slice(start, start + pageSize);
  }, [sortedEnquiries, page, pageSize]);

  // Toggle sort
  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this enquiry?")) return;

    try {
      const res = await fetch(
        `${DELETE_ADMIN_URL}/contact_enquiry.php?id=${id}`
      );
      const data = await res.json();

      alert(data.message);

      if (data.success) fetchEnquiries();
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  const columns = ["id", "name", "email", "contactno", "message"];

  if (loading)
    return <p className="text-center text-gray-500 py-10">Loading enquiries...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Contact Enquiries</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name, email, phone, message..."
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
            onClick={() => { fetchEnquiries(); }}
            className="cursor-pointer bg-gray-200 px-3 py-2 rounded"
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
                    <span className="capitalize">
                      {col === "contactno" ? "Phone" : col.replace(/_/g, " ")}
                    </span>
                    {sortBy === col && (sortDir === "asc" ? "▲" : "▼")}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentPageEnquiries.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-gray-500">
                  {enquiries.length === 0 ? "No enquiries found." : "No matching enquiries found."}
                </td>
              </tr>
            ) : (
              currentPageEnquiries.map((row) => (
                <tr
                  key={row.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.contactno}</td>
                  <td className="px-4 py-3 max-w-md truncate" title={row.message}>
                    {row.message}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      className="cursor-pointer p-2 rounded bg-red-50 text-red-600 hover:bg-red-100"
                      onClick={() => handleDelete(row.id)}
                      title="Delete enquiry"
                    >
                      <FaTrash size={16} />
                    </button>
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
      )}
    </div>
  );
}