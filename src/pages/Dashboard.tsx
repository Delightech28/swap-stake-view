
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { wallet, chartBar, chartPie } from 'lucide-react';

const Dashboard = () => {
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
    { name: 'ETH', value: 65, color: '#667eea' },
    { name: 'BTC', value: 25, color: '#764ba2' },
    { name: 'USDC', value: 10, color: '#f093fb' },
  ];

  const walletBalances = [
    { token: 'Ethereum', symbol: 'ETH', balance: '12.5847', usdValue: '$25,169.40', change: '+5.67%', positive: true },
    { token: 'Bitcoin', symbol: 'BTC', balance: '0.3421', usdValue: '$17,210.50', change: '+2.34%', positive: true },
    { token: 'USD Coin', symbol: 'USDC', balance: '5,000.00', usdValue: '$5,000.00', change: '0.00%', positive: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-400 text-lg">Track your portfolio and manage your crypto assets</p>
      </div>

      {/* Portfolio Overview */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-2">Total Portfolio Value</h3>
            <p className="text-3xl font-bold text-white">$47,379.90</p>
            <p className="text-green-400 text-sm mt-1">+$1,234.56 (+2.68%)</p>
          </div>
          <div className="text-center">
            <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-2">24h Change</h3>
            <p className="text-2xl font-bold text-green-400">+3.45%</p>
            <p className="text-gray-400 text-sm mt-1">+$1,587.23</p>
          </div>
          <div className="text-center">
            <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-2">Assets</h3>
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-gray-400 text-sm mt-1">Tokens</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-2 mb-6">
            <chartBar className="text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Portfolio Performance</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="url(#colorGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Distribution */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-2 mb-6">
            <chartPie className="text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Portfolio Distribution</h2>
          </div>
          <div className="h-64">
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
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Wallet Balances */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <wallet className="text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Wallet Balances</h2>
        </div>
        <div className="space-y-4">
          {walletBalances.map((asset, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-crypto-gradient rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{asset.symbol[0]}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{asset.token}</h3>
                  <p className="text-gray-400 text-sm">{asset.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">{asset.balance} {asset.symbol}</p>
                <p className="text-gray-400 text-sm">{asset.usdValue}</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${asset.positive ? 'text-green-400' : 'text-red-400'}`}>
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
