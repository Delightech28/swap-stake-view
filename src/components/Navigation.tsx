
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
    <nav className="glass-card p-6 m-4 sticky top-4 z-50 border border-green-500/20 shadow-2xl shadow-green-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl animate-pulse-green shadow-lg shadow-green-500/30"></div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">
            CryptoSwap
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8 py-3 rounded-xl text-white font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-105">
            Connect Wallet
          </button>
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
        <div className="md:hidden mt-6 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 rounded-xl text-white font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300">
            Connect Wallet
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
