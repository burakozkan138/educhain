"use client";
import { useState } from "react";
import { Button } from "../common/button";
import { useWallet } from "./context";


export default function WalletConnect() {
  const { address, connect, disconnect, isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connect();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {isConnected ? (
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-gray-800/30 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
          <Button
            variant="secondary"
            onClick={disconnect}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          isLoading={isLoading}
        >
          <img
            src="/keplr-logo.png"
            alt=""
            className="w-5 h-5"
          />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}