import EditReviewClient from './EditReviewClient';
import { READ_ADMIN_URL } from "@/libs/config";

// This runs on the server at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${READ_ADMIN_URL}/reviews.php`);
    if (!res.ok) {
      throw new Error('Failed to fetch reviews');
    }
    
    const data = await res.json();
    
    // Handle different API response formats
    let reviews = [];
    if (Array.isArray(data)) {
      reviews = data;
    } else if (data?.reviews && Array.isArray(data.reviews)) {
      reviews = data.reviews;
    } else if (data?.data && Array.isArray(data.data)) {
      reviews = data.data;
    } else if (data) {
      reviews = [data];
    }
    
    if (reviews.length === 0) {
      return [{ id: '1' }];
    }
    
    return reviews.map((review) => ({
      id: review.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ id: '1' }];
  }
}

// Optional: Add metadata
export const metadata = {
  title: 'Edit Review',
  description: 'Edit customer review details',
};

export default function EditReviewPage({ params }) {
  return <EditReviewClient id={params.id} />;
}