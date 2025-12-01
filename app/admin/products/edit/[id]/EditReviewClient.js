"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { READ_ADMIN_URL, UPDATE_ADMIN_URL } from "@/libs/config";

export default function EditReviewClient({ id }) {
  const router = useRouter();

  const [form, setForm] = useState({
    user_name: "",
    rating: "",
    review_text: "",
    product_id: "",
    category: "card",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState({
    card: [],
    holder: [],
    lanyard: []
  });
  const [loadingProducts, setLoadingProducts] = useState(false);

  const categories = ["card", "holder", "lanyard"];

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        
        // Fetch products for each category
        const [cardsRes, holdersRes, lanyardsRes] = await Promise.all([
          fetch(`${READ_ADMIN_URL}/cards.php`),
          fetch(`${READ_ADMIN_URL}/holders.php`),
          fetch(`${READ_ADMIN_URL}/lanyards.php`)
        ]);

        const cardsData = await cardsRes.json();
        const holdersData = await holdersRes.json();
        const lanyardsData = await lanyardsRes.json();

        setProducts({
          card: Array.isArray(cardsData) ? cardsData : (cardsData?.data || cardsData?.cards || []),
          holder: Array.isArray(holdersData) ? holdersData : (holdersData?.data || holdersData?.holders || []),
          lanyard: Array.isArray(lanyardsData) ? lanyardsData : (lanyardsData?.data || lanyardsData?.lanyards || [])
        });

      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products data.");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch review details by ID
  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch all reviews and find the one with matching ID
        const res = await fetch(`${READ_ADMIN_URL}/reviews.php`);
        const data = await res.json();
        
        let review;
        
        // Handle different API response formats
        if (Array.isArray(data)) {
          review = data.find((item) => String(item.id) === String(id));
        } else if (data?.reviews && Array.isArray(data.reviews)) {
          review = data.reviews.find((item) => String(item.id) === String(id));
        } else if (data?.data && Array.isArray(data.data)) {
          review = data.data.find((item) => String(item.id) === String(id));
        } else {
          // If it's a single review object
          review = data.id ? data : null;
        }

        if (review) {
          setForm({
            user_name: review.user_name || "",
            rating: review.rating || "",
            review_text: review.review_text || "",
            product_id: review.product_id || "",
            category: review.category || "card",
          });
        } else {
          setError(`Review with ID ${id} not found`);
        }
      } catch (err) {
        console.error("Error fetching review:", err);
        setError("Failed to load review data. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReview();
    }
  }, [id]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Reset product_id when category changes
    if (field === 'category') {
      setForm(prev => ({
        ...prev,
        category: value,
        product_id: "" // Reset product ID when category changes
      }));
    }
  };

  // Get current category products
  const getCurrentProducts = () => {
    return products[form.category] || [];
  };

  // Get product name by ID
  const getProductName = (productId) => {
    const categoryProducts = getCurrentProducts();
    const product = categoryProducts.find(p => String(p.id) === String(productId));
    return product ? product.name : `Product #${productId}`;
  };

  // Submit updated review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    // Validate form
    if (!form.user_name.trim() || !form.rating || !form.review_text.trim() || !form.product_id) {
      setError("All fields marked with * are required");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(
        `${UPDATE_ADMIN_URL}/review.php`,
        { 
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            user_name: form.user_name.trim(),
            rating: form.rating,
            review_text: form.review_text.trim(),
            product_id: form.product_id,
            category: form.category,
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        alert("✅ Review updated successfully!");
        router.push("/admin/reviews");
      } else {
        setError("Update failed: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error updating review:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review data...</p>
        </div>
      </div>
    );
  }

  if (error && !form.user_name) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-600 text-lg mb-4">❌ {error}</div>
          <button 
            onClick={() => router.push("/admin/reviews")}
            className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Reviews
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Edit Review
          </h1>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Name *
              </label>
              <input
                type="text"
                placeholder="Enter user name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={form.user_name}
                onChange={(e) => handleInputChange('user_name', e.target.value)}
                required
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={form.rating}
                onChange={(e) => handleInputChange('rating', e.target.value)}
                required
              >
                <option value="">Select Rating</option>
                <option value="1">1 Star ⭐</option>
                <option value="2">2 Stars ⭐⭐</option>
                <option value="3">3 Stars ⭐⭐⭐</option>
                <option value="4">4 Stars ⭐⭐⭐⭐</option>
                <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={form.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Product ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product *
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={form.product_id}
                onChange={(e) => handleInputChange('product_id', e.target.value)}
                required
                disabled={loadingProducts}
              >
                <option value="">Select a Product</option>
                {getCurrentProducts().map((product) => (
                  <option key={product.id} value={product.id}>
                    {form.category === 'card' && product.card_name}
                    {form.category === 'holder' && product.holder_name}
                    {form.category === 'lanyard' && product.lanyard_name}
                    {!product.card_name && !product.holder_name && !product.lanyard_name && `Product #${product.id}`}
                  </option>
                ))}
              </select>
              {loadingProducts && (
                <p className="text-sm text-gray-500 mt-1">Loading products...</p>
              )}
              {getCurrentProducts().length === 0 && !loadingProducts && (
                <p className="text-sm text-gray-500 mt-1">
                  No products found in {form.category} category
                </p>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Text *
            </label>
            <textarea
              placeholder="Enter your review here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              rows={5}
              value={form.review_text}
              onChange={(e) => handleInputChange('review_text', e.target.value)}
              required
            />
          </div>

          {/* Rating Preview */}
          {form.rating && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start text-center sm:text-left">
                <span className="text-sm font-medium text-blue-700 block">Rating Preview:</span>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-1 justify-center sm:justify-start">
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-2xl block ${
                          i < parseInt(form.rating) ? "text-yellow-500" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-blue-600 sm:ml-2 font-medium block">
                    ({form.rating} out of 5 stars)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/admin/reviews")}
              className="cursor-pointer w-full sm:flex-1 bg-gray-500 text-white px-4 sm:px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`w-full sm:flex-1 px-4 sm:px-6 py-3 rounded-lg font-medium transition text-sm sm:text-base ${
                isSaving
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              } text-white`}
            >
              {isSaving ? "Updating..." : "Update Review"}
            </button>
          </div>
        </form>
      </div>

      {/* Live Preview Section */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-lg">
                {form.user_name || "User Name"}
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                Product: {form.product_id ? getProductName(form.product_id) : "N/A"} • Category: {form.category || "N/A"}
              </p>
            </div>
            {form.rating && (
              <div className="flex items-center gap-1 self-start sm:self-auto">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < parseInt(form.rating) ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="text-gray-700 leading-relaxed">
            {form.review_text || "Review text will appear here..."}
          </p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-400 text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}