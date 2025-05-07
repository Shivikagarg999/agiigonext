"use client"; 

import Image from "next/image";
import { CheckCircle, Rocket, PieChart,ArrowRight, Shield} from "lucide-react";
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
          <h2 className="text-3xl font-bold mt-4 text-black">Your Trusted Online Marketplace in Dubai</h2>
          <p className="text-gray-600 mt-4">
          At Agiigo, we’ve created a platform where buying and selling online is easy, secure, and reliable. We focus on the local market in Dubai and the UAE, offering a place where buyers can find quality products and sellers can connect with customers looking for great deals.
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
             "A reliable platform for sellers to expand their reach across the UAE",
"A diverse range of products from trusted local sellers",
"Safe transactions for a worry-free shopping experience",
"Friendly customer support available around the clock for both buyers and sellers",
"Great deals and competitive pricing on products you love",
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
  Your Go-To Marketplace for Quality Products
</h2>
<p className="text-gray-600 text-lg">
  At Agiigo, we’re committed to bringing you the best products at great prices. Whether you're shopping for the latest gadgets, home essentials, or exclusive deals, our collection of top-rated items, new arrivals, and best sellers ensures you’ll always find what you need.
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
    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-xs mt-12">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
    <div className="flex-1">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Grow Your Business with Agiigo Seller Hub</h3>
      <p className="text-gray-600 text-lg">
      Agiigo is not just for buyers.We’re also a powerful platform for sellers across Dubai and the UAE. Whether you're a business or an individual, you can set up your store and start reaching thousands of local customers. </p>
    </div>
    
    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3">
      <a 
        href="https://sellerhub.agiigo.com" 
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
      >
        Start Selling Now
      </a>
    </div>
  </div>
  
  <div className="mt-6 pt-6 border-t border-gray-100">
    <div className="flex flex-wrap gap-x-8 gap-y-4">
      <div className="flex items-center">
        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
        <span className="text-gray-700">No monthly fees</span>
      </div>
      <div className="flex items-center">
        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
        <span className="text-gray-700">Easy product upload</span>
      </div>
      <div className="flex items-center">
        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
        <span className="text-gray-700">24/7 seller support</span>
      </div>
    </div>
  </div>
</div>
      <FAQ/>
      <Footer />
    </div>
  );
};

export default AboutUs;