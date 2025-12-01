import EditLanyardClient from './EditLanyardClient';
import { READ_ADMIN_URL } from "@/libs/config";

// This runs on the server at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${READ_ADMIN_URL}/lanyards.php`);
    if (!res.ok) {
      throw new Error('Failed to fetch lanyards');
    }
    
    const data = await res.json();
    const lanyards = Array.isArray(data) ? data : (data ? [data] : []);
    
    if (lanyards.length === 0) {
      return [{ id: '1' }];
    }
    
    return lanyards.map((lanyard) => ({
      id: lanyard.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ id: '1' }];
  }
}

// Optional: Add metadata
export const metadata = {
  title: 'Edit Lanyard',
  description: 'Edit lanyard details and images',
};

export default function EditLanyardPage({ params }) {
  return <EditLanyardClient id={params.id} />;
}