"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { DELETE_ADMIN_URL, READ_ADMIN_URL } from "@/libs/config";

export default function CartsPage() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Search / Sort / Pagination states
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  // Fetch carts
  const fetchCarts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${READ_ADMIN_URL}/carts.php`);
      const data = await res.json();
      // console.log(data);
      setCarts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch Carts:", err);
      setCarts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  // Filter carts based on search query
  const filteredCarts = useMemo(() => {
    if (!query) return carts;
    const q = query.trim().toLowerCase();
    return carts.filter((cart) => {
      // Search in basic fields
      const basicMatch = 
        String(cart.id).toLowerCase().includes(q) ||
        String(cart.user_name || "").toLowerCase().includes(q) ||
        String(cart.user_email || "").toLowerCase().includes(q) ||
        String(cart.totalPrice || "").toLowerCase().includes(q) ||
        String(cart.shippingCost || "").toLowerCase().includes(q) ||
        String(cart.grandTotal || "").toLowerCase().includes(q);

      // Search in items array
      const itemsMatch = Array.isArray(cart.items) && 
        cart.items.some(item => 
          String(item.title || "").toLowerCase().includes(q) ||
          String(item.quantity || "").toLowerCase().includes(q) ||
          String(item.price || "").toLowerCase().includes(q)
        );

      return basicMatch || itemsMatch;
    });
  }, [carts, query]);

  // Sort carts
  const sortedCarts = useMemo(() => {
    const arr = [...filteredCarts];
    arr.sort((a, b) => {
      const A = (a[sortBy] ?? "").toString().toLowerCase();
      const B = (b[sortBy] ?? "").toString().toLowerCase();
      
      // Handle numeric fields specifically
      const numericFields = ["id", "totalPrice", "shippingCost", "grandTotal"];
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
  }, [filteredCarts, sortBy, sortDir]);

  // Pagination
  const total = sortedCarts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPageCarts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedCarts.slice(start, start + pageSize);
  }, [sortedCarts, page, pageSize]);

  // Toggle sort
  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  // Delete cart
  const handleDelete = async (id) => {
    if (!confirm("Delete this cart?")) return;

    try {
      const res = await fetch(`${DELETE_ADMIN_URL}/cart.php?id=${id}`);
      const data = await res.json();
      alert(data.message);
      if (data.success) fetchCarts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete cart.");
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return "₹0";
    const num = Number(value);
    return isNaN(num) ? value : `₹${num.toFixed(2)}`;
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
    return d.toLocaleString();
  };

  const columns = [
    "id", 
    "user_name", 
    "user_email", 
    "items", 
    "totalPrice", 
    "shippingCost", 
    "grandTotal", 
    "created_at", 
    "updated_at"
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Carts</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by user, email, items..."
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
            onClick={() => { fetchCarts(); }}
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
            ) : currentPageCarts.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-gray-500">
                  {carts.length === 0 ? "No carts found." : "No matching carts found."}
                </td>
              </tr>
            ) : (
              currentPageCarts.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3 font-medium">{row.user_name || "N/A"}</td>
                  <td className="px-4 py-3">{row.user_email || "N/A"}</td>
                  
                  <td className="px-4 py-3 align-top">
                    <div className="space-y-2 max-w-xs">
                      {Array.isArray(row.items) && row.items.length > 0 ? (
                        row.items.map((item, index) => (
                          <div
                            key={index}
                            className="border p-2 rounded bg-gray-50 text-sm"
                          >
                            <p className="font-medium truncate" title={item.title}>
                              {item.title || "Unnamed Item"}
                            </p>
                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                              <span>Qty: {item.quantity || 0}</span>
                              <span>Price: {formatCurrency(item.price)}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">No items</p>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 font-medium">{formatCurrency(row.totalPrice)}</td>
                  <td className="px-4 py-3">{formatCurrency(row.shippingCost)}</td>
                  <td className="px-4 py-3 font-bold text-green-700">{formatCurrency(row.grandTotal)}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(row.created_at)}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(row.updated_at)}</td>

                  <td className="px-4 py-3 text-center">
                    <button
                      title="Delete Cart"
                      onClick={() => handleDelete(row.id)}
                      className="cursor-pointer p-2 rounded bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <FaTrash />
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