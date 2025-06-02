
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
    <nav className="bg-black/90 backdrop-blur-xl border-b-4 border-blue-500 shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-white font-bold text-xl">🐕</span>
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-white" style={{
                fontFamily: 'Impact, Arial Black, sans-serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                JUST A BASED GUY
              </div>
              <div className="text-blue-400 text-sm font-bold">$BASED</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-6 py-3 rounded-2xl transition-all duration-300 font-black text-lg border-2 ${
                  isActive(item.path)
                    ? 'bg-blue-500 text-white border-white shadow-lg'
                    : 'text-white border-blue-500/50 hover:bg-blue-500/20 hover:border-blue-400'
                }`}
              >
                {item.name.toUpperCase()}
              </Link>
            ))}
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-3 rounded-2xl text-white font-black text-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              BUY HERE!
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-3 rounded-lg hover:bg-blue-500/20 transition-colors duration-300 border-2 border-blue-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-6 py-4 rounded-2xl transition-all duration-300 font-black text-lg border-2 ${
                  isActive(item.path)
                    ? 'bg-blue-500 text-white border-white shadow-lg'
                    : 'text-white border-blue-500/50 hover:bg-blue-500/20 hover:border-blue-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name.toUpperCase()}
              </Link>
            ))}
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-4 rounded-2xl text-white font-black text-lg border-2 border-white shadow-lg transition-all duration-300">
              BUY HERE!
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
