"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar/Navbar";

export default function ProfileClient() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const baseUrl = "http://localhost/php-backend/public/images/";

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in first");
      router.push("/login");
      return;
    }

    fetch(`http://localhost/php-backend/read/orders.php?userId=${userId}`)
      .then((res) => res.json())
     .then((data) => {
         if (data.success) {
          const parsedOrders = data.orders.map((order) => ({
            ...order,
            items: typeof order.items === "string" ? JSON.parse(order.items) : order.items,
            customer: typeof order.customer === "string" ? JSON.parse(order.customer) : order.customer,
            shipping: typeof order.shipping === "string" ? JSON.parse(order.shipping) : order.shipping,
            billing: typeof order.billing === "string" ? JSON.parse(order.billing) : order.billing,
          }));
          setOrders(parsedOrders);
        } else {
          console.error(data.message);
        }
        setLoading(false);
      })

      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, [router]);

  if (loading) return <p className="text-center py-10">Loading your orders...</p>;

  return (
    <>
    <Navbar/>
       <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto p-5">
           <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
           <div className="space-y-6">
                       {orders.length === 0 ? (
                         <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                           <div className="max-w-md mx-auto">
                             <div className="text-gray-400 mb-4">
                               <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                               </svg>
                             </div>
                             <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                             <p className="text-gray-500 mb-6">{`You haven't placed any orders with us yet.`}</p>
                             <button
                               onClick={() => router.push("/")}
                               className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors"
                             >
                               Start Shopping
                             </button>
                           </div>
                         </div>
                       ) : (
                         orders.map((order) => (
                           <div
                             key={order.id}
                             className="border rounded-lg shadow-sm p-6 bg-white space-y-4"
                           >
                             {/* Order details - same as before */}
                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-3">
                               <div>
                                 <h2 className="font-semibold text-lg text-gray-700">
                                   Order #{order.id}
                                 </h2>
                                 <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                   order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                   order.status === 'processing' ? 'bg-pink-100 text-green-800' :
                                   order.status === 'shipped' ? 'bg-blue-100 text-green-800' :
                                   order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                   order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                   'bg-blue-100 text-blue-800'
                                 }`}>
                                   {order.status}
                                 </span>
                               </div>
                               <p className="text-lg font-semibold text-gray-900 mt-2 md:mt-0">
                                 ₹{Number(order.amount).toLocaleString()}
                               </p>
                             </div>
         
                             {/* Rest of order details */}
                             <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                               <div>
                                 <h3 className="font-semibold mb-2 text-gray-900">Customer</h3>
                                 <p>{order.user_name}</p>
                               </div>
                               <div>
                                 <h3 className="font-semibold mb-2 text-gray-900">Shipping Address</h3>
                                 {order.shipping && Object.entries(order.shipping).map(([key, value]) => (
                                   <p key={key} className="capitalize">
                                     <span className="font-medium">{key}:</span> {value}
                                   </p>
                                 ))}
                               </div>
                               <div>
                                 <h3 className="font-semibold mb-2 text-gray-900">Billing Address</h3>
                                 {order.billing && Object.entries(order.billing).map(([key, value]) => (
                                   <p key={key} className="capitalize">
                                     <span className="font-medium">{key}:</span> {value}
                                   </p>
                                 ))}
                               </div>
                             </div>
         
                             <div>
                               <h3 className="font-semibold mb-3 text-gray-900">Order Items</h3>
                               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                 {Array.isArray(order.items) && order.items.map((item, i) => (
                                   <div key={i} className="border p-4 rounded-lg flex gap-4 bg-gray-50">
                                     {item.image && (
                                       <Image
                                         src={`${baseUrl}${Array.isArray(item.image) ? item.image[0] : item.image}`}
                                         alt={item.product_name || item.title}
                                         width={80}
                                         height={80}
                                         className="object-cover rounded flex-shrink-0"
                                       />
                                     )}
                                     <div className="text-sm flex-1">
                                       <p className="font-medium text-gray-900 mb-1">{item.product_name || item.title}</p>
                                       <p className="text-gray-600">Quantity: {item.quantity}</p>
                                       <p className="text-gray-600">Price: ₹{item.price}</p>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             </div>
         
                             <div className="text-right text-sm text-gray-500 pt-2 border-t">
                               <p>Ordered on: {new Date(order.created_at).toLocaleDateString()}</p>
                             </div>
                           </div>
                         ))
                       )}
          </div>
     </div>
     </div>
     </>
  );
}