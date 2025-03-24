"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../nav/Nav";
import Footer from "../footer/Footer";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://api.agiigo.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Store token and user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "buyer") {
        router.push("/pages/buyer");
      } else if (data.user.role === "seller") {
        router.push("/seller");
      } else {
        throw new Error("Invalid user role");
      }
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-100">
        <div className="bg-white p-6 pt-10 pb-16 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-[#EB8426] text-center">Login</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
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
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
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