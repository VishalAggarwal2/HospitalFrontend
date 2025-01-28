"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/clerk-react';

export default function Page() {
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

  const [doctorName, setDoctorName] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [userId, setUserId] = useState('');
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false); // For loader in create session
  const [isAnalyzing, setIsAnalyzing] = useState(false); // For loader in analyze file
  const [language, setLanguage] = useState('English'); // State for language selection

  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleCreateSession = async () => {
    setIsCreating(true);
    const requestData = { doctorName, sessionName, userId };
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/counslingsession/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await res.json();

      if (result.status === 'Failure') {
        if (result.message === 'Session With This Name Already Exists') {
          setError('A session with this name already exists. Please choose a different session name.');
        } else {
          setError(result.message || 'An unexpected error occurred.');
        }
        return;
      }

      setResponse(result);
    } catch (error) {
      setError(error.message || 'An unexpected error occurred.');
      console.error('Error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleAnalyzeFile = async () => {
    if (!file) {
      setError('Please select a file to analyze.');
      return;
    }
    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/counslingsession/analyze/text?sessionId=${response?.data?.id}&language=${language}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to analyze file. Please try again.');
      }

      const result = await res.json();
      setResponse(result);

      // Check if window is defined to ensure client-side routing
      if (typeof window !== 'undefined' && router) {
        // Proceed with routing only if on client side
        router.push(`/Counslingsession/displayCounslingSession/${result?.data?.id}`);
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred during file analysis.');
      console.error('Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderAnalysisDetails = (data) => {
    return (
      <div className="p-4 bg-gray-800 rounded-lg shadow-md mt-6">
        <h3 className="text-xl text-blue-500 font-semibold mb-4">Analysis Result:</h3>
        <div className="text-sm text-gray-400">
          {data.summary && (
            <div className="mb-4">
              <strong>Summary:</strong>
              <p>{data.summary}</p>
            </div>
          )}

          {data.details && (
            <div>
              <strong>Details:</strong>
              <ul className="list-disc ml-6">
                {data.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {data.recommendations && (
            <div className="mt-4">
              <strong>Recommendations:</strong>
              <ul className="list-disc ml-6">
                {data.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl text-center text-blue-500 mb-8">Counseling Session</h1>

      {/* Error message display */}
      {error && (
        <div className="mb-4 p-4 bg-red-600 text-white rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Doctor Name:</label>
        <input
          type="text"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          placeholder="Enter Doctor Name"
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
        />
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Session Name:</label>
        <input
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          placeholder="Enter Session Name"
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
        />
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
        </select>
      </div>

      <button
        onClick={handleCreateSession}
        className="w-full p-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
        disabled={isCreating}
      >
        {isCreating ? (
          <span>Creating...</span>
        ) : (
          <span>Create Session</span>
        )}
      </button>

      {response && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-xl text-blue-500 font-semibold mb-4">Session Created Successfully</h3>
          <div className="text-sm text-gray-400">
            <p><strong>Doctor Name:</strong> {response?.data?.doctorName}</p>
            <p><strong>Session Name:</strong> {response?.data?.sessionName}</p>
            <p><strong>Session ID:</strong> {response?.data?.id}</p>
          </div>
        </div>
      )}

      {response?.data && (
        <div className="mt-8">
          <h3 className="text-xl text-blue-500 font-semibold mb-4">Upload File for Analysis</h3>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
          <button
            onClick={handleAnalyzeFile}
            className="w-full mt-4 p-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <span>Analyzing...</span>
            ) : (
              <span>Analyze File</span>
            )}
          </button>
        </div>
      )}

      {response?.analyzedData && renderAnalysisDetails(response.analyzedData)}
    </div>
  );
}
