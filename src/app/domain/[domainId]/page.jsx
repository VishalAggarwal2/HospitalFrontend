'use client'; // Required for client-side fetching in Next.js App Router
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LoadingSpinner from '@/components/spinner/LoadingSpinner';
import { Particles } from "../../../components/ui/particles";

function Page() {
  const [questions, setQuestions] = useState([]);  // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState("#ffffff");

  const { domainId } = useParams(); // Access the dynamic route parameter

  useEffect(() => {
    if (!domainId) return;

    const fetchQuestions = async () => {
      setLoading(true); // Start loading before the API call
      setError(null); // Clear any existing errors

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/domain/${domainId}`);
        
        // Check if response is ok (status code in range 200-299)
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server.');
        }

        const result = await response.json();

        if (result.status === 'success') {
          setQuestions(result.data || []); // Ensure we always get an array
        } else {
          throw new Error(result.message || 'Failed to fetch questions');
        }
      } catch (err) {
        // Capture and display the error message
        setError(err.message || 'An unexpected error occurred while fetching questions.');
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false); // Stop loading when the request is finished
      }
    };

    fetchQuestions();
  }, [domainId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-8 text-blue-400">
          Frequently Asked Questions
        </h1>
        <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
        {loading && (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
            <p className="text-gray-400 mt-4 ml-4">Loading questions...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-red-500 font-semibold bg-red-200 p-2 rounded-lg">{error}</p>
          </div>
        )}

        {/* Safe Check for No Questions */}
        {!loading && !error && questions.length === 0 && (
          <div className="text-center py-4">
            <p className="text-yellow-500 text-lg font-medium">No questions available in this domain.</p>
          </div>
        )}

        {/* Safe Check for Questions */}
        {!loading && !error && questions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((question) => (
              <div
                key={question.id}
                className="bg-gradient-to-br from-indigo-800 via-indigo-700 to-indigo-600 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <h2 className="text-2xl font-semibold text-white">{question.questionTitle}</h2>
                <p className="text-gray-300 mt-4 text-lg">{question.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
