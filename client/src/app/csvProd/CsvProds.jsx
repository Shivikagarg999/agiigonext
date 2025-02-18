"use client";

import { useState } from "react";

const api_url = process.env.NEXT_PUBLIC_API_URL;

export default function CsvUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!file) {
      setMessage("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('https://api.agiigo.com/api/products/csv', {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("CSV uploaded successfully!");
      } else {
        setMessage(data.error || "Failed to upload CSV.");
      }
    } catch (error) {
      setMessage("Error uploading CSV.");
    }
  };

  return (
    <>
      <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg border-2 border-orange-400 mb-8 mt-8">
        <h2 className="text-3xl font-semibold text-center text-orange-600 mb-6">Upload Products CSV</h2>

        {message && (
          <p
            className={`text-center ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-2 w-full p-3 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-orange-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300"
            >
              Upload CSV
            </button>
          </div>
        </form>
      </div>
    </>
  );
}