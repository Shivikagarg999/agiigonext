'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PopupNewsletter() {
  const [showPopup, setShowPopup] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenNewsletterPopup')
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true)
        localStorage.setItem('hasSeenNewsletterPopup', 'true')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  const closePopup = () => {
    setShowPopup(false)
    setMessage('')
    setEmail('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('https://agi.agiigo.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessage(data.message || 'Subscription successful!')
        setEmail('')
        setTimeout(closePopup, 2000) // Close popup after 2 seconds on success
      } else {
        setMessage(data.message || 'Subscription failed')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closePopup}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Special Offer!</h3>
              <button 
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Get 10% off your first order when you subscribe to our newsletter!
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="flex shadow-md rounded-lg overflow-hidden">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 text-gray-800 outline-none border border-gray-300 rounded-l-lg"
                  required
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-medium rounded-r-lg transition-colors disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Subscribe'}
                </button>
              </div>
            </form>

            {message && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-3 text-sm ${
                  message.includes('success') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {message}
              </motion.p>
            )}
            
            <p className="mt-3 text-xs text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}