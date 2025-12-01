"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaEdit, FaImage, FaPaintBrush } from "react-icons/fa";
import { DELETE_ADMIN_URL, IMG_URL, READ_ADMIN_URL, UPDATE_ADMIN_URL } from "@/libs/config";
import Image from "next/image";

export default function OrdersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search / Sort / Pagination / Bulk
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectAllOnPage, setSelectAllOnPage] = useState(false);

  // Modal / Preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [currentOrder, setCurrentOrder] = useState(null);

  // UI states
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [updatingStatusFor, setUpdatingStatusFor] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);

  const router = useRouter();
  
    // Fetch data
  const fetchRows = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${READ_ADMIN_URL}/orders.php`);
      const data = await res.json();
      
      // Process data to combine custom designs and user designs
      const processedData = Array.isArray(data) ? data.map(row => {
        // Create a Set to track unique design filenames
        const uniqueDesigns = new Set();
        const uniqueDesignsList = [];
        
        // First add user designs (priority)
        row.user_designs?.forEach(design => {
          if (design.filename && !uniqueDesigns.has(design.filename)) {
            uniqueDesigns.add(design.filename);
            uniqueDesignsList.push({
              ...design,
              type: 'user_design' // Unified type
            });
          }
        });
        
        // Then add custom designs only if they don't exist in user designs
        row.item_designs?.forEach(design => {
          if (design.filename && !uniqueDesigns.has(design.filename)) {
            uniqueDesigns.add(design.filename);
            uniqueDesignsList.push({
              ...design,
              type: 'user_design' // Unified type
            });
          }
        });
        
        // Add product images (always keep these separate)
        row.item_images?.forEach(image => {
          if (image.filename) {
            uniqueDesignsList.push({
              ...image,
              type: 'product_image'
            });
          }
        });
        
        return {
          ...row,
          unique_designs: uniqueDesignsList,
          unique_designs_count: uniqueDesignsList.length
        };
      }) : [];
      
      setRows(processedData);
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

  // Filtered rows
  const filteredRows = useMemo(() => {
    if (!query) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      return (
        String(r.id).toLowerCase().includes(q) ||
        String(r.user_id || "").toLowerCase().includes(q) ||
        String(r.user_name || "").toLowerCase().includes(q) ||
        String(r.user_email || "").toLowerCase().includes(q) ||
        String(r.status || "").toLowerCase().includes(q) ||
        String(r.items_details || "").toLowerCase().includes(q) ||
        String(r.customer_details || "").toLowerCase().includes(q) ||
        String(r.shipping_details || "").toLowerCase().includes(q) ||
        String(r.billing_details || "").toLowerCase().includes(q)
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
      currentPageRows.forEach((r) => newSet.delete(r.id));
      setSelectAllOnPage(false);
    } else {
      currentPageRows.forEach((r) => newSet.add(r.id));
      setSelectAllOnPage(true);
    }
    setSelectedIds(newSet);
  };

  // Image preview for designs
  const openPreview = (design, order) => {
    let imageUrl = '';
    
    if (design.type === 'user_design') {
      imageUrl = `${IMG_URL}/user_designs/${design.filename}`;
    } else if (design.type === 'product_image') {
      imageUrl = `${IMG_URL}/${design.filename}`;
    }
    
    setPreviewImages([imageUrl]);
    setPreviewIndex(0);
    setCurrentOrder(order);
    setPreviewOpen(true);
  };

  // Open all designs for an order
  const openAllDesigns = (order) => {
    const imageUrls = order.unique_designs.map(design => 
      design.type === 'user_design' 
        ? `${IMG_URL}/user_designs/${design.filename}`
        : `${IMG_URL}/${design.filename}`
    );
    
    setPreviewImages(imageUrls);
    setPreviewIndex(0);
    setCurrentOrder(order);
    setPreviewOpen(true);
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatusFor(orderId);
    try {
      const res = await fetch(`${UPDATE_ADMIN_URL}/order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: orderId, 
          status: newStatus 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRows((prev) => prev.map((r) => (r.id === orderId ? { ...r, status: newStatus } : r)));
        alert("Order status updated successfully");
      } else {
        alert(data.message || "Failed to update order status");
      }
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    } finally {
      setUpdatingStatusFor(null);
    }
  };

  // Delete order with all associated data
  const deleteOrder = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order? This will also delete all associated user designs and cannot be undone.")) return;
    
    setDeletingOrder(orderId);
    try {
      const res = await fetch(`${DELETE_ADMIN_URL}/order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Order deleted successfully");
        fetchRows(); // Refresh the data
      } else {
        alert(data.message || "Failed to delete order");
      }
    } catch (err) {
      console.error(err);
      alert("Order deletion failed");
    } finally {
      setDeletingOrder(null);
    }
  };

  // Format date
  const formatDate = (value) => {
    if (!value) return "N/A";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleString();
  };

  // Get design type icon and badge
  const getDesignTypeInfo = (design) => {
    switch(design.type) {
      case 'user_design':
        return { 
          icon: <FaPaintBrush className="text-xs" />, 
          badge: "bg-blue-100 text-blue-800", 
          text: "User Design",
          tooltip: "Custom or uploaded design"
        };
      case 'product_image':
        return { 
          icon: <FaImage className="text-xs" />, 
          badge: "bg-green-100 text-green-800", 
          text: "Product Image",
          tooltip: "Product reference image"
        };
      default:
        return { 
          icon: <FaImage className="text-xs" />, 
          badge: "bg-gray-100 text-gray-800", 
          text: "Image",
          tooltip: "Image file"
        };
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'processing':
        return "bg-pink-100 text-red-800";
      case 'shipped':
        return "bg-blue-100 text-red-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      case 'pending':
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Specific columns as requested
  const columns = [
    "id", 
    "user_name", 
    "items_details", 
    // "customer_details", 
    "shipping_details", 
    "billing_details", 
    "subTotal", 
    "shippingCost", 
    "tax", 
    "status", 
    "amount"
  ];

  // Format column display names
  const getColumnDisplayName = (col) => {
    const names = {
      id: "Order ID",
      user_name: "Customer Name",
      items_details: "Items",
      customer_details: "Customer Email",
      shipping_details: "Shipping",
      billing_details: "Billing",
      subTotal: "Subtotal",
      shippingCost: "Shipping Cost",
      tax: "Tax",
      status: "Status",
      amount: "Total Amount"
    };
    return names[col] || col.replace(/_/g, " ");
  };

  // Truncate long text for table display
  const truncateText = (text, maxLength = 50) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Orders with Designs</h1>
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded w-64"
          />
          <select 
            value={pageSize} 
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border px-2 py-2 rounded"
          >
            {[5,10,20,50,100].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
          <button onClick={fetchRows} className="cursor-pointer bg-gray-200 px-3 py-2 rounded" title="Refresh">
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" checked={selectAllOnPage} onChange={toggleSelectAllOnPage} />
              </th>
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer select-none" onClick={() => handleSort(col)}>
                  <div className="flex items-center gap-2">
                    <span>{getColumnDisplayName(col)}</span>
                    {sortBy === col && (sortDir === "asc" ? "▲" : "▼")}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center">Designs</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length + 3} className="px-4 py-6 text-center">Loading...</td></tr>
            ) : currentPageRows.length === 0 ? (
              <tr><td colSpan={columns.length + 3} className="px-4 py-6 text-center text-gray-500">No orders found.</td></tr>
            ) : (
              currentPageRows.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleRowSelect(row.id)} />
                  </td>
                  
                  {/* Specific columns as requested */}
                  <td className="px-4 py-3 font-medium">{row.id}</td>
                  
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{row.user_name}</div>
                      <div className="text-sm text-gray-500">{row.user_email}</div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 text-sm max-w-xs">
                    <div title={row.items_details}>
                      {truncateText(row.items_details, 60)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {row.items_count} item(s)
                    </div>
                  </td>
                  
                  {/* <td className="px-4 py-3 text-sm max-w-xs">
                    <div title={row.customer_details}>
                      {truncateText(row.customer_details, 40)}
                    </div>
                  </td> */}
                  
                  <td className="px-4 py-3 text-sm max-w-xs">
                    <div title={row.shipping_details}>
                      {truncateText(row.shipping_details, 40)}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 text-sm max-w-xs">
                    <div title={row.billing_details}>
                      {truncateText(row.billing_details, 40)}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 font-medium">₹{row.subTotal || '0'}</td>
                  <td className="px-4 py-3">₹{row.shippingCost || '0'}</td>
                  <td className="px-4 py-3">₹{row.tax || '0'}</td>
                  
                  <td className="px-4 py-3">
                    <select 
                      value={row.status || 'pending'}
                      onChange={(e) => updateOrderStatus(row.id, e.target.value)}
                      disabled={updatingStatusFor === row.id}
                      className={`px-3 py-1 rounded text-xs font-medium border-0 ${getStatusBadge(row.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">processing</option>
                      <option value="shipped">shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                    {updatingStatusFor === row.id && (
                      <span className="ml-2 text-xs">Updating...</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-3 font-medium text-green-700">₹{row.amount}</td>
                  
                  {/* Designs Column */}
                  <td className="px-4 py-3">
                    {row.unique_designs_count > 0 ? (
                      <div className="flex flex-wrap gap-2 max-w-xs">
                        {row.unique_designs.slice(0, 3).map((design, idx) => {
                          const typeInfo = getDesignTypeInfo(design);
                          return (
                            <div key={idx} className="relative group" title={typeInfo.tooltip}>
                             <Image
                              src={
                                design.type === 'user_design'
                                  ? `${IMG_URL}/user_designs/${design.filename}`
                                  : `${IMG_URL}/${design.filename}`
                              }
                              alt={design.filename}
                              width={48}
                              height={48}
                              className="object-cover rounded border cursor-pointer"
                              onClick={() => openPreview(design, row)}
                              onError={(e) => {
                                e.target.src = `${design.filename}`;
                              }}
                            />
                              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center ${typeInfo.badge}`}>
                                {typeInfo.icon}
                              </div>
                            </div>
                          );
                        })}
                        {row.unique_designs_count > 3 && (
                          <div 
                            className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500 cursor-pointer"
                            onClick={() => openAllDesigns(row)}
                            title="View all designs"
                          >
                            +{row.unique_designs_count - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No designs</span>
                    )}
                  </td>
                  
                  {/* Actions Column */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => {
                          router.push(`/admin/orders/edit/${row.id}`);
                        }}
                        className="cursor-pointer px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 flex items-center gap-1 justify-center"
                      >
                        <FaEdit className="text-xs" /> Edit
                      </button>
                      <button 
                        onClick={() => deleteOrder(row.id)}
                        disabled={deletingOrder === row.id}
                        className="cursor-pointer px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 flex items-center gap-1 justify-center"
                      >
                        <FaTrash className="text-xs" /> 
                        {deletingOrder === row.id ? "Deleting..." : "Delete"}
                      </button>
                      {row.unique_designs_count > 0 && (
                        <button 
                          onClick={() => openAllDesigns(row)}
                          className="cursor-pointer px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200"
                        >
                          View All Designs
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">{"<<"}</button>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <span className="px-3 py-1 border rounded">Page {page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">{">>"}</button>
        </div>
      </div>

      {/* Design Preview Modal - Simplified without download/delete */}
      {previewOpen && currentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  Design {previewIndex + 1} of {previewImages.length} 
                  {currentOrder.unique_designs[previewIndex]?.product_name && 
                    ` - ${currentOrder.unique_designs[previewIndex].product_name}`
                  }
                </span>
                <span className={`px-2 py-1 rounded text-xs ${getDesignTypeInfo(currentOrder.unique_designs[previewIndex]).badge}`}>
                  {getDesignTypeInfo(currentOrder.unique_designs[previewIndex]).text}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPreviewIndex((i) => Math.max(0, i - 1))} disabled={previewIndex === 0} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                <button onClick={() => setPreviewIndex((i) => Math.min(previewImages.length - 1, i + 1))} disabled={previewIndex === previewImages.length - 1} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                <button onClick={() => setPreviewOpen(false)} className="px-3 py-1 border rounded bg-gray-600 text-white">Close</button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-center bg-gray-50 min-h-[400px]">
             <Image
                src={previewImages[previewIndex]}
                alt="preview"
                width={800}
                height={600}
                style={{ 
                  maxHeight: '60vh', 
                  maxWidth: '100%', 
                  objectFit: 'contain' 
                }}
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>
            {/* Thumbnails */}
            {previewImages.length > 1 && (
            <div className="p-3 border-t flex gap-2 overflow-x-auto">
            {previewImages.map((url, idx) => (
              <div
                key={idx}
                className={`relative w-16 h-16 rounded cursor-pointer border-2 ${
                  idx === previewIndex ? "border-blue-500" : "border-transparent"
                }`}
                onClick={() => setPreviewIndex(idx)}
              >
                <Image
                  src={url}
                  alt={`thumb-${idx}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded"
                  sizes="64px"
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