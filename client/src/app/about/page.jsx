"use client"; 

import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion"; 
import Nav from "../nav/Nav";
import Footer from "../footer/Footer";
import TopBar from "../components/TopBar";
import FAQ from "../FAQs/Faqs";

const AboutUs = () => {
  return (
    <div className="bg-white">
      <TopBar/>
      <Nav />
      <section className="container mx-auto bg-white px-6 mt-8 py-12 flex flex-col md:flex-row items-center">
        {/* Left Section - Animating text */}
        <motion.div 
          className="md:w-1/2"
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span 
            className="bg-blue-600 text-white px-3 py-1 text-sm font-semibold rounded-md"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            WHO WE ARE
          </motion.span>
          <h2 className="text-3xl font-bold mt-4 text-black">Agiigo – The Ultimate Marketplace</h2>
          <p className="text-gray-600 mt-4">
            At Agiigo, we are a dynamic online marketplace that connects sellers and buyers seamlessly. 
            Our platform enables sellers to list and showcase their products while providing buyers with 
            a diverse selection of high-quality electronics, gadgets, and more – all in one place. We aim 
            to create a smooth, secure, and efficient shopping experience for both sellers and customers.
          </p>

          {/* Benefits List - Animating each item */}
          <motion.ul 
            className="mt-6 space-y-3 text-gray-700"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            {[
              "A powerful platform for sellers to reach a wider audience",
              "A vast collection of products from multiple trusted sellers",
              "Secure transactions for a hassle-free buying experience",
              "24/7 customer support to assist buyers and sellers",
              "Competitive pricing with exciting deals and offers",
            ].map((text, index) => (
              <motion.li 
                key={index} 
                className="flex items-center"
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
              >
                <CheckCircle className="text-blue-600 w-5 h-5 mr-2" /> {text}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right Section - Animating Image */}
        <motion.div 
          className="md:w-1/2 mt-8 md:mt-0 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
         <Image
  src="/images/about.jpg"  // No need for import, just use the path inside /public
  alt="About Us"
  width={500}
  height={300}
  className="rounded-lg shadow-md"
/>
        </motion.div>
      </section>
      <div className="relative w-full h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/Banner.jpg')" }}>
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
        {/* Text Content */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Your trusted and <br /> reliable shop
          </h2>
          <p className="text-gray-600 text-lg">
            At Agiigo, we strive to offer top-quality products that cater to your needs. Whether you're looking for cutting-edge gadgets or everyday essentials, we have a wide selection of flash sales, best sellers, top-rated products, and new arrivals to keep you ahead of the curve.
          </p>
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }} 
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition">
            ▶
          </motion.button>
        </div>
      </div>
    </div>
      <FAQ/>
      <Footer />
    </div>
  );
};

export default AboutUs;