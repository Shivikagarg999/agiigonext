"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Nav from "@/app/nav/SellerNav";
import Footer from "@/app/footer/Footer";

export default function SellerProfile() {
    const { id } = useParams();
    const router = useRouter();
    const [sellerData, setSellerData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const token = Cookies.get("token");
        const userData = Cookies.get("user");

        if (!token || !userData) {
            router.push("/login");
            return;
        }

        const parsedUser = JSON.parse(userData);

        if (!id || parsedUser._id !== id) {
            router.push("/login"); // Prevent access to other seller profiles
            return;
        }

        const fetchSellerData = async () => {
            try {
                const response = await fetch(`https://api.agiigo.com/api/profile/seller/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch seller data");

                const data = await response.json();
                setSellerData(data);
                setFormData(data);
            } catch (error) {
                console.error("Error fetching seller data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerData();
    }, [id, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const token = Cookies.get("token");
            const response = await fetch(`https://api.agiigo.com/api/profile/seller/${id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update profile");

            setSellerData(formData);
            setEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <>
            <Nav />
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
                <div className="flex justify-end">
                    {editing ? (
                        <>
                            <button
                                onClick={() => setEditing(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-4">Seller Profile</h1>

                <div className="space-y-4">
                    {["name", "email", "contact", "address", "state", "city", "country", "pincode"].map((field) => (
                        <div key={field}>
                            <label className="block text-gray-600 font-semibold capitalize">{field}</label>
                            {editing ? (
                                <input
                                    type={field === "pincode" ? "number" : "text"}
                                    name={field}
                                    value={formData[field] || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            ) : (
                                <p className="p-2 bg-gray-100 rounded-md">{sellerData[field] || "N/A"}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}