"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../nav/Nav";
import Footer from "../footer/Footer";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://api.agiigo.com/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset link");
      }

      setSuccess(true);
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#EB8426] hover:text-orange-600 mb-4"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <h2 className="text-2xl font-bold mb-6 text-[#EB8426] text-center">
            Forgot Password
          </h2>

          {success ? (
            <div className="text-center">
              <FaCheckCircle className="mx-auto text-green-500 text-5xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Reset Link Sent!</h3>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your inbox.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-[#EB8426] text-white py-2 rounded hover:bg-orange-600"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6 text-center">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#EB8426] focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-[#EB8426] text-white py-2.5 rounded hover:bg-orange-600 transition-colors ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              <div className="mt-4 text-center text-sm">
                <p className="text-gray-600">
                  Remember your password?{" "}
                  <button
                    onClick={() => router.push("/login")}
                    className="font-medium text-[#EB8426] hover:text-orange-600 focus:outline-none"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}