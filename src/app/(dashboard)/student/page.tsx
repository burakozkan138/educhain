'use client';

import { useWallet } from '@/components/wallet/context';
import { useAndromeda } from '@/hooks/useAndromeda';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CertificateType {
  token_id: string;
  extension: {
    title: string;
    description: string;
    image?: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}

export default function StudentDashboard() {
  const { address, isConnected } = useWallet();
  const { queryCertificates, isLoading, error } = useAndromeda();
  const router = useRouter();
  const [certificates, setCertificates] = useState<CertificateType[]>([]);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (address) {
        const result = await queryCertificates(address);
        setCertificates(result);
      }
    };

    fetchCertificates();
  }, [address]);

  const handleCertificateClick = (tokenId: string) => {
    router.push(`/certificates/${tokenId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">My Certificates</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Connected as:</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading certificates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.token_id}
                onClick={() => handleCertificateClick(cert.token_id)}
                className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
              >
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400">
                  {cert.extension.title}
                </h3>
                <p className="text-gray-400 line-clamp-2">{cert.extension.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm">
                    View Details
                  </span>
                  <svg
                    className="w-5 h-5 text-blue-400 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
            {certificates.length === 0 && !error && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-400">No certificates found</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}