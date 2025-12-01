import { READ_ADMIN_URL } from '@/libs/config';
import EditCardClient from './EditCardClient';

// This runs on the server at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${READ_ADMIN_URL}/cards.php`);
    if (!res.ok) {
      throw new Error('Failed to fetch cards');
    }
    
    const data = await res.json();
    const cards = Array.isArray(data) ? data : (data ? [data] : []);
    
    if (cards.length === 0) {
      return [{ id: '1' }];
    }
    
    return cards.map((card) => ({
      id: card.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ id: '1' }];
  }
}

// Optional: Add metadata
export const metadata = {
  title: 'Edit Card',
  description: 'Edit card details and images',
};

export default function EditCardPage({ params }) {
  return <EditCardClient id={params.id} />;
}