import Navbar from "../components/Navbar/Navbar";

// app/about/layout.js
export default function RootLayout({ children }) {
  return (
    <>
        <Navbar/>
      <main>{children}</main>
    </>
  );
}
