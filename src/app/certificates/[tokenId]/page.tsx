'use client';

import { useWallet } from '@/components/wallet/context';
import { useAndromeda } from '@/hooks/useAndromeda';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CertificateData {
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

export default function CertificateDetails() {
  const params = useParams();
  const router = useRouter();
  const { isConnected } = useWallet();
  const { queryCertificateById, isLoading, error } = useAndromeda();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    const fetchCertificate = async () => {
      if (params.tokenId) {
        const result = await queryCertificateById(params.tokenId as string);
        setCertificate(result);
      }
    };

    fetchCertificate();
  }, [params.tokenId, isConnected]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error || 'Certificate not found'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Certificate Preview */}
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {certificate.extension.title}
              </h1>
              <p className="text-gray-600">{certificate.extension.description}</p>
            </div>

            {certificate.extension.image && (
              <div className="mt-6">
                <img
                  src={certificate.extension.image}
                  alt="Certificate"
                  className="w-full rounded-lg"
                />
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4">
              {certificate.extension.attributes.map((attr, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">{attr.trait_type}</p>
                  <p className="text-gray-900 font-medium">{attr.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Go Back
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Download Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}