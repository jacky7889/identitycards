// app/profile/page.js
import { READ_URL } from "@/libs/config";
import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "My Profile | Your Account",
  description: "View and manage your profile information and account settings",
};

async function getProfileData(userId) {
  try {
    const res = await fetch(`${READ_URL}/users.php?id=${userId}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { success: false, message: "Failed to fetch profile" };
  }
}

async function getOrdersData(userId) {
  try {
    const res = await fetch(`${READ_URL}/orders.php?userId=${userId}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, message: "Failed to fetch orders" };
  }
}

export default async function Profile() {
  // In a real app, you'd get userId from the session or token
  // For now, we'll pass it as a prop to the client component
  // The client component will handle the localStorage check
  
  return <ProfileClient />;
}