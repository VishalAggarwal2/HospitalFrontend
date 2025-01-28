'use client'; // Required for client-side fetching in Next.js App Router
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
export default function Page() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/domain/all`);
        const result = await response.json();

        if (result.status === 'Success') {
          setDomains(result.data);
        } else {
          setError(result.message || 'Failed to fetch domains');
        }
      } catch (err) {
        setError('An error occurred while fetching domains.');
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-500">
          Domain List
        </h1>

        {loading && (
          <div className="text-center">
            <p className="text-gray-400">Loading domains...</p>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && domains.length === 0 && (
          <div className="text-center">
            <p className="text-gray-400">No domains available.</p>
          </div>
        )}

        {!loading && !error && domains.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="bg-gray-800 shadow-lg rounded-lg p-6 hover:bg-gray-700 transition duration-300"
              >
                <h2 className="text-2xl font-semibold text-white">
                  {domain.domainName}
                </h2>
<Link href={`domain/${domain.id}`}>
Show FAQ

</Link>                

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
