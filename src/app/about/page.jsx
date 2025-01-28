"use client";
import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import AlertSOSComponent from '@/components/AlertButton/AlertButton';
export default function AboutPage() {
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
  }, [isLoaded, isSignedIn, user]); // Watch for changes in user and isLoaded

  return (
    <div className="bg-black text-white font-sans">
      <header className="bg-cover bg-center h-[500px] flex flex-col justify-center items-center text-center p-8 transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: "url('https://via.placeholder.com/1920x600/000000/FFFFFF?text=AI+Healthcare+Innovation')" }}>
        <h1 className="text-5xl md:text-6xl font-extrabold text-teal-300 text-shadow-lg drop-shadow-lg animate__animated animate__fadeIn">AI-Powered Healthcare Chatbot</h1>
        <p className="text-xl mt-4 text-white md:text-2xl animate__animated animate__fadeIn animate__delay-1s">
          Transforming Healthcare with Intelligent Conversations
          Experience a new era in healthcare where advanced AI technology enhances communication between patients and doctors, making healthcare more accessible and efficient.
        </p>
      </header>
      <section className="px-4 py-12 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-yellow-400 mb-6">Our Vision</h2>
          <p className="text-lg text-gray-200 leading-relaxed animate__animated animate__fadeIn animate__delay-2s">
            At the forefront of healthcare innovation, our vision is to empower patients and medical professionals alike. By harnessing the power of AI-driven technology, we aim to provide instant, accurate responses to common health inquiries. This allows healthcare providers to dedicate more time to complex cases while ensuring that patients receive timely information. Our chatbot not only enhances accessibility but also fosters a more satisfying healthcare experience for everyone involved.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-900 py-16">
        <div className="text-center mb-12 animate__animated animate__fadeIn">
          <h2 className="text-3xl font-semibold text-yellow-400">Key Features</h2>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {[
            {
              emoji: "🤖",
              title: "AI-Powered FAQ Generation",
              description: "Our intelligent chatbot learns from real doctor-patient interactions to create a comprehensive FAQ database. By addressing common concerns proactively, it reduces repetitive queries and empowers patients with the information they need."
            },
            {
              emoji: "🏥",
              title: "Domain-Specific Categorization",
              description: "Navigate your health concerns effortlessly! Our FAQs are meticulously categorized across various medical specialties—such as oncology, cardiology, and orthopedics—ensuring that you receive precise answers tailored to your specific needs."
            },
            {
              emoji: "💬",
              title: "Interactive Patient Interface",
              description: "Engage directly with our user-friendly chatbot for real-time responses. This interactive platform enhances your understanding of health topics while providing you with immediate access to vital information about your well-being."
            }
          ].map((feature) => (
            <div key={feature.title} className="bg-gray-800 p-8 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
              <div className="text-5xl text-teal-400 mb-4">{feature.emoji}</div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-gray-300 mt-3">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-900 py-12 text-center">
        <h2 className="text-3xl font-semibold mb-4 text-yellow-400">Join Us in Revolutionizing Healthcare</h2>
        <p className="text-lg mb-6">Become a pioneer in the future of healthcare! Partner with us as we leverage AI technology to enhance accessibility and improve patient outcomes. Together, we can create a healthier tomorrow for everyone.</p>
        <a href="#contact" className="bg-teal-500 text-white py-3 px-8 rounded-full text-xl hover:bg-teal-600 transition-all transform hover:scale-110 duration-300 ease-in-out">
          Contact Us
        </a>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-center py-4 text-gray-400">
        <p>© 2025 AI Healthcare Chatbot | All Rights Reserved | Your privacy matters—read our <a href="#privacy" className="text-teal-400">Privacy Policy</a></p>
      </footer>
    </div>
  );
}
