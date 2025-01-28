"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from '@clerk/clerk-react';
import { Particles } from "../../../components/ui/particles";

export default function MySessionPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState("#ffffff");

  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      console.log(user.id);      
      console.log(user.fullName);
      console.log(user.primaryEmailAddress.emailAddress);

      // Prepare data to send in POST request
      const obj = {
        username: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
        password: "devuser"
      };

      // Send POST request
      fetch(`${process.env.NEXT_PUBLIC_API}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data); 
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      // Fetch userId after signup and store it in localStorage
      fetch(`${process.env.NEXT_PUBLIC_API}/auth/${user.primaryEmailAddress.emailAddress}`)
        .then((response) => response.json())
        .then((result) => {
          localStorage.setItem('userId', result.data); // Corrected localStorage usage
        })
        .catch((error) => {
          console.error('Error fetching user ID:', error);
        });
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/counslingsession/mysession/${userId}`
        );

        const data = await response.json();

        if (data.status === "sucess" && Array.isArray(data.data)) {
          setSessions(data.data);
        } else {
          setError("Unexpected response from the server.");
        }
      } catch (err) {
        setError("Failed to fetch sessions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-blue-500 mb-8">My Sessions</h1>
      {loading ? (
        <p className="text-blue-300 text-xl">Loading sessions...</p>
      ) : error ? (
        <p className="text-red-500 text-xl">{error}</p>
      ) : sessions.length === 0 ? (
        <p className="text-yellow-500 text-xl">No sessions added yet.</p>
      ) : (
        <div className="grid gap-6 w-full max-w-3xl">
          {sessions.map((session, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold text-blue-400 mb-2">
                Doctor: {session.doctorName}
              </h2>
              <p className="text-blue-200 mb-4">Session: {session.sessionName}</p>
              <div className="flex justify-between items-center">
                <Link
                  href={`/Counslingsession/displayCounslingSession/${session.id}`}
                  className="text-blue-500 hover:text-blue-300 font-semibold transition duration-200"
                >
                  More Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
          <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
}
