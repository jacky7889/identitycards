"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IMG_URL, READ_ADMIN_URL, UPDATE_ADMIN_URL } from "@/libs/config";

export default function EditHolderClient({ id }) {
  const router = useRouter();

  const [form, setForm] = useState({
    holder_name: "",
    holder_detail: "",
    price: "",
    color: "",
    feature: "",
    weight: "",
    quantity: "",
    amount: "",
    total: ""
  });
  const [images, setImages] = useState([]); // existing image filenames
  const [files, setFiles] = useState([]);   // new File objects
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch holder details
  useEffect(() => {
    const fetchHolder = async () => {
      try {
        const res = await fetch(`${READ_ADMIN_URL}/holders.php?id=${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch holder');
        }
        
        const data = await res.json();
        let holder;
        
        if (Array.isArray(data)) {
          holder = data.find((item) => String(item.id) === String(id));
        } else {
          holder = data;
        }

        if (holder) {
          setForm({
            holder_name: holder.holder_name || "",
            holder_detail: holder.holder_detail || "",
            price: holder.price || "",
            color: holder.color || "",
            feature: holder.feature || "",
            weight: holder.weight || "",
            quantity: holder.quantity || "",
            amount: holder.amount || "",
            total: holder.total || "",
          });

          if (Array.isArray(holder.images)) {
            setImages(holder.images);
          }
        } else {
          alert("Holder not found");
          router.push("/admin/holders");
        }
      } catch (err) {
        console.error("Error fetching holder:", err);
        alert("Failed to load holder details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHolder();
    }
  }, [id, router]);

  // Delete image from list
  const handleDeleteImage = (index) => {
    if (confirm("Remove this image?")) {
      setImages(images.filter((_, i) => i !== index));
      setFiles(files.filter((_, i) => i !== index));
    }
  };

  // Add new image(s)
  const handleAddImage = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    const previews = validFiles.map((f) => URL.createObjectURL(f));

    setFiles((prev) => [...prev, ...validFiles]);
    setImages((prev) => [...prev, ...previews]);
  };

  // Submit updated holder
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.holder_name?.trim()) {
      alert("Holder name is required");
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("holder_name", form.holder_name.trim());
      formData.append("holder_detail", form.holder_detail?.trim() || "");
      formData.append("price", form.price || "");
      formData.append("color", form.color?.trim() || "");
      formData.append("feature", form.feature?.trim() || "");
      formData.append("weight", form.weight || "");
      formData.append("quantity", form.quantity || "");
      formData.append("amount", form.amount || "");
      formData.append("total", form.total || "");

      // Add new files
      files.forEach((file) => formData.append("images[]", file));

      // Send existing image filenames
      const existingImages = images.filter((img) => !img.startsWith("blob:"));
      formData.append("existing_images", JSON.stringify(existingImages));

      const res = await fetch(
        `${UPDATE_ADMIN_URL}/holder.php`,
        { 
          method: "POST", 
          body: formData 
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const result = await res.json();

      if (result.success) {
        alert("✅ Holder updated successfully!");
        router.push("/admin/holders");
      } else {
        alert("❌ Update failed: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating holder:", error);
      alert("❌ Update failed: Network error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading holder details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">
        Edit Holder
      </h1>

      {/* Images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {images.map((img, index) => (
          <div key={index} className="relative border rounded overflow-hidden">
            <Image
              width={250}
              height={200}
              priority
              src={img.startsWith("blob:") ? img : `${IMG_URL}/` + img}
              alt="Holder"
              className="w-full h-32 object-cover"
            />
            <button
              onClick={() => handleDeleteImage(index)}
              className="cursor-pointer absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-700"
            >
              ×
            </button>
          </div>
        ))}

        {/* Add new image */}
        <label className="border-2 border-dashed border-gray-400 flex items-center justify-center h-32 rounded cursor-pointer hover:bg-gray-50">
          <span className="text-gray-500 text-sm">+ Add Image</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddImage}
            className="hidden"
          />
        </label>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Holder Name *
          </label>
          <input
            type="text"
            placeholder="Holder Name"
            className="border p-2 w-full rounded"
            value={form.holder_name}
            onChange={(e) => setForm({ ...form, holder_name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Holder Details
          </label>
          <textarea
            placeholder="Holder Details"
            className="border p-2 w-full rounded"
            value={form.holder_detail}
            onChange={(e) => setForm({ ...form, holder_detail: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Price
            </label>
            <input
              type="number"
              placeholder="Price"
              className="border p-2 rounded w-full"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Color
            </label>
            <input
              type="text"
              placeholder="Color"
              className="border p-2 rounded w-full"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Feature
            </label>
            <input
              type="text"
              placeholder="Feature"
              className="border p-2 rounded w-full"
              value={form.feature}
              onChange={(e) => setForm({ ...form, feature: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Weight
            </label>
            <input
              type="number"
              placeholder="Weight"
              className="border p-2 rounded w-full"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              placeholder="Quantity"
              className="border p-2 rounded w-full"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Amount
            </label>
            <input
              type="number"
              placeholder="Amount"
              className="border p-2 rounded w-full"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Total
            </label>
            <input
              type="number"
              placeholder="Total"
              className="border p-2 rounded w-full"
              value={form.total}
              onChange={(e) => setForm({ ...form, total: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/holders")}
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
            {isSaving ? "Updating..." : "Update Holder"}
          </button>
        </div>
      </form>
    </div>
  );
}