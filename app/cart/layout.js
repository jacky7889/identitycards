import Navbar from "../components/Navbar/Navbar";



export default function RootLayout({ children }) {
  return (
    <>
      <Navbar/>
     <main className="max-w-7xl mx-auto">{children}</main>
    </>
  );
}
