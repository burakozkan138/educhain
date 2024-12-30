"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { ANDROMEDA_TESTNET } from '@/config/config';

declare global {
  interface Window extends KeplrWindow { }
}

interface WalletContextType {
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  client: SigningCosmWasmClient | null;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

export const WalletProvider = ({ children }: { children: React.ReactNode; }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [client, setClient] = useState<SigningCosmWasmClient | null>(null);

  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress && window.keplr) {
      reconnectWallet();
    }
  }, []);

  const reconnectWallet = async () => {
    try {
      await window.keplr?.enable(ANDROMEDA_TESTNET.chainId);
      const offlineSigner = window.keplr?.getOfflineSigner(ANDROMEDA_TESTNET.chainId);
      const accounts = await offlineSigner?.getAccounts();

      if (accounts && accounts[0]) {
        setAddress(accounts[0].address);
        localStorage.setItem('walletAddress', accounts[0].address);

        if (offlineSigner) {
          const cosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
            ANDROMEDA_TESTNET.rpc,
            offlineSigner
          );
          setClient(cosmWasmClient);
        } else {
          throw new Error("Offline signer is undefined");
        }
      }
    } catch (error) {
      console.error("Error reconnecting wallet:", error);
      localStorage.removeItem('walletAddress');
    }
  };

  const connect = async () => {
    if (!window.keplr) {
      alert("Please install Keplr extension");
      return;
    }

    try {
      await window.keplr.enable(ANDROMEDA_TESTNET.chainId);
      const offlineSigner = window.keplr.getOfflineSigner(ANDROMEDA_TESTNET.chainId);
      const accounts = await offlineSigner.getAccounts();

      setAddress(accounts[0].address);
      localStorage.setItem('walletAddress', accounts[0].address);

      const cosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
        ANDROMEDA_TESTNET.rpc,
        offlineSigner
      );
      setClient(cosmWasmClient);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setClient(null);
    localStorage.removeItem('walletAddress');
  };

  return (
    <WalletContext.Provider value={{
      address,
      connect,
      disconnect,
      isConnected: !!address,
      client
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);