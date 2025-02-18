"use client"

import BrowseByCategory from "@/app/category/page"
import Home from "@/app/home/Home"
import Nav from "@/app/nav/Nav"
import NewArrivals from "@/app/newArrivals/NewArrivals"
import Products from "@/app/products/Products"
import TrendingProducts from "@/app/trendingProducts/TrendingProducts"
import FAQ from "@/app/FAQs/Faqs"
import Footer from "@/app/footer/Footer"

export default function Buyer(){
    return (
        <>
         <Nav/>
         <Home/>
         <Products/>
         <BrowseByCategory/>
         <TrendingProducts/>
         <NewArrivals/>
         <FAQ/>
         <Footer/>
        </>
    )
}