// import AddProduct from "./addProduct/AddProduct";
import Nav from "./nav/Nav"
import BrowseByCategory from "./category/page";
import NewArrivals from "./newArrivals/NewArrivals";
import Products from "./products/Products";
import TrendingProducts from "./trendingProducts/TrendingProducts";
import Home from "./home/Home";
import Footer from "./footer/Footer";
import FAQ from "./FAQs/Faqs";
import TopBar from "./components/TopBar";
import Features from "./components/Features";

export default function Page() {
  return (
    <>
    <TopBar/>
    <Nav/>
    <Home/>
    <Features/>
    <Products/>
    <BrowseByCategory/>
    <TrendingProducts/>
    <NewArrivals/>
    <FAQ/>
    <Footer/>
    </>
  );
}
