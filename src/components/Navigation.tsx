
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Swap', path: '/swap' },
    { name: 'Staking', path: '/staking' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass-card p-4 m-4 sticky top-4 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-crypto-gradient rounded-lg animate-glow"></div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            CryptoSwap
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-crypto-gradient text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button className="crypto-button px-6 py-2 rounded-lg text-white font-medium">
            Connect Wallet
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-crypto-gradient text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <button className="w-full crypto-button px-4 py-2 rounded-lg text-white font-medium">
            Connect Wallet
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
