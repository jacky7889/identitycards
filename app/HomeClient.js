import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Steps from "./steps/page";
import Products from "./products/page";
import ProductNav from "./components/ProductNav";
import { READ_URL } from "@/libs/config"; // Make sure to import READ_URL


export default async function HomeClient() {

  
  return (
    <>
      <Navbar/>
      <ProductNav/>
      <Hero />
      <Steps />
      <Products/>
    </>
  );
}