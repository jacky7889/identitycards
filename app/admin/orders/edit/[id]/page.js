import EditOrderClient from './EditOrderClient';
import { READ_ADMIN_URL } from "@/libs/config";

// This runs on the server at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${READ_ADMIN_URL}/orders.php`);
    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }
    
    const data = await res.json();
    const orders = Array.isArray(data) ? data : (data ? [data] : []);
    
    if (orders.length === 0) {
      return [{ id: '1' }];
    }
    
    return orders.map((order) => ({
      id: order.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ id: '1' }];
  }
}

// Optional: Add metadata
export const metadata = {
  title: 'Edit Order',
  description: 'Update order status and details',
};

export default function EditOrderPage({ params }) {
  return <EditOrderClient id={params.id} />;
}