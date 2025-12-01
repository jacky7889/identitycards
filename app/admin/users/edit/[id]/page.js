import EditUserClient from './EditUserClient';
import { READ_ADMIN_URL } from "@/libs/config";

// This runs on the server at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${READ_ADMIN_URL}/users.php`);
    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }
    
    const data = await res.json();
    const users = Array.isArray(data) ? data : (data ? [data] : []);
    
    if (users.length === 0) {
      return [{ id: '1' }];
    }
    
    return users.map((user) => ({
      id: user.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ id: '1' }];
  }
}

// Optional: Add metadata
export const metadata = {
  title: 'Edit User',
  description: 'Edit user details and information',
};

export default function EditUserPage({ params }) {
  return <EditUserClient id={params.id} />;
}