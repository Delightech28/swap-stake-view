
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  Identity,
  Avatar,
  Name,
  Address,
  EthBalance
} from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isConnected } = useAccount();

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Swap', path: '/swap' },
    { name: 'Staking', path: '/staking' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass-card p-4 md:p-6 m-2 md:m-4 sticky top-2 md:top-4 z-50 border border-green-500/20 shadow-2xl shadow-green-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl animate-pulse-green shadow-lg shadow-green-500/30"></div>
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">
            CryptoSwap
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 font-semibold text-sm md:text-base ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5'
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          <Wallet>
            <ConnectWallet className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 md:px-8 py-2 md:py-3 rounded-xl text-white font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-105 text-sm md:text-base">
              <Avatar className="h-5 w-5 md:h-6 md:w-6" />
              <Name className="text-sm md:text-base" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address className="text-gray-400" />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 md:mt-6 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 font-semibold text-sm md:text-base ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          <div className="pt-2">
            <Wallet>
              <ConnectWallet className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-4 md:px-6 py-2 md:py-3 rounded-xl text-white font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300 text-sm md:text-base flex items-center justify-center space-x-2">
                <Avatar className="h-5 w-5 md:h-6 md:w-6" />
                <Name className="text-sm md:text-base" />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address className="text-gray-400" />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
