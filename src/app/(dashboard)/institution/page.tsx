'use client';

import { useWallet } from '@/components/wallet/context';
import { useAndromeda } from '@/hooks/useAndromeda';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CreateCampaignModal } from '@/components/institution/createCampaignModal';
import { IssueCertificateModal } from '@/components/institution/issueCertificateModal';

export default function InstitutionDashboard() {
  const { address, isConnected } = useWallet();
  const { queryCampaigns, isLoading } = useAndromeda();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    const fetchCampaigns = async () => {
      const result = await queryCampaigns();
      setCampaigns(result);
    };

    fetchCampaigns();
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Institution Dashboard</h1>
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
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setShowCampaignModal(true)}
            className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group text-left"
          >
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400">Create Campaign</h3>
            <p className="text-gray-400 mt-2">Launch a new fundraising campaign</p>
          </button>

          <button
            onClick={() => setShowCertificateModal(true)}
            className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group text-left"
          >
            <h3 className="text-xl font-bold text-white group-hover:text-purple-400">Issue Certificate</h3>
            <p className="text-gray-400 mt-2">Create and issue new certificates</p>
          </button>
        </div>

        {/* Campaign List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Active Campaigns</h2>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign: any) => (
                <div key={campaign.id} className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white">{campaign.title}</h3>
                  <p className="text-gray-400 mt-2">{campaign.description}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Goal: {campaign.goal} AND</span>
                      <span>Ends: {new Date(campaign.end_time * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        userWalletAddress={address || ''}  // Pass the wallet address here
      />

      <IssueCertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
      />
    </div>
  );
}
