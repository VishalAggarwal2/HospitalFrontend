'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function SessionDetails() {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state
  const [generatingReport, setGeneratingReport] = useState(false); // State for report generation
  const [reportError, setReportError] = useState(null); // State for report error
  const [reportResponse, setReportResponse] = useState(null); // State for storing report response

  const { counslingSessionId } = useParams(); // Get session ID from URL
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/counslingsession/details/${counslingSessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session details');
        }
        const data = await response.json();
        setSessionData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [counslingSessionId]);

  // Handle report generation
  const generateReport = async () => {
    setGeneratingReport(true); 
    setReportError(null); 
    setReportResponse(null); 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/counslingsession/generateReport/${counslingSessionId}`);
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      const result = await response.json();

      if (result.status === 'success') {
        setReportResponse(result); // Set report response data on success
      } else {
        throw new Error(result.message || 'Failed to generate report');
      }
    } catch (err) {
      setReportError(err.message); // Capture and display any errors
    } finally {
      setGeneratingReport(false); // Reset loading state after operation
    }
  };

  // Show loading text or the report button based on loading state
  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-white">
        <p className="bg-red-500 p-4 rounded-md text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!sessionData) {
    return <div className="text-center text-white">No data found</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-blue-500">Session Details</h1>
        <div className="space-y-6">
          <div>
            <span className="font-bold text-blue-400">Doctor Name:</span> {sessionData.data.doctorName}
          </div>
          <div>
            <span className="font-bold text-blue-400">Session Name:</span> {sessionData.data.sessionName}
          </div>
          <div>
            <span className="font-bold text-blue-400">Summary:</span>
            <p className="whitespace-pre-line">{sessionData.data.summary}</p>
          </div>
          <div>
            <span className="font-bold text-blue-400">Precautions:</span>
            <p className="whitespace-pre-line">{sessionData.data.precautions}</p>
          </div>

          <h2 className="text-xl font-semibold mt-6 text-blue-500">Questions</h2>
          <ul className="space-y-4">
            {sessionData.data.questionList.map((question) => (
              <li key={question.id} className="p-4 bg-gray-700 rounded-md">
                <p className="font-bold text-blue-300">{question.questionTitle}</p>
                <p>{question.answer}</p>
              </li>
            ))}
          </ul>

          {/* General Report Button */}
          <div className="mt-8 text-center">
            <button
              onClick={generateReport}
              disabled={generatingReport} // Disable the button while generating report
              className={`p-4 rounded-lg text-white ${generatingReport ? 'bg-gray-500' : 'bg-blue-500'} transition duration-200 hover:bg-blue-600`}
            >
              {generatingReport ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  </svg>
                  Generating Report...
                </div>
              ) : (
                'Generate General Report'
              )}
            </button>

            {reportError && (
              <p className="text-red-500 mt-4">{reportError}</p>
            )}

            {/* Displaying the report response */}
            {reportResponse && (
              <div className="mt-6 p-4 bg-green-500 text-white rounded-lg">
                <h2 className="text-xl font-semibold">Report Status: {reportResponse.status}</h2>
                <p className="mt-2">{reportResponse.message}</p>
                <p className="mt-2">{reportResponse.data}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
