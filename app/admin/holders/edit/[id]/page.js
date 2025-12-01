import EditHolderClient from './EditHolderClient';
import { READ_ADMIN_URL } from "@/libs/config";

// This runs on the server at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${READ_ADMIN_URL}/holders.php`);
    if (!res.ok) {
      throw new Error('Failed to fetch holders');
    }
    
    const data = await res.json();
    const holders = Array.isArray(data) ? data : (data ? [data] : []);
    
    if (holders.length === 0) {
      return [{ id: '1' }];
    }
    
    return holders.map((holder) => ({
      id: holder.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ id: '1' }];
  }
}

// Optional: Add metadata
export const metadata = {
  title: 'Edit Holder',
  description: 'Edit holder details and images',
};

export default function EditHolderPage({ params }) {
  return <EditHolderClient id={params.id} />;
}