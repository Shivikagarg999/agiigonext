'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('https://api.agiigo.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessage('Thanks for subscribing!')
        setEmail('')
      } else {
        setMessage(data.message || 'Subscription failed. Please try again.')
      }
    } catch (error) {
      setMessage('Network error. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-indigo-600 text-white py-16 px-6 flex flex-col items-center text-center">
      <h2 className="text-2xl font-bold mb-4">Yes! Stay Updated</h2>
      <p className="text-indigo-100 text-lg max-w-md leading-relaxed">
        Get exclusive offers, unique gift ideas, and personalized shopping tips delivered to your inbox.
      </p>
      
      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-md">
        <div className="flex shadow-lg rounded-full overflow-hidden">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-6 py-3 text-gray-800 outline-none placeholder-gray-400"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-6 py-3 flex items-center gap-1 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              'Subscribing...'
            ) : (
              <>
                Subscribe <span className="text-xl">→</span>
              </>
            )}
          </button>
        </div>
      </form>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 text-sm ${
            message.includes('Thanks') ? 'text-green-300' : 'text-orange-200'
          }`}
        >
          {message}
        </motion.p>
      )}
      
      <p className="mt-4 text-sm text-indigo-200">
        First order only. <a href="#" className="underline hover:text-white transition-colors">Terms apply</a>
      </p>
    </div>
  )
}