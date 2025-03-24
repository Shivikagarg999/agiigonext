"use client"

import { useState } from "react";
import { FaQuestionCircle, FaShippingFast, FaCreditCard, FaRedoAlt, FaCheckCircle } from "react-icons/fa";

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
        { question: "Can I return an item if I’m not satisfied?", answer: "Returns depend on the seller’s return policy. Always check the product listing details before purchasing." },
      ],
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="max-w-4xl w-full px-6">
        <h1 className="text-4xl text-black font-semibold text-center mb-8">F.A.Q.s</h1>
        <div className="space-y-6">
          {faqs.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">{section.category}</h2>
              <div className="space-y-4">
                {section.items.map((faq, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow cursor-pointer" onClick={() => toggleFAQ(`${sectionIdx}-${idx}`)}>
                    <div className="flex justify-between text-black items-center">
                      <p className="font-medium text-lg">{faq.question}</p>
                      <FaQuestionCircle className="text-indigo-600" size={20} />
                    </div>
                    {openIndex === `${sectionIdx}-${idx}` && (
                      <p className="text-gray-600 mt-2 transition-all duration-300">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;