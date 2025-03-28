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
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    useEffect(() => {
        const token = Cookies.get("token");
        const userData = Cookies.get("user");

        if (!token || !userData) {
            router.push("/login");
            return;
        }

        const parsedUser = JSON.parse(userData);

        if (!id || parsedUser._id !== id) {
            router.push("/login"); 
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
                setImagePreview(data.pfp || null);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const token = Cookies.get("token");
            const formDataToSend = new FormData();

            // Append text fields
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, formData[key]);
            });

            // Append image file if changed
            if (imageFile) {
                formDataToSend.append("pfp", imageFile);
            }

            const response = await fetch(`https://api.agiigo.com/api/profile/seller/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }, // No "Content-Type" for FormData
                body: formDataToSend,
            });

            if (!response.ok) throw new Error("Failed to update profile");

            const updatedData = await response.json();
            setSellerData(updatedData);
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

                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Profile" className="w-38 h-38 rounded-full object-cover mb-4" />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                            <span className="text-gray-600">No Image</span>
                        </div>
                    )}
                    {editing && (
                        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
                    )}
                </div>

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