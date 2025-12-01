"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IMG_URL, READ_ADMIN_URL, UPDATE_ADMIN_URL } from "@/libs/config";

export default function EditBannerClient({ id }) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    buttonText: "",
    display_order: "",
    status: "active",
    displayDetails: ""
  });
  const [image, setImage] = useState(null); // existing image filename or preview
  const [file, setFile] = useState(null);   // new File object
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch banner details
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`${READ_ADMIN_URL}/banners.php`);
        if (!res.ok) {
          throw new Error('Failed to fetch banners');
        }
        
        const data = await res.json();
        
        let banner;
        if (Array.isArray(data)) {
          banner = data.find((item) => String(item.id) === String(id));
        } else {
          banner = data;
        }

        if (banner) {
          setForm({
            title: banner.title || "",
            description: banner.description || "",
            buttonText: banner.button_text || banner.buttonText || "",
            display_order: banner.display_order || banner.displayOrder || "",
            status: banner.status || "active",
            displayDetails: banner.display_details || banner.displayDetails || ""
          });

          if (banner.image) {
            setImage(banner.image); // store filename for existing image
          }
        } else {
          alert("Banner not found");
          router.push("/admin/banners");
        }
      } catch (err) {
        console.error("Error fetching banner:", err);
        alert("Failed to load banner details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBanner();
    }
  }, [id, router]);

  // Remove image
  const handleRemoveImage = () => {
    if (confirm("Remove this image?")) {
      setImage(null);
      setFile(null);
    }
  };

  // Add new image
  const handleAddImage = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const preview = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setImage(preview); // set preview for new image
    }
  };

  // Submit updated banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.title.trim()) {
      alert("Banner title is required");
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", form.title.trim());
      formData.append("description", form.description?.trim() || "");
      formData.append("buttonText", form.buttonText?.trim() || "");
      formData.append("display_order", form.display_order || "");
      formData.append("status", form.status);
      formData.append("displayDetails", form.displayDetails?.trim() || "");

      // Add new file if selected
      if (file) {
        formData.append("image", file);
      }

      const res = await fetch(
        `${UPDATE_ADMIN_URL}/banner.php`,
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
        alert("✅ Banner updated successfully!");
        router.push("/admin/banners");
      } else {
        alert("❌ Update failed: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating banner:", error);
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
          <p className="text-gray-600">Loading banner details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/admin/banners")}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <span className="mr-2">←</span>
          Back to Banners
        </button>
        <h1 className="text-2xl font-bold">
          Edit Banner #{id}
        </h1>
        {form.title && (
          <p className="text-gray-600 mt-1">Editing: {form.title}</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Banner Image
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {image ? (
              <div className="relative border rounded-lg overflow-hidden">
                <Image
                  width={300}
                  height={200}
                  priority
                  src={image.startsWith("blob:") ? image : `${IMG_URL}/` + image}
                  alt="Banner"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="cursor-pointer absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition shadow-md"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-400 flex flex-col items-center justify-center h-48 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-500 text-sm text-center px-2">
                  Click to Upload Banner Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddImage}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {image ? "Click the × button to remove the current image" : "Upload a new banner image (optional)"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Banner Title *
              </label>
              <input
                type="text"
                placeholder="Enter banner title"
                className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Button Text
              </label>
              <input
                type="text"
                placeholder="Button text (e.g., Get Started)"
                className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.buttonText}
                onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Display Order
              </label>
              <input
                type="number"
                placeholder="Order number"
                className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Status
              </label>
              <select
                className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Banner Description
            </label>
            <textarea
              placeholder="Enter banner description"
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Display Details
            </label>
            <textarea
              placeholder="Additional display details"
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.displayDetails}
              onChange={(e) => setForm({ ...form, displayDetails: e.target.value })}
              rows="2"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/admin/banners")}
              className="cursor-pointer flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`cursor-pointer flex-1 px-6 py-3 rounded-lg font-medium transition ${
                isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {isSaving ? "Updating..." : "Update Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}