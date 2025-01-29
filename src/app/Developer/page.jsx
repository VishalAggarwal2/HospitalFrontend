"use client"
import React,{useState} from "react";
import { Particles } from "../../components/ui/particles";

const DeveloperPage = () => {
    const [color, setColor] = useState("#ffffff");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6">
      <div className="bg-gray-900 shadow-lg rounded-2xl p-8 max-w-sm text-center border border-blue-500">
        <img
          src="http://res.cloudinary.com/dku5orixv/image/upload/v1738167144/ynw8bbapzbytvn4j9ucd.jpg"
          alt="Tanisha Jain"
          className="w-40 h-40 object-cover rounded-full mx-auto mb-4 border-4 border-blue-500"
        />
        <h2 className="text-2xl font-semibold text-white">Tanisha Jain</h2>
        <p className="text-blue-400">Software Developer</p>

        <div className="mt-4">
          <a
            href="https://www.linkedin.com/in/tanisha-jain-06168b256/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300 transition duration-300"
          >
            LinkedIn Profile
          </a>
          <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />

          <a
            href="mailto:tanishajain956@gmail.com"
            className="block text-white mt-2 hover:text-gray-400 transition duration-300"
          >
            tanishajain956@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPage;
