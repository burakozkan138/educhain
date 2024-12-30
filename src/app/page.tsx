'use client';

import { useWallet } from '@/components/wallet/context';
import Link from 'next/link';
import WalletConnect from '@/components/wallet/connect';

export default function Home() {
  const { isConnected } = useWallet();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16 bg-gray-800/30 p-4 rounded-lg backdrop-blur-sm">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            EduCert
          </h1>
          <WalletConnect />
        </nav>

        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-8 leading-tight">
            NFT-Based Certificates for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              Education
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Secure, verifiable, and unique certificates powered by blockchain technology
          </p>

          {isConnected && (
            <div className="flex justify-center gap-8">
              <Link
                href="/institution"
                className="group px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                Institution Dashboard
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/student"
                className="group px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
              >
                Student Dashboard
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}