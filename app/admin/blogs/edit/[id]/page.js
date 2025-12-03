"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { READ_ADMIN_URL, UPDATE_ADMIN_URL } from "@/libs/config";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Fetch blog details
  useEffect(() => {
    fetch(`${READ_ADMIN_URL}/blogs.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        let blogData;
        if (Array.isArray(data)) {
          blogData = data.find((item) => String(item.id) === String(id));
        } else {
          blogData = data;
        }
        console.log(blogData)
        if (blogData) {
          setForm(blogData);
          if (blogData.image) {
            setPreview(`${blogData.image}`);
          }
        }
      })
      .catch((err) => console.error("Error:", err));
  }, [id]);

  // ✅ Handle text input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Delete current image
  const handleDeleteImage = () => {
    if (confirm("Remove this image?")) {
      setImage(null);
      setPreview(null);
      setForm({ ...form, image: "" });
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append("title", form.title || "");
    formData.append("description", form.description || "");
    formData.append("author", form.author || "");

    

    if (image) {
      formData.append("image", image);
    } else if (form.image) {
      formData.append("existing_image", form.image);
    }

    const res = await fetch(
      `${UPDATE_ADMIN_URL}/blog.php?id=${id}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await res.json();
    setIsSaving(false);

    if (result.success) {
      alert("✅ Blog updated successfully!");
      router.push("/admin/blogs");
    } else {
      alert("❌ Update failed: " + result.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">
        Edit Blog
      </h1>

      {/* 🖼️ Image Section */}
      <div className="relative w-full mb-6 border rounded overflow-hidden bg-gray-50">
        {preview ? (
          <>
            <Image
              width={250}
              height={200}
               priority
              src={preview}
              alt="Blog"
             
              className="w-full h-64 object-cover"
            />
            <button
              type="button"
              onClick={handleDeleteImage}
              className="absolute top-0 right-0 bg-red-600 text-white text-sm rounded-full w-6 h-7 flex items-center justify-center shadow hover:bg-red-700"
            >
              ×
            </button>
          </>
        ) : (
          <label className="flex flex-col items-center justify-center h-64 cursor-pointer hover:bg-gray-100">
            <span className="text-gray-500 text-sm">+ Add Blog Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* 📝 Blog Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          className="border p-2 w-full rounded"
          value={form.title || ""}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="author"
          placeholder="Author"
          className="border p-2 w-full rounded"
          value={form.author || ""}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Write your blog content..."
          className="border p-2 w-full rounded h-48"
          value={form.description || ""}
          onChange={handleChange}
        ></textarea>

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
