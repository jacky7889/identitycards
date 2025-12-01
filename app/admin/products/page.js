"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";
import { CREATE_ADMIN_URL, DELETE_ADMIN_URL, READ_ADMIN_URL } from "@/libs/config";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    user_name: "",
    rating: "",
    review_text: "",
    product_id: "",
    category: "card"
  });
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // Add loading state for delete

  // Search / Sort / Pagination states
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const router = useRouter();
  
  // Fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${READ_ADMIN_URL}/reviews.php`);
      const data = await res.json();
      // Handle different response formats
      if (Array.isArray(data)) {
        setReviews(data);
      } else if (data?.reviews && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else if (data?.data && Array.isArray(data.data)) {
        setReviews(data.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products based on category
  const fetchProducts = async (category) => {
    try {
      let endpoint = '';
      switch (category) {
        case 'card':
          endpoint = 'cards.php';
          break;
        case 'holder':
          endpoint = 'holders.php';
          break;
        case 'lanyard':
          endpoint = 'lanyards.php';
          break;
        default:
          endpoint = 'cards.php';
      }

      const res = await fetch(`${READ_ADMIN_URL}/${endpoint}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(`Failed to fetch ${category} products:`, err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchReviews();
    // Fetch initial products for default category (card)
    fetchProducts('card');
  }, []);

  // Handle category change
  const handleCategoryChange = (category) => {
    setForm(prev => ({
      ...prev,
      category: category,
      product_id: "" // Reset product_id when category changes
    }));
    fetchProducts(category);
  };

  // Create new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`${CREATE_ADMIN_URL}/review.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) {
        setForm({
          user_name: "",
          rating: "",
          review_text: "",
          product_id: "",
          category: "card"
        });
        setShowForm(false);
        fetchReviews();
      }
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter reviews based on search query
  const filteredReviews = useMemo(() => {
    if (!query) return reviews;
    const q = query.trim().toLowerCase();
    return reviews.filter((review) => {
      return (
        String(review.id).toLowerCase().includes(q) ||
        String(review.user_name || "").toLowerCase().includes(q) ||
        String(review.review_text || "").toLowerCase().includes(q) ||
        String(review.rating || "").toLowerCase().includes(q) ||
        String(review.product_id || "").toLowerCase().includes(q) ||
        String(review.category || "").toLowerCase().includes(q) ||
        String(review.created_at || "").toLowerCase().includes(q)
      );
    });
  }, [reviews, query]);

  // Sort reviews
  const sortedReviews = useMemo(() => {
    const arr = [...filteredReviews];
    arr.sort((a, b) => {
      const A = (a[sortBy] ?? "").toString().toLowerCase();
      const B = (b[sortBy] ?? "").toString().toLowerCase();
      
      // Handle numeric fields specifically
      const numericFields = ["id", "rating", "product_id"];
      if (numericFields.includes(sortBy) && !isNaN(Number(A)) && !isNaN(Number(B))) {
        return sortDir === "asc" ? Number(A) - Number(B) : Number(B) - Number(A);
      }
      
      // Date fields
      if (sortBy === "created_at") {
        const dateA = new Date(A);
        const dateB = new Date(B);
        return sortDir === "asc" ? dateA - dateB : dateB - dateA;
      }
      
      // Text comparison
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredReviews, sortBy, sortDir]);

  // Pagination
  const total = sortedReviews.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPageReviews = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedReviews.slice(start, start + pageSize);
  }, [sortedReviews, page, pageSize]);

  // Toggle sort
  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  // CORRECTED Delete a review function
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

    setDeletingId(id);

    console.log(id);
    
    try {
        const res = await fetch(`${DELETE_ADMIN_URL}/review.php`, {
          method: "POST", // or "POST"
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({id})
        });
 
        console.log("Response status:", res.status);
        
      const data = await res.json();

      console.log(data)
      
      
      if (data.success) {
        alert("✅ Review deleted successfully!");
        fetchReviews(); // Refresh the list
      } else {
        alert("❌ Failed to delete review: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const numericRating = parseFloat(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= numericRating ? "text-yellow-500" : "text-gray-300"}
        />
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Get product name by ID and category
  const getProductName = (productId, category) => {
    if (!productId) return "N/A";
    
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) return `ID: ${productId}`;
    
    // Return appropriate name based on category
    switch (category) {
      case 'card':
        return product.card_name || `Card #${productId}`;
      case 'holder':
        return product.holder_name || `Holder #${productId}`;
      case 'lanyard':
        return product.lanyard_name || `Lanyard #${productId}`;
      default:
        return `Product #${productId}`;
    }
  };

  const columns = [
    "id",
    "user_name",
    "rating",
    "review_text",
    "product_id",
    "category",
    "created_at"
  ];

  const categories = ["card", "holder", "lanyard"];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Customer Reviews</h1>

        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by user, review, category..."
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
            onClick={() => { fetchReviews(); }}
            className="cursor-pointer bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
            title="Refresh"
          >
            Refresh
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {showForm ? "Hide Form" : "Create Review"}
          </button>
        </div>
      </div>

      {/* Create Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-6 mb-8 space-y-4"
        >
          <h3 className="text-lg font-semibold mb-4">Create New Review</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                type="text"
                placeholder="Enter user name"
                className="border p-2 rounded w-full"
                value={form.user_name}
                onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5)
              </label>
              <select
                className="border p-2 rounded w-full"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                required
              >
                <option value="">Select Rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="border p-2 rounded w-full"
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <select
                className="border p-2 rounded w-full"
                value={form.product_id}
                onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                required
                disabled={products.length === 0}
              >
                <option value="">Select a Product{form.category.charAt(0).toUpperCase() + form.category.slice(1)}</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {form.category === 'card' && product.card_name}
                    {form.category === 'holder' && product.holder_name}
                    {form.category === 'lanyard' && product.lanyard_name}
                    {!product.card_name && !product.holder_name && !product.lanyard_name && `Product #${product.id}`}
                  </option>
                ))}
              </select>
              {products.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No {form.category}s found
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review Text
            </label>
            <textarea
              placeholder="Enter review text"
              className="border p-2 w-full rounded"
              value={form.review_text}
              onChange={(e) => setForm({ ...form, review_text: e.target.value })}
              rows={3}
              required
            />
          </div>

          <button
            disabled={isSaving}
            className={`${
              isSaving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-4 py-2 rounded w-full transition`}
          >
            {isSaving ? "Creating Review..." : "Create Review"}
          </button>
        </form>
      )}

      {/* Stats Summary */}
      {reviews.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-blue-600 font-semibold">Total Reviews</div>
              <div className="text-2xl font-bold text-blue-800">{reviews.length}</div>
            </div>
            <div>
              <div className="text-blue-600 font-semibold">Average Rating</div>
              <div className="text-2xl font-bold text-blue-800">
                {(reviews.reduce((sum, review) => sum + (parseFloat(review.rating) || 0), 0) / reviews.length).toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-blue-600 font-semibold">5-Star Reviews</div>
              <div className="text-2xl font-bold text-blue-800">
                {reviews.filter(review => parseFloat(review.rating) === 5).length}
              </div>
            </div>
            <div>
              <div className="text-blue-600 font-semibold">Categories</div>
              <div className="text-2xl font-bold text-blue-800">
                {[...new Set(reviews.map(review => review.category))].length}
              </div>
            </div>
          </div>
        </div>
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
                  Loading reviews...
                </td>
              </tr>
            ) : currentPageReviews.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-gray-500">
                  {reviews.length === 0 ? "No reviews found." : "No matching reviews found."}
                </td>
              </tr>
            ) : (
              currentPageReviews.map((review) => (
                <tr key={review.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{review.id}</td>
                  
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {review.user_name || "Anonymous"}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600 font-medium">
                        ({parseFloat(review.rating) || 0})
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 max-w-md">
                    <div 
                      className="text-gray-700 text-sm line-clamp-2"
                      title={review.review_text}
                    >
                      {review.review_text || "No review text provided."}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {getProductName(review.product_id, review.category)}
                      </div>
                      <div className="text-gray-500 text-xs">
                        ID: {review.product_id || "N/A"}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {review.category || "general"}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(review.created_at)}
                  </td>
                  
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        title="Edit"
                        onClick={() => router.push(`/admin/reviews/edit/${review.id}`)}
                        className="cursor-pointer p-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                        className="cursor-pointer p-2 rounded bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
                      >
                        {deletingId === review.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                          </>
                        ) : (
                          <FaTrash />
                        )}
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