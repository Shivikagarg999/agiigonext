"use client";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { RiCustomerService2Line, RiTruckLine, RiShieldCheckLine, RiExchangeLine } from "react-icons/ri";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Agiigo.com?",
      answer: "Agiigo.com is an online marketplace where buyers and sellers can connect to buy and sell a wide range of products across the UAE."
    },
    {
      question: "How does Agiigo.com work?",
      answer: "Sellers list items for auction or fixed-price, and buyers can browse, bid, or purchase. We ensure secure payments and seller protection."
    },
    {
      question: "Is Agiigo.com available outside Dubai?",
      answer: "Currently, Agiigo.com primarily serves Dubai."
    },
    {
      question: "How do I buy an item?",
      answer: "Browse listings, place a bid or click 'Buy Now' for fixed-price items, and proceed to checkout to complete your purchase."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept credit/debit cards, Apple Pay, and cash on delivery for eligible orders."
    },
    {
      question: "Can I return an item if I'm not satisfied?",
      answer: "Returns depend on the seller's return policy. Always check the product listing details before purchasing."
    }
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            F.A.Q.s
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Find answers to your questions
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border-b border-gray-200 last:border-b-0 ${expandedIndex === index ? 'bg-gray-50' : ''}`}
            >
              <button
                className="w-full flex justify-between items-center p-5 text-left"
                onClick={() => toggleFAQ(index)}
                aria-expanded={expandedIndex === index}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {expandedIndex === index ? (
                  <FiChevronUp className="text-gray-500 ml-4" />
                ) : (
                  <FiChevronDown className="text-gray-500 ml-4" />
                )}
              </button>
              {expandedIndex === index && (
                <div className="px-5 pb-5 -mt-2 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Services Section - Temu/Flipkart Style */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-start">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <RiTruckLine className="text-orange-500 text-xl" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over AED 100</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-start">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <RiExchangeLine className="text-orange-500 text-xl" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Easy Returns</h3>
              <p className="text-sm text-gray-600">14-day return policy</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-start">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <RiShieldCheckLine className="text-orange-500 text-xl" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% protected</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-start">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <RiCustomerService2Line className="text-orange-500 text-xl" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">24/7 Support</h3>
              <p className="text-sm text-gray-600">Dedicated support</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-orange-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Still have questions?</h3>
          <p className="text-gray-600 mb-5">
            We're here to help. Contact our customer support team.
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;