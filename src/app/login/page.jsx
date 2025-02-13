"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../nav/Nav";
import Footer from "../footer/Footer";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (data.user.role === "buyer") {
        router.push("/buyer");
      } else if (data.user.role === "seller") {
        router.push("/seller");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
    <Nav/>
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
          <button type="submit" className="w-full bg-[#EB8426] text-white py-2 rounded hover:bg-orange-600">
            Login
          </button>
        </form>
        <p className="mt-2 text-sm">
          Don't have an account?{" "}
          <span className="text-[#EB8426] cursor-pointer font-semibold" onClick={() => router.push("/register")}>
            Register here
          </span>
        </p>
      </div>
    </div>
    <Footer/>
    </>
  );
}
