"use client";
import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaShippingFast, FaCreditCard, FaRedoAlt, FaCheckCircle } from "react-icons/fa";

const FAQ = () => {
  const faqs = [
    {
      category: "General Questions",
      items: [
        { question: "What is Agiigo.com?", answer: "Agiigo.com is an online marketplace where buyers and sellers can connect to buy and sell a wide range of products across the UAE." },
        { question: "How does Agiigo.com work?", answer: "Sellers list items for auction or fixed-price, and buyers can browse, bid, or purchase. We ensure secure payments and seller protection." },
        { question: "Is Agiigo.com available outside Dubai?", answer: "Currently, Agiigo.com primarily serves Dubai." },
      ],
    },
    {
      category: "Buying on Agiigo.com",
      items: [
        { question: "How do I buy an item?", answer: "Browse listings, place a bid or click 'Buy Now' for fixed-price items, and proceed to checkout to complete your purchase." },
        { question: "What payment methods are accepted?", answer: "We accept credit/debit cards, Apple Pay, and cash on delivery for eligible orders." },
        { question: "Can I return an item if I'm not satisfied?", answer: "Returns depend on the seller's return policy. Always check the product listing details before purchasing." },
      ],
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            F.A.Q.s
          </h1>
          <p className="mt-4 text-xl text-gray-600">Find answers to common questions about Agiigo</p>
        </div>

        <div className="space-y-8">
          {faqs.map((section, sectionIdx) => (
            <div key={sectionIdx} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800">{section.category}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {section.items.map((faq, idx) => (
                  <div 
                    key={idx} 
                    className="p-6 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => toggleFAQ(`${sectionIdx}-${idx}`)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                      {openIndex === `${sectionIdx}-${idx}` ? (
                        <FaChevronUp className="text-orange-500" />
                      ) : (
                        <FaChevronDown className="text-gray-500" />
                      )}
                    </div>
                    {openIndex === `${sectionIdx}-${idx}` && (
                      <div className="mt-4 text-gray-600 transition-all duration-300 ease-in-out">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="flex justify-center text-orange-500 mb-4">
              <FaShippingFast size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Fast Shipping</h3>
            <p className="text-gray-600">Delivery across Dubai in 1-3 business days</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="flex justify-center text-orange-500 mb-4">
              <FaCreditCard size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Secure Payments</h3>
            <p className="text-gray-600">100% secure payment processing</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="flex justify-center text-orange-500 mb-4">
              <FaRedoAlt size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-gray-600">14-day return policy on most items</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="flex justify-center text-orange-500 mb-4">
              <FaCheckCircle size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Quality Guarantee</h3>
            <p className="text-gray-600">Verified sellers and authentic products</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;