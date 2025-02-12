import React, { useState, useRef, useEffect } from 'react';
import { walletService, Network } from '../services/WalletService';
import { Loader2, Globe, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface WalletConnectorProps {
  onWalletConnected: (address: string) => void;
}

const WalletConnector: React.FC<WalletConnectorProps> = ({ onWalletConnected }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('Mainnet');
  const [wallets, setWallets] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refreshWallets = () => {
      setWallets(walletService.getAvailableCardanoWallets());
    };
    refreshWallets();
  }, [selectedNetwork]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const connectWallet = async () => {
    try {
      console.log("Attempting to connect to wallet...");
      setIsConnecting(true);
      setError(null);

      walletService.setNetwork(selectedNetwork);
      
      const walletName = selectedWallet || (wallets.length === 1 ? wallets[0] : await walletService.showWalletSelectionModal(wallets));
      if (!walletName) throw new Error("No wallet selected");

      setSelectedWallet(walletName);
      
      const walletInfo = await walletService.connect((wallet) => {
        setWalletAddress(wallet.address);
        setSelectedWallet(wallet.name);
        onWalletConnected(wallet.address);
      });

      console.log("Wallet connection successful:", walletInfo);

      toast.success(`Connected to ${walletName}`);
    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      setError(error.message);
      toast.error(`Failed to connect: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleNetworkChange = (network: Network) => {
    setSelectedNetwork(network);
    walletService.setNetwork(network);
  };

  const networks: Network[] = ['Mainnet', 'Preprod', 'Preview'];

  return (
    <div className="flex items-center gap-3">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isConnecting}
          className="flex items-center gap-1.5 bg-black text-white px-2.5 py-1 text-sm rounded hover:bg-[#FF7F11] transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span>{selectedNetwork}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-black border border-gray-700 rounded shadow-lg overflow-hidden z-50">
            {networks.map((network) => (
              <button
                key={network}
                onClick={() => handleNetworkChange(network)}
                className={`w-full px-3 py-1.5 text-sm text-left ${
                  network === selectedNetwork
                    ? 'bg-[#FF7F11] text-white'
                    : 'text-white hover:bg-[#FF7F11]'
                } transition-colors duration-150`}
              >
                {network}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="flex items-center gap-2 bg-black text-white px-3 py-1 text-sm rounded hover:bg-[#FF7F11] transition-colors disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isConnecting && <Loader2 className="w-4 h-4 animate-spin" />}
        {walletAddress && selectedWallet && window.cardano[selectedWallet] && (
          <img src={window.cardano[selectedWallet]?.icon} width="24" height="24" className="rounded" />
        )}
        <span>{walletAddress ? selectedWallet : "Connect Wallet"}</span>
      </button>
    </div>
  );
};

export default WalletConnector;
