import TopBar from "../components/TopBar";
import CsvUpload from "../csvProd/CsvProds";
import Footer from "../footer/Footer";
import Nav from "../nav/Nav";
import AddProduct from "../pages/addProducts/page";
// import SellerProducts from "../sellerproducts/page";

export default function SellerPage() {
    return (
      <>
        <Nav/>
        <AddProduct/>
        <CsvUpload/>
        {/* <SellerProducts/> */}
        <Footer/>
      </>
    );
  }
  