"use client"
import React, { useState, useEffect } from "react";
import { Particles } from "../../components/ui/particles";

const AddSOSPage = () => {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("");
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/sos/add?userid=${encodeURIComponent(userId)}&email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred.");
      }

      const data = await response.json();
      setResponseMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-gray-900">
        <h1 className="text-2xl font-bold text-blue-500 mb-4">Add SOS Person</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-blue-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Submit
          </button>
        </form>
        {responseMessage && (
          <p className="mt-4 text-green-400">{responseMessage}</p>
        )}
        {error && (
          <p className="mt-4 text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
};

export default AddSOSPage;
