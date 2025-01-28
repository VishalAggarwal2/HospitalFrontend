"use client"
import React, { useState, useEffect } from "react";
import { Particles } from "../../../components/ui/particles";

const SOSListPage = () => {
  const [sosList, setSosList] = useState([]);
  const [error, setError] = useState("");
  const [color, setColor] = useState("#ffffff");

  const fetchSOSList = async (userId) => {
    try {   
         console.log("called inside function");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/sos/all/${encodeURIComponent(userId)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred.");
      }

      const data = await response.json();
      setSosList(data.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("called");
    if (storedUserId) {
      fetchSOSList(storedUserId);
    }
  }, []); // Empty array ensures this effect runs only once when the component mounts




  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-gray-900">
        <h1 className="text-2xl font-bold text-blue-500 mb-4">SOS List</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {sosList.length > 0 ? (
          <ul className="space-y-2">
            {sosList.map((sos, index) => (
              <li
                key={index}
                className="p-3 rounded-lg bg-gray-800 text-white shadow-md"
              >
                {sos.email}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-blue-400">No SOS entries found.</p>
        )}
      </div>
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
};

export default SOSListPage;
