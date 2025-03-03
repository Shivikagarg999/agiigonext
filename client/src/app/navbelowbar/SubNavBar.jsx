"use client";

import { useState } from "react";
import { User, ShoppingCart, Settings, ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Overlay (to prevent objects from coming inside) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-10 left-6 z-50 bg-orange-500 p-2 rounded-full text-white shadow-md"
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-white shadow-md border-r border-gray-200 p-4 z-50"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h2>

        <nav className="flex flex-col space-y-4">
          <SidebarItem icon={<User size={20} />} text="Show Profile" />
          <SidebarItem icon={<ShoppingCart size={20} />} text="My Orders" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" />
        </nav>
      </motion.div>
    </>
  );
}

// Sidebar Item Component
const SidebarItem = ({ icon, text }) => (
  <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
    {icon}
    <span className="ml-3">{text}</span>
  </button>
);