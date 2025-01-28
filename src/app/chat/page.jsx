"use client";
import { useState } from "react";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("English"); // State for language selection

  const sendMessage = async () => {
    if (userInput.trim() !== "") {
      // Add user's message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userInput },
      ]);

      setIsLoading(true); // Show loader
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/chat/${encodeURIComponent(userInput)}?language=${language}`, // Pass language in query params
          {
            method: "GET",
          }
        );

        const data = await response.json();

        // Add chatbot's response to chat
        if (data.status === "Success") {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", text: data.data }, // Display the 'data' field
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", text: "Unexpected response from the server." },
          ]);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Something went wrong. Please try again." },
        ]);
      }

      setIsLoading(false); // Hide loader
      setUserInput(""); // Clear input field
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black py-10">
      <h1 className="text-3xl font-bold text-white mb-6">Medical ChatBot</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Language Selection Dropdown */}
        <div className="flex justify-end mb-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 bg-gray-700 text-white rounded-lg"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>

        <div className="overflow-y-auto max-h-96 mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.sender === "bot"
                  ? "bg-blue-600 text-white text-left"
                  : "bg-gray-700 text-white text-right"
              }`}
            >
              {message.text}
            </div>
          ))}
          {isLoading && (
            <div className="p-3 rounded-lg bg-blue-600 text-white text-left">
              Typing...
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-500 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask me anything..."
          />
          <button
            onClick={sendMessage}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
