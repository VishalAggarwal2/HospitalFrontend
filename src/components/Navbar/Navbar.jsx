import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import React from 'react';
import Link from 'next/link';
import AlertSOSComponent from '../AlertButton/AlertButton';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      <div className="text-lg font-bold">
        <Link href="/about" className="hover:text-teal-400 transition duration-300">
          CuraBot
        </Link>
      </div>
      <div className="flex items-center space-x-6">
        <SignedOut>
          <SignInButton>
            <span className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.404 1.404A2.002 2.002 0 0116 21H6a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v5"
                />
              </svg>
              <span>Sign In</span>
            </span>
          </SignInButton>
        </SignedOut>
        <SignedIn>
        <Link href="/domain" className="hover:text-teal-400 transition duration-300">FAQ</Link>
          <Link href="/chat" className="hover:text-teal-400 transition duration-300">Chat</Link>
          <Link href="/Counslingsession" className="hover:text-teal-400 transition duration-300">Analyzer</Link>
          <Link href="/Counslingsession/mySession" className="hover:text-teal-400 transition duration-300">My Sessions</Link>
          <Link href="/sos" className="hover:text-teal-400 transition duration-300">SOS</Link>
          <Link href="/sos/getSosList" className="hover:text-teal-400 transition duration-300">SOS List</Link>
          <Link href="/Flow" className="hover:text-teal-400 transition duration-300">How To Use</Link>
          <Link href="/Developer" className="hover:text-teal-400 transition duration-300">Developer</Link>
          <div>
            <AlertSOSComponent />
          </div>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
