// utils/storage.js

export const saveItemToLocalStorage = (category, item) => {
  try {
    // Get current cart from localStorage
    const existing = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Check if this item already exists (same category + id)
    const index = existing.findIndex(
      (i) => i.id === item.id && i.category === category
    );

    if (index !== -1) {
      // ✅ Update existing item (merge new fields)
      existing[index] = { ...existing[index], ...item };
    } else {
      // ✅ Add new item
      existing.push({ ...item, category });
    }

    // Save back to localStorage
    localStorage.setItem("cartItems", JSON.stringify(existing));

    // console.log("🛒 Cart updated:", existing);
  } catch (err) {
    console.error("Error saving item to localStorage:", err);
  }
};
