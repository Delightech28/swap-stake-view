
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet, BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { useTokenPrice } from '../hooks/useTokenPrice';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { useBaseBalances } from '../hooks/useBaseBalances';

const Dashboard = () => {
  const { data: bloomPrice, isLoading: priceLoading } = useTokenPrice();
  const { bloomBalance, isConnected } = useTokenBalance();
  const { ethBalance, usdcBalance, usdtBalance } = useBaseBalances();

  const priceData = [
    { time: '00:00', price: 45000 },
    { time: '04:00', price: 46200 },
    { time: '08:00', price: 45800 },
    { time: '12:00', price: 47500 },
    { time: '16:00', price: 48200 },
    { time: '20:00', price: 49100 },
    { time: '24:00', price: 50300 },
  ];

  const portfolioData = [
    { name: 'BLOOM', value: 45, color: '#16a34a' },
    { name: 'ETH', value: 35, color: '#22c55e' },
    { name: 'USDC', value: 20, color: '#4ade80' },
  ];

  // Calculate USD values for real balances
  const bloomUsdValue = isConnected && bloomPrice && bloomPrice.price > 0 
    ? (parseFloat(bloomBalance) * bloomPrice.price).toFixed(2)
    : '0.00';

  const ethUsdValue = isConnected 
    ? (parseFloat(ethBalance) * 2000).toFixed(2) // Using approximate ETH price
    : '0.00';

  const usdcUsdValue = isConnected 
    ? parseFloat(usdcBalance).toFixed(2)
    : '0.00';

  const usdtUsdValue = isConnected 
    ? parseFloat(usdtBalance).toFixed(2)
    : '0.00';

  const walletBalances = [
    { 
      token: 'BLOOM Token', 
      symbol: 'BLOOM', 
      balance: isConnected ? parseFloat(bloomBalance).toFixed(4) : '0.0000', 
      usdValue: `$${bloomUsdValue}`, 
      change: bloomPrice && bloomPrice.priceChange24h !== 0 ? `${bloomPrice.priceChange24h > 0 ? '+' : ''}${bloomPrice.priceChange24h.toFixed(2)}%` : '0.00%', 
      positive: bloomPrice ? bloomPrice.priceChange24h >= 0 : true 
    },
    { 
      token: 'Ethereum (Base)', 
      symbol: 'ETH', 
      balance: isConnected ? parseFloat(ethBalance).toFixed(4) : '0.0000', 
      usdValue: `$${ethUsdValue}`, 
      change: '+2.45%', 
      positive: true 
    },
    { 
      token: 'USD Coin (Base)', 
      symbol: 'USDC', 
      balance: isConnected ? parseFloat(usdcBalance).toFixed(2) : '0.00', 
      usdValue: `$${usdcUsdValue}`, 
      change: '0.00%', 
      positive: true 
    },
    { 
      token: 'Tether (Base)', 
      symbol: 'USDT', 
      balance: isConnected ? parseFloat(usdtBalance).toFixed(2) : '0.00', 
      usdValue: `$${usdtUsdValue}`, 
      change: '-0.01%', 
      positive: false 
    },
  ];

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-8 space-y-4 md:space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 md:space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-400 text-base md:text-lg">Track your portfolio and manage your crypto assets</p>
      </div>

      {/* BLOOM Token Spotlight */}
      <div className="glass-card p-4 md:p-8 border border-green-500/20 shadow-2xl shadow-green-500/10">
        <div className="flex items-center space-x-3 mb-4 md:mb-6">
          <TrendingUp className="text-green-400 w-5 h-5 md:w-6 md:h-6" />
          <h2 className="text-xl md:text-2xl font-bold text-white">$BLOOM Token (Base)</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="text-center">
            <h3 className="text-gray-400 text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-3 font-semibold">Current Price</h3>
            <p className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
              {priceLoading ? '...' : `$${bloomPrice?.price.toFixed(8) || '0.00000000'}`}
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-gray-400 text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-3 font-semibold">24h Change</h3>
            <p className={`text-xl md:text-2xl font-bold mb-1 md:mb-2 ${
              bloomPrice && bloomPrice.priceChange24h > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {priceLoading ? '...' : `${bloomPrice?.priceChange24h > 0 ? '+' : ''}${bloomPrice?.priceChange24h.toFixed(2) || '0.00'}%`}
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-gray-400 text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-3 font-semibold">24h Volume</h3>
            <p className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">
              {priceLoading ? '...' : `$${bloomPrice?.volume24h.toLocaleString() || '0'}`}
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-gray-400 text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-3 font-semibold">Your Balance</h3>
            <p className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">
              {isConnected ? `${parseFloat(bloomBalance).toFixed(2)} BLOOM` : 'Connect Wallet'}
            </p>
            <p className="text-gray-400 text-sm">
              {isConnected ? `$${bloomUsdValue}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="glass-card p-4 md:p-8 border border-green-500/20 shadow-2xl shadow-green-500/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div className="text-center">
            <h3 className="text-gray-400 text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-3 font-semibold">Total Portfolio Value</h3>
            <p className="text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">
              ${isConnected ? (parseFloat(bloomUsdValue) + parseFloat(ethUsdValue) + parseFloat(usdcUsdValue) + parseFloat(usdtUsdValue)).toFixed(2) : '0.00'}
            </p>
            <p className="text-green-400 text-base md:text-lg font-medium">Base Network</p>
          </div>
          <div className="text-center">
            <h3 className="text-gray-400 text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-3 font-semibold">24h Change</h3>
            <p className="text-2xl md:text-3xl font-bold text-green-400 mb-1 md:mb-2">
              {bloomPrice ? `${bloomPrice.priceChange24h > 0 ? '+' : ''}${bloomPrice.priceChange24h.toFixed(2)}%` : '0.00%'}
            </p>
            <p className="text-gray-400 text-base md:text-lg">BLOOM Performance</p>
          </div>
          <div className="text-center">
            <h3 className="text-gray-400 text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-3 font-semibold">Assets</h3>
            <p className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">4</p>
            <p className="text-gray-400 text-base md:text-lg">Base Tokens</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Price Chart */}
        <div className="glass-card p-4 md:p-8 border border-green-500/20 shadow-2xl shadow-green-500/10">
          <div className="flex items-center space-x-3 mb-4 md:mb-8">
            <BarChart3 className="text-green-400 w-5 h-5 md:w-6 md:h-6" />
            <h2 className="text-xl md:text-2xl font-bold text-white">Portfolio Performance</h2>
          </div>
          <div className="h-60 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="url(#greenGradient)"
                  strokeWidth={4}
                  dot={{ fill: '#22c55e', strokeWidth: 3, r: 6 }}
                  activeDot={{ r: 8, fill: '#16a34a' }}
                />
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Distribution */}
        <div className="glass-card p-4 md:p-8 border border-green-500/20 shadow-2xl shadow-green-500/10">
          <div className="flex items-center space-x-3 mb-4 md:mb-8">
            <PieChartIcon className="text-green-400 w-5 h-5 md:w-6 md:h-6" />
            <h2 className="text-xl md:text-2xl font-bold text-white">Portfolio Distribution</h2>
          </div>
          <div className="h-60 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Wallet Balances */}
      <div className="glass-card p-4 md:p-8 border border-green-500/20 shadow-2xl shadow-green-500/10">
        <div className="flex items-center space-x-3 mb-4 md:mb-8">
          <Wallet className="text-green-400 w-5 h-5 md:w-6 md:h-6" />
          <h2 className="text-xl md:text-2xl font-bold text-white">Base Network Balances</h2>
        </div>
        <div className="space-y-4 md:space-y-6">
          {walletBalances.map((asset, index) => (
            <div key={index} className="flex items-center justify-between p-4 md:p-6 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-green-500/10 hover:to-green-600/10 transition-all duration-300 border border-white/10 hover:border-green-500/20">
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                  <span className="text-white font-bold text-base md:text-lg">{asset.symbol[0]}</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base md:text-lg">{asset.token}</h3>
                  <p className="text-gray-400 text-sm md:text-base font-medium">{asset.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white text-base md:text-lg">{asset.balance} {asset.symbol}</p>
                <p className="text-gray-400 text-sm md:text-base">{asset.usdValue}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold text-base md:text-lg ${asset.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
