"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { READ_ADMIN_URL, UPDATE_ADMIN_URL } from "@/libs/config";

export default function EditBlogClient({ id }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    author: "",
    image: ""
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${READ_ADMIN_URL}/blogs.php?id=${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch blog');
        }
        
        const data = await res.json();
        let blogData;
        
        if (Array.isArray(data)) {
          blogData = data.find((item) => String(item.id) === String(id));
        } else {
          blogData = data;
        }

        console.log("Blog data:", blogData);

        if (blogData) {
          setForm({
            title: blogData.title || "",
            description: blogData.description || "",
            author: blogData.author || "",
            image: blogData.image || ""
          });
          
          if (blogData.image) {
            setPreview(blogData.image);
          }
        } else {
          alert("Blog not found");
          router.push("/admin/blogs");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        alert("Failed to load blog details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, router]);

  // ✅ Handle text input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Delete current image
  const handleDeleteImage = () => {
    if (confirm("Remove this image?")) {
      setImage(null);
      setPreview(null);
      setForm(prev => ({ ...prev, image: "" }));
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.title?.trim()) {
      alert("Blog title is required");
      return;
    }

    if (!form.description?.trim()) {
      alert("Blog description is required");
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("author", form.author?.trim() || "");

      // Handle image upload
      if (image) {
        formData.append("image", image);
      } else if (!preview) {
        // If no preview and no new image, remove existing image
        formData.append("remove_image", "1");
      }

      const res = await fetch(
        `${UPDATE_ADMIN_URL}/blog.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const result = await res.json();

      if (result.success) {
        alert("✅ Blog updated successfully!");
        router.push("/admin/blogs");
      } else {
        alert("❌ Update failed: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("❌ Update failed: Network error");
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>

      {/* 🖼️ Image Section */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Blog Image
        </label>
        <div className="relative w-full border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition">
          {preview ? (
            <>
              <Image
                width={400}
                height={300}
                priority
                src={preview.startsWith('blob:') ? preview : preview}
                alt="Blog preview"
                className="w-full h-64 object-cover"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute top-3 right-3 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-700 transition"
                title="Remove image"
              >
                ×
              </button>
            </>
          ) : (
            <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-500 text-sm">Click to upload blog image</span>
              <span className="text-gray-400 text-xs mt-1">JPG, PNG, GIF (Max 5MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {preview ? "Click the × button to remove the current image" : "Upload a blog image (optional)"}
        </p>
      </div>

      {/* 📝 Blog Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Blog Title *
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter blog title"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Author
          </label>
          <input
            type="text"
            name="author"
            placeholder="Author name"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.author}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Blog Content *
          </label>
          <textarea
            name="description"
            placeholder="Write your blog content..."
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-48 resize-vertical"
            value={form.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/blogs")}
            className="cursor-pointer w-full sm:flex-1 bg-gray-500 text-white px-4 sm:px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`cursor-pointer w-full sm:flex-1 px-4 sm:px-6 py-3 rounded-lg font-medium transition text-sm sm:text-base ${
              isSaving
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {isSaving ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}