import CsvUpload from "../csvProd/CsvProds";
import Footer from "../footer/Footer";
import Nav from "../nav/Nav";
import AddProduct from "../pages/addProducts/page";

export default function SellerPage() {
    return (
      <>
        <Nav/>
        <AddProduct/>
        <CsvUpload/>
        <Footer/>
      </>
    );
  }
  