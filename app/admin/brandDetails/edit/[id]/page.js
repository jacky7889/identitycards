import { READ_ADMIN_URL } from '@/libs/config';
import EditBrandClient from './EditBrandClient';

// This runs on the server at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${READ_ADMIN_URL}/contact_locations.php`);
    if (!res.ok) {
      throw new Error('Failed to fetch contact locations');
    }
    
    const data = await res.json();
    const contacts = Array.isArray(data?.data) ? data.data : (data ? [data] : []);
    
    if (contacts.length === 0) {
      return [{ id: '1' }];
    }
    
    return contacts.map((contact) => ({
      id: contact.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ id: '1' }];
  }
}

// Optional: Add metadata
export const metadata = {
  title: 'Edit Contact Details',
  description: 'Edit company contact and brand details',
};

export default function EditContactPage({ params }) {
  return <EditBrandClient id={params.id} />;
}