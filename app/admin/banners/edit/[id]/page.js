import { READ_ADMIN_URL } from '@/libs/config';
import EditBannerClient from './EditBannerClient';

// This runs on the server at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${READ_ADMIN_URL}/banners.php`);
    if (!res.ok) {
      throw new Error('Failed to fetch banners');
    }
    
    const data = await res.json();
    const banners = Array.isArray(data) ? data : (data ? [data] : []);
    
    if (banners.length === 0) {
      return [{ id: '1' }];
    }
    
    return banners.map((banner) => ({
      id: banner.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ id: '1' }];
  }
}

// Optional: Add metadata
export const metadata = {
  title: 'Edit Banner',
  description: 'Edit banner details',
};

export default function EditBannerPage({ params }) {
  return <EditBannerClient id={params.id} />;
}