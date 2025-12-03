"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { READ_ADMIN_URL, UPDATE_ADMIN_URL } from "@/libs/config";

export default function EditOrderClient({ id }) {
  const router = useRouter();

  const [form, setForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch single order
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${READ_ADMIN_URL}/orders.php`);
        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await res.json();
        let orderData;
        
        if (Array.isArray(data)) {
          orderData = data.find((item) => String(item.id) === String(id));
        } else {
          orderData = data;
        }
        
        if (orderData) {
          setForm(orderData);
        } else {
          alert("Order not found");
          router.push("/admin/orders");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        alert("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, router]);

  // Handle status change only
  const handleStatusChange = (e) => {
    setForm({ ...form, status: e.target.value });
  };

  // Submit updated order status only
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.status) {
      alert("Please select a status");
      return;
    }

    setIsSaving(true);

    // Prepare data in correct format for PHP backend
    const updateData = {
      id: parseInt(id),
      status: form.status
    };

    try {
      const res = await fetch(
        `${UPDATE_ADMIN_URL}/order.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const result = await res.json();
      
      if (result.success) {
        alert("✅ Order status updated successfully!");
        router.push("/admin/orders");
      } else {
        alert("❌ Update failed: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ Update failed: Network error");
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel and go back
  const handleCancel = () => {
    router.push("/admin/orders");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Update Order Status</h1>
      </div>

      {/* Order Information Display (Read-only) */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Order Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">User Name</label>
            <p className="p-2 bg-white border rounded">{form.user_name || "N/A"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">User Email</label>
            <p className="p-2 bg-white border rounded">{form.user_email || "N/A"}</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">Items</label>
            <p className="p-2 bg-white border rounded min-h-[60px] whitespace-pre-wrap">
              {form.items_details || "No items"}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">Shipping Address</label>
            <p className="p-2 bg-white border rounded min-h-[60px] whitespace-pre-wrap">
              {form.shipping_details || "No shipping address"}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">Billing Address</label>
            <p className="p-2 bg-white border rounded min-h-[60px] whitespace-pre-wrap">
              {form.billing_details || "No billing address"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Sub Total</label>
            <p className="p-2 bg-white border rounded">₹{form.subTotal || "0.00"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tax</label>
            <p className="p-2 bg-white border rounded">₹{form.tax || "0.00"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Shipping Cost</label>
            <p className="p-2 bg-white border rounded">₹{form.shippingCost || "0.00"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Total Amount</label>
            <p className="p-2 bg-white border rounded font-semibold">₹{form.amount || "0.00"}</p>
          </div>
        </div>
      </div>

      {/* Status Update Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 border rounded bg-blue-50">
          <h3 className="text-lg font-semibold mb-3 text-blue-900">Update Order Status</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status: <span className="font-semibold capitalize">{form.status || "Unknown"}</span>
            </label>
            <select
              name="status"
              className="border p-3 w-full rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              value={form.status || ""}
              onChange={handleStatusChange}
              required
            >
              <option value="">Select New Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="cursor-pointer w-full sm:flex-1 bg-gray-500 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full sm:flex-1 px-4 sm:px-6 py-3 rounded-lg transition-colors font-medium text-sm sm:text-base flex items-center justify-center ${
              isSaving 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            } text-white`}
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </div>
            ) : (
              "Update Order Status"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}