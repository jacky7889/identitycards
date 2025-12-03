import Navbar from "../components/Navbar/Navbar";
import ProductNav from "../components/ProductNav";

// app/about/layout.js
export default function RootLayout({ children }) {
  return (
    <>
        <Navbar/>
        <ProductNav/>
   <main className="max-w-7xl mx-auto">{children}</main>
    </>
  );
}
