// components/Blog.jsx

import BlogClient from "./BlogClient";
import { READ_URL } from "@/libs/config";

export default async function Blog() {
  async function getBlogs() {
    try {
      const res = await fetch(
        `${READ_URL}/blogs.php`,
        { cache: "no-store" } // always fetch fresh data
      );

      if (!res.ok) throw new Error("Failed to fetch blogs");

      const data = await res.json();
      if (Array.isArray(data)) return data;
    } catch (err) {
      console.error("Blog fetch failed:", err);
    }

    return []; // fallback
  }

  const blogs = await getBlogs();

  return <BlogClient blogs={blogs} />;
}
