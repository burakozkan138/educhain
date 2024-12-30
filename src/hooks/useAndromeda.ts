import { useWallet } from '@/components/wallet/context';
import { CONTRACT_INFO } from '@/config/config';
import { StdFee } from '@keplr-wallet/types';
import { useState } from 'react';

interface CertificateMetadata {
  title: string;
  description: string;
  image?: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

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

interface CrowdfundMessage {
  start_sale: {
    start_time: number;
    end_time: number;
    price: string;
    min_tokens_sold: string;
    max_amount_per_wallet: string;
    recipient: string;
  };
}

interface CampaignData {
  start_time: number;  // Kampanyanın başlangıç zamanı (Unix timestamp)
  end_time: number;    // Kampanyanın bitiş zamanı (Unix timestamp)
  price: string;       // Fiyat (String olarak)
  min_tokens_sold: string;  // Minimum satılacak token
  max_amount_per_wallet: string; // Cüzdan başına maksimum token
  recipient: string;   // Alıcı adresi (recipient)
}

interface AndromedaHookReturn {
  // Certificate functions
  mintCertificate: (metadata: CertificateMetadata) => Promise<any>;
  queryCertificates: (ownerAddress: string) => Promise<CertificateData[]>;
  queryCertificateById: (tokenId: string) => Promise<CertificateData | null>;

  // Campaign functions
  createCampaign: (campaignData: CampaignData) => Promise<any>;
  queryCampaigns: () => Promise<any[]>;

  // States
  isLoading: boolean;
  error: string | null;
}

export const useAndromeda = (): AndromedaHookReturn => {
  const { client, address } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultFee: StdFee = {
    amount: [{
      denom: "uandr",
      amount: "5000"
    }],
    gas: "200000"
  };

  const handleContractError = (err: any) => {
    console.error('Contract Error:', err);
    setError(err instanceof Error ? err.message : 'Unknown error occurred');
    return null;
  };

  const mintCertificate = async (metadata: CertificateMetadata) => {
    if (!client || !address) {
      setError('Wallet not connected');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const msg = {
        mint: {
          owner: address,
          token_uri: null,
          extension: metadata
        }
      };

      return await client.execute(
        address,
        CONTRACT_INFO.TOKENS.address,
        msg,
        defaultFee
      );
    } catch (err) {
      return handleContractError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const queryCertificates = async (ownerAddress: string): Promise<CertificateData[]> => {
    if (!client) {
      setError('Client not initialized');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await client.queryContractSmart(
        CONTRACT_INFO.TOKENS.address,
        {
          tokens: { owner: ownerAddress }
        }
      );

      // Fetch details for each token
      const certificates = await Promise.all(
        response.tokens.map((tokenId: string) =>
          queryCertificateById(tokenId)
        )
      );

      return certificates.filter((cert): cert is CertificateData => cert !== null);
    } catch (err) {
      handleContractError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const queryCertificateById = async (tokenId: string): Promise<CertificateData | null> => {
    if (!client) {
      setError('Client not initialized');
      return null;
    }

    try {
      return await client.queryContractSmart(
        CONTRACT_INFO.TOKENS.address,
        {
          nft_info: { token_id: tokenId }
        }
      );
    } catch (err) {
      return handleContractError(err);
    }
  };

  const createCampaign = async (campaignData: CampaignData): Promise<any> => {
    if (!client || !address) {
      setError('Wallet not connected');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const msg = {
        start_sale: {
          start_time: campaignData.start_time,  // Kampanyanın başlangıç zamanı (Unix timestamp)
          end_time: campaignData.end_time,      // Kampanyanın bitiş zamanı (Unix timestamp)
          price: campaignData.price,            // Fiyat (String olarak)
          min_tokens_sold: campaignData.min_tokens_sold, // Minimum satılacak token
          max_amount_per_wallet: campaignData.max_amount_per_wallet, // Cüzdan başına maksimum token
          recipient: campaignData.recipient     // Alıcı adresi
        }
      };

      return await client.execute(
        address,
        CONTRACT_INFO.CROWDFUND.address,
        msg,
        defaultFee,
        "Start Sale",
        []
      );
    } catch (err) {
      handleContractError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const queryCampaigns = async (): Promise<any[]> => {
    if (!client) {
      setError('Client not initialized');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await client.queryContractSmart(
        CONTRACT_INFO.CROWDFUND.address,
        {
          state: {} // Query current state of crowdfund
        }
      );
      return response.sales || [];
    } catch (err) {
      handleContractError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mintCertificate,
    queryCertificates,
    queryCertificateById,
    createCampaign,
    queryCampaigns,
    isLoading,
    error
  };
};
