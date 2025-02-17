"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../nav/Nav";
import Footer from "../footer/Footer";
const api_url = process.env.NEXT_PUBLIC_API_URL;

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading

    try {
      const res = await fetch('https://api.agiigo.com/api/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
                         
      // Check if response is not ok (e.g. invalid credentials)
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (data.user.role === "buyer") {
        router.push("/pages/buyer");
      } else if (data.user.role === "seller") {
        router.push("/seller");
      }
    } catch (err) {
      setError(err.message); // Set the error message
    } finally {
      setLoading(false); // Stop loading when the request is complete
    }
  };

  return (
    <>
      <Nav />
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-100">
        <div className="bg-white p-6 pt-10 pb-16 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-[#EB8426] text-center">Login</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>} {/* Error message */}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 mb-4 rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#EB8426] text-white py-2 mb-4 rounded hover:bg-orange-600"
              disabled={loading} // Disable the button while loading
            >
              {loading ? "Logging in..." : "Login"} {/* Show loading text */}
            </button>
          </form>
          <p className="mt-2 text-black text-sm">
            Don't have an account?{" "}
            <span
              className="text-[#EB8426] cursor-pointer font-semibold"
              onClick={() => router.push("/register")}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
