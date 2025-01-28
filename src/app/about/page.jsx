"use client"
import { GlobeDemo } from '@/components/Globe/GlobeDemo';
import { useUser } from '@clerk/clerk-react';
import { useEffect ,useState} from 'react';
import AlertSOSComponent from '@/components/AlertButton/AlertButton';
import { TextAnimate } from "../../components/ui/text-animate";
import { Particles } from "../../components/ui/particles";
 
export default function AboutPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [color, setColor] = useState("#ffffff");
 
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      console.log(user.id);      
      console.log(user.fullName);
      console.log(user.primaryEmailAddress.emailAddress);

      const obj = {
        username: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
        password: "devuser"
      };

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

      fetch(`${process.env.NEXT_PUBLIC_API}/auth/${user.primaryEmailAddress.emailAddress}`)
        .then((response) => response.json())
        .then((result) => {
          localStorage.setItem('userId', result.data); 
        })
        .catch((error) => {
          console.error('Error fetching user ID:', error);
        });
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <div className="bg-gray-900 text-white font-sans">
<div className="flex justify-center items-center h-[500px] bg-gradient-to-r from-gray-900 text-4xl font-extrabold text-teal-300 text-center tracking-wide leading-tight via-black to-gray-900 rounded-lg shadow-lg p-8">
<TextAnimate 
    animation="blurInUp" 
    by="word" 
    className="text-3xl font-extrabold  text-teal-300 text-center tracking-wide leading-tight"
  >
    AI-Powered Healthcare Chatbot
    </TextAnimate>

  <GlobeDemo />
  <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
</div>



      <section className="px-4 py-12 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-yellow-400 mb-6">Our Vision</h2>
        
          <TextAnimate 
    animation="blurInUp" 
    by="word" 
    className="text-3xl font-extrabold  text-white text-center tracking-wide leading-tight"
  >
            At the forefront of healthcare innovation, our vision is to empower patients and medical professionals alike...
            </TextAnimate>
         
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
              description: "Our intelligent chatbot learns from real doctor-patient interactions..."
            },
            {
              emoji: "🏥",
              title: "Domain-Specific Categorization",
              description: "Navigate your health concerns effortlessly..."
            },
            {
              emoji: "💬",
              title: "Interactive Patient Interface",
              description: "Engage directly with our user-friendly chatbot for real-time responses..."
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
        <p className="text-lg mb-6">Become a pioneer in the future of healthcare! Partner with us as we leverage AI technology...</p>
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
