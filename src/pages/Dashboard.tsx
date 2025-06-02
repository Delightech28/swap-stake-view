
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

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
    { name: 'ETH', value: 65, color: '#16a34a' },
    { name: 'BTC', value: 25, color: '#22c55e' },
    { name: 'USDC', value: 10, color: '#4ade80' },
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
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-400 text-lg">Track your portfolio and manage your crypto assets</p>
      </div>

      {/* Portfolio Overview */}
      <div className="glass-card p-8 border border-green-500/20 shadow-2xl shadow-green-500/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-3 font-semibold">Total Portfolio Value</h3>
            <p className="text-4xl font-bold text-white mb-2">$47,379.90</p>
            <p className="text-green-400 text-lg font-medium">+$1,234.56 (+2.68%)</p>
          </div>
          <div className="text-center">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-3 font-semibold">24h Change</h3>
            <p className="text-3xl font-bold text-green-400 mb-2">+3.45%</p>
            <p className="text-gray-400 text-lg">+$1,587.23</p>
          </div>
          <div className="text-center">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-3 font-semibold">Assets</h3>
            <p className="text-3xl font-bold text-white mb-2">3</p>
            <p className="text-gray-400 text-lg">Tokens</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price Chart */}
        <div className="glass-card p-8 border border-green-500/20 shadow-2xl shadow-green-500/10">
          <div className="flex items-center space-x-3 mb-8">
            <BarChart3 className="text-green-400 w-6 h-6" />
            <h2 className="text-2xl font-bold text-white">Portfolio Performance</h2>
          </div>
          <div className="h-80">
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
        <div className="glass-card p-8 border border-green-500/20 shadow-2xl shadow-green-500/10">
          <div className="flex items-center space-x-3 mb-8">
            <PieChartIcon className="text-green-400 w-6 h-6" />
            <h2 className="text-2xl font-bold text-white">Portfolio Distribution</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelStyle={{ fill: 'white', fontWeight: 'bold' }}
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
      <div className="glass-card p-8 border border-green-500/20 shadow-2xl shadow-green-500/10">
        <div className="flex items-center space-x-3 mb-8">
          <Wallet className="text-green-400 w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Wallet Balances</h2>
        </div>
        <div className="space-y-6">
          {walletBalances.map((asset, index) => (
            <div key={index} className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-green-500/10 hover:to-green-600/10 transition-all duration-300 border border-white/10 hover:border-green-500/20">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                  <span className="text-white font-bold text-lg">{asset.symbol[0]}</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{asset.token}</h3>
                  <p className="text-gray-400 text-base font-medium">{asset.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white text-lg">{asset.balance} {asset.symbol}</p>
                <p className="text-gray-400 text-base">{asset.usdValue}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${asset.positive ? 'text-green-400' : 'text-red-400'}`}>
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
