"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import { DELETE_ADMIN_URL, READ_ADMIN_URL } from "@/libs/config";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search / Sort / Pagination states
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${READ_ADMIN_URL}/users.php`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!query) return users;
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      return (
        String(user.id).toLowerCase().includes(q) ||
        String(user.name || "").toLowerCase().includes(q) ||
        String(user.email || "").toLowerCase().includes(q) ||
        String(user.contact || "").toLowerCase().includes(q) ||
        String(user.created_at || "").toLowerCase().includes(q) ||
        String(user.updated_at || "").toLowerCase().includes(q)
      );
    });
  }, [users, query]);

  // Sort users
  const sortedUsers = useMemo(() => {
    const arr = [...filteredUsers];
    arr.sort((a, b) => {
      const A = (a[sortBy] ?? "").toString().toLowerCase();
      const B = (b[sortBy] ?? "").toString().toLowerCase();
      
      // Handle numeric fields specifically
      const numericFields = ["id"];
      if (numericFields.includes(sortBy) && !isNaN(Number(A)) && !isNaN(Number(B))) {
        return sortDir === "asc" ? Number(A) - Number(B) : Number(B) - Number(A);
      }
      
      // Handle contact number sorting
      if (sortBy === "contact" && !isNaN(Number(A)) && !isNaN(Number(B))) {
        return sortDir === "asc" ? Number(A) - Number(B) : Number(B) - Number(A);
      }
      
      // Text comparison
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredUsers, sortBy, sortDir]);

  // Pagination
  const total = sortedUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPageUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, page, pageSize]);

  // Toggle sort
  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      const res = await fetch(`${DELETE_ADMIN_URL}/user.php?id=${id}`);
      const data = await res.json();
      alert(data.message);
      if (data.success) fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user.");
    }
  };

  // Format date helper
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

  // Format contact number
  const formatContact = (contact) => {
    if (!contact) return "N/A";
    // Format as (XXX) XXX-XXXX if it's 10 digits
    const cleanContact = contact.replace(/\D/g, '');
    if (cleanContact.length === 10) {
      return `${cleanContact.slice(0, 3)}-${cleanContact.slice(3, 6)}-${cleanContact.slice(6)}`;
    }
    return contact;
  };

  const columns = ["id", "name", "email", "contact", "created_at", "updated_at"];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Users</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by id, name, email, contact..."
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
            onClick={() => { fetchUsers(); }}
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
              <tr><td colSpan={columns.length + 1} className="px-4 py-6 text-center">Loading...</td></tr>
            ) : currentPageUsers.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="px-4 py-6 text-center text-gray-500">No users found.</td></tr>
            ) : (
              currentPageUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3 font-medium">{user.name || "N/A"}</td>
                  <td className="px-4 py-3">{user.email || "N/A"}</td>
                  <td className="px-4 py-3 font-mono text-sm">{formatContact(user.contact)}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(user.created_at)}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(user.updated_at)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        title="Edit"
                        onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                        className="cursor-pointer p-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        <FaEdit />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(user.id)}
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