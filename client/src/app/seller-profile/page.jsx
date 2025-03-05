"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, User, Edit, Save, X } from "lucide-react";
import Nav from "../nav/SellerNav";
import Footer from "../footer/Footer";

export default function SellerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetch("https://api.agiigo.com/api/profile/seller", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setFormData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching seller profile:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    fetch("https://api.agiigo.com/api/profile/seller", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setIsEditing(false);
      })
      .catch((err) => console.error("Error updating profile:", err));
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!profile)
    return <p className="text-center mt-10 text-red-500">Profile not found!</p>;

  return (
    <>
     <Nav/>
     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10 border border-gray-300">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-600 text-lg">{profile.email}</p>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
              >
                <Edit className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition"
                >
                  <Save className="w-5 h-5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-gray-800">
          {[
            { label: "Name", value: profile.name, icon: <User className="text-blue-500" /> },
            { label: "Contact", value: profile.contact, icon: <Phone className="text-yellow-500" /> },
            { label: "Address", value: profile.address, icon: <MapPin className="text-red-500" /> },
            { label: "City", value: profile.city },
            { label: "State", value: profile.state },
            { label: "Country", value: profile.country },
            { label: "Pincode", value: profile.pincode },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-center space-x-4">
              {icon && <div className="w-6">{icon}</div>}
              <span className="font-semibold w-32">{label}:</span>
              {isEditing ? (
                <input
                  type="text"
                  name={label.toLowerCase()}
                  value={formData[label.toLowerCase()] || ""}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <span className="text-gray-700 text-lg">{value || "N/A"}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}