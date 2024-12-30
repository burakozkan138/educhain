import { useWallet } from './context';

export default function KeplrConnect() {
  const { address, connect, disconnect, isConnected } = useWallet();

  return (
    <button
      onClick={isConnected ? disconnect : connect}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
    </button>
  );
}