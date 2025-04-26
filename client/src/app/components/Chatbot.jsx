// app/components/Chatbot.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '🌟 Welcome to Agiigo! I am your shopping assistant. How can I help you today?',
      sender: 'bot',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message with animation
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };
    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate typing indicator
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: '...',
        sender: 'bot',
        typing: true
      }]);

      // Replace typing indicator with actual response
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.typing ? botResponse : msg
        ));
      }, 1000 + Math.random() * 1000); // Random typing delay
    }, 800);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // FAQ responses with emojis
    const faqs = [
      { q: 'what is agiigo', a: '🛍️ Agiigo is a Dubai-based online marketplace where you can shop, bid, and sell a wide range of products at great prices!' },
      { q: 'create account', a: '📝 Click "Sign Up" at the top right corner and fill in your details to join Agiigo in just 1 minute!' },
      { q: 'sell products', a: '💰 Yes! Register as a seller, upload your products, and start selling across the UAE. We handle payments and delivery!' },
      { q: 'payment methods', a: '💳 We accept: Cards (Visa/Mastercard) and Cash on Delivery (COD for select items)' },
      { q: 'bidding', a: '🎯 Place bids on auction items! The highest bid when time expires wins. Pro tip: Set your max bid and we\'ll auto-bid for you!' },
      { q: 'delivery', a: '🚚 We deliver across UAE in 2-5 days. Express options available! Track your order in real-time once shipped.' },
      { q: 'return', a: '🔄 7-day easy returns! If item is damaged/wrong, we\'ll pick it up and refund or replace it.' },
      { q: 'contact', a: '📧 Reach us: • Live chat • Email: support@agiigo.com • Phone: 800-AGIIGO' }
    ];

    // Check for matching FAQ
    for (const faq of faqs) {
      if (input.includes(faq.q)) {
        return {
          id: Date.now() + 2,
          text: faq.a,
          sender: 'bot',
          emoji: '✨'
        };
      }
    }

    // Default responses
    if (input.includes('hello') || input.includes('hi')) {
      return {
        id: Date.now() + 2,
        text: '👋 Hi there! Ready to shop or need help? Ask me anything about Agiigo!',
        sender: 'bot'
      };
    } else if (input.includes('thank')) {
      return {
        id: Date.now() + 2,
        text: '😊 You\'re welcome! Happy to help. Anything else you\'re curious about?',
        sender: 'bot'
      };
    } else {
      return {
        id: Date.now() + 2,
        text: '🤔 I\'d love to help! Could you rephrase your question? Or try:\n• "How to bid?"\n• "Return policy"\n• "Payment options"',
        sender: 'bot'
      };
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Floating bubble animation
  const floatingVariants = {
    initial: { y: 0 },
    animate: { 
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 text-black">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: { type: 'spring', damping: 20, stiffness: 300 }
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`relative w-80 ${isMinimized ? 'h-16' : 'h-[500px]'} bg-white rounded-xl shadow-2xl flex flex-col border-2 border-orange-200 overflow-hidden`}
          >
            {/* Chat header with minimize button */}
            <motion.div 
              layout
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-t-lg flex justify-between items-center cursor-pointer"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <motion.h3 
                animate={{ x: isMinimized ? -10 : 0 }}
                className="font-bold text-lg flex items-center gap-2"
              >
                <span className="bg-white text-amber-600 rounded-full w-6 h-6 flex items-center justify-center">✦</span>
                Agiigo Assistant
              </motion.h3>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                  className="text-white"
                >
                  <FiChevronDown 
                    size={20} 
                    className={`transition-transform ${isMinimized ? 'rotate-180' : ''}`}
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="text-white"
                >
                  <FiX size={20} />
                </motion.button>
              </div>
            </motion.div>

            {!isMinimized && (
              <>
                {/* Messages container with orange peel pattern */}
                <motion.div 
                  layout
                  className="flex-1 p-4 overflow-y-auto bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMTk2LDEyOCwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0id2hpdGUiLz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]"
                >
                  <LayoutGroup>
                    {messages.map((message) => (
                      <motion.div
                        layout
                        key={message.id}
                        initial={{ opacity: 0, y: message.sender === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 500,
                          damping: 25
                        }}
                        className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                      >
                        <motion.div
                          layout
                          className={`inline-block px-4 py-3 rounded-2xl max-w-[85%] relative overflow-hidden ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                              : 'bg-white text-gray-800 border border-orange-100 shadow-sm'
                          }`}
                        >
                          {/* Message shine effect */}
                          {message.sender === 'user' && (
                            <motion.div
                              initial={{ x: -100, opacity: 0 }}
                              animate={{ x: 300, opacity: 0.4 }}
                              transition={{ 
                                delay: 0.3,
                                duration: 1.5,
                                repeat: Infinity,
                                repeatDelay: 3
                              }}
                              className="absolute top-0 left-0 w-20 h-full bg-white/30 transform skew-x-12"
                            />
                          )}
                          
                          {message.typing ? (
                            <div className="flex space-x-1 py-1">
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ 
                                    y: [0, -5, 0],
                                    opacity: [0.6, 1, 0.6]
                                  }}
                                  transition={{ 
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                  }}
                                  className="w-2 h-2 bg-amber-500 rounded-full"
                                />
                              ))}
                            </div>
                          ) : (
                            message.text.split('\n').map((line, i) => (
                              <p key={i}>{line}</p>
                            ))
                          )}
                        </motion.div>
                      </motion.div>
                    ))}
                  </LayoutGroup>
                  <div ref={messagesEndRef} />
                </motion.div>
                
                {/* Input area with animated button */}
                <motion.div 
                  layout
                  className="p-4 border-t border-orange-200 bg-white"
                >
                  <motion.div 
                    layout
                    className="flex items-center gap-2"
                  >
                    <motion.input
                      layout
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about Agiigo..."
                      className="flex-1 border-2 border-orange-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                      whileFocus={{ 
                        scale: 1.01,
                        boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.5)'
                      }}
                    />
                    <motion.button
                      layout
                      onClick={handleSendMessage}
                      whileHover={{ 
                        scale: 1.05,
                        // background: 'linear-gradient(135deg, #f97316, #f59e0b)'
                      }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!inputValue.trim()}
                      className={`p-3 rounded-xl ${inputValue.trim() ? 
                        'bg-gradient-to-r from-orange-500 to-amber-500 text-white' : 
                        'bg-orange-500 text-white'}`}
                    >
                      <FiSend size={20} />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.button
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            onClick={() => setIsOpen(true)}
            whileHover={{ 
              scale: 1.1,
              rotate: [0, 5, -5, 0],
              transition: { duration: 0.5 }
            }}
            whileTap={{ scale: 0.9 }}
            className="relative bg-gradient-to-br from-orange-500 to-amber-500 text-white p-5 rounded-full shadow-xl hover:shadow-2xl"
          >
            {/* Pulsing glow effect */}
            <motion.div
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ 
                scale: 1.5,
                opacity: 0,
                transition: { 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }
              }}
              className="absolute inset-0 rounded-full bg-amber-400 z-0"
            />
            <FiMessageSquare size={28} className="relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;