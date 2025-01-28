"use client";
import React, { useState, useEffect } from "react";
const AlertSOSComponent = () => {
  const [isRinging, setIsRinging] = useState(false);

  const speakAlert = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = speechSynthesis.getVoices()[0]; // Pick a voice
    utterance.pitch = 1; // Tone of voice

    speechSynthesis.speak(utterance);
  };

  const sendSOS = async () => {
    const userId = localStorage.getItem("userId"); // Get userId from localStorage
    if (userId) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/sos/send/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log("SOS Sent successfully:", data);
        } else {
          const errorData = await response.text(); // Fetch the response as text to log the raw message
          console.log("Failed to send SOS. Response:", errorData);
        }
      } catch (error) {
        console.log("Error sending SOS:", error);
      }
    } else {
      console.log("User ID not found in localStorage");
    }
  };
  

  // Effect to repeat the alert when SOS is ringing
  useEffect(() => {
    if (typeof window !== "undefined" && isRinging) {
      // Repeat the alert message every 1 second
      const intervalId = setInterval(() => {
        speakAlert("Please help me immediately!");
      }, 1000);

      // Send SOS when the alert starts
      sendSOS();

      // Clean up the interval when alert is stopped
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isRinging]);

  return (
    <div className="flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-gray-900">
        {isRinging ? (
          <div>
            <p className="text-red-400 mb-4">SOS Alert is ringing!</p>
            <button
              onClick={() => {
                setIsRinging(false);
                speechSynthesis.cancel(); // Stop speech synthesis
              }}
              className="bg-red-600 text-white p-2 rounded-lg"
            >
              Stop Alert
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                setIsRinging(true); // Start the SOS alert
                speakAlert("Please help me immediately!"); // Trigger speech immediately
              }}
              className="bg-blue-600 text-white p-2 rounded-lg"
            >
              Start SOS Alert
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertSOSComponent;
