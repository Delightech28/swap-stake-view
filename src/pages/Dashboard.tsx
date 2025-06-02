
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
    { name: 'BASED', value: 65, color: '#3b82f6' },
    { name: 'ETH', value: 25, color: '#1d4ed8' },
    { name: 'USDC', value: 10, color: '#60a5fa' },
  ];

  const walletBalances = [
    { token: 'Just a Based Guy', symbol: 'BASED', balance: '1,250,847', usdValue: '$125,084.70', change: '+15.67%', positive: true },
    { token: 'Ethereum', symbol: 'ETH', balance: '12.5847', usdValue: '$25,169.40', change: '+5.67%', positive: true },
    { token: 'USD Coin', symbol: 'USDC', balance: '5,000.00', usdValue: '$5,000.00', change: '0.00%', positive: true },
  ];

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 25%, #60a5fa 50%, #93c5fd 75%, #dbeafe 100%)'
    }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-blue-600/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <span className="text-white font-bold text-4xl">🐕</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl" style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              textShadow: '4px 4px 8px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246, 0.5)'
            }}>
              JUST A<br />BASED GUY
            </h1>
            <div className="bg-black/80 backdrop-blur-md rounded-3xl p-8 max-w-2xl mx-auto border-4 border-white shadow-2xl">
              <h2 className="text-3xl font-black text-blue-400 mb-4">TOKENOMICS</h2>
              <div className="space-y-3 text-white text-lg font-bold">
                <div>TOKEN SUPPLY: 1,000,000,000</div>
                <div>BUY/SELL TAX: 0%</div>
                <div className="text-blue-400 text-sm break-all">
                  CONTRACT ADDRESS:<br />
                  0XBASED840E261BF2A5AD629D41D5DE884CCBFDF3F7
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Portfolio Overview */}
        <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-8 border-4 border-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-blue-400 text-sm uppercase tracking-wider mb-3 font-bold">Total Portfolio Value</h3>
              <p className="text-5xl font-black text-white mb-2">$155,254.10</p>
              <p className="text-green-400 text-xl font-bold">+$12,345.67 (+8.64%)</p>
            </div>
            <div className="text-center">
              <h3 className="text-blue-400 text-sm uppercase tracking-wider mb-3 font-bold">24h Change</h3>
              <p className="text-4xl font-black text-green-400 mb-2">+15.45%</p>
              <p className="text-white text-xl">+$20,587.23</p>
            </div>
            <div className="text-center">
              <h3 className="text-blue-400 text-sm uppercase tracking-wider mb-3 font-bold">BASED Holdings</h3>
              <p className="text-4xl font-black text-white mb-2">1.25M</p>
              <p className="text-blue-400 text-xl">Tokens</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Price Chart */}
          <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-8 border-4 border-white shadow-2xl">
            <div className="flex items-center space-x-3 mb-8">
              <BarChart3 className="text-blue-400 w-8 h-8" />
              <h2 className="text-3xl font-black text-white">BASED Performance</h2>
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
                      border: '2px solid #3b82f6',
                      borderRadius: '12px',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    dot={{ fill: '#60a5fa', strokeWidth: 3, r: 6 }}
                    activeDot={{ r: 8, fill: '#1d4ed8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Portfolio Distribution */}
          <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-8 border-4 border-white shadow-2xl">
            <div className="flex items-center space-x-3 mb-8">
              <PieChartIcon className="text-blue-400 w-8 h-8" />
              <h2 className="text-3xl font-black text-white">Portfolio Split</h2>
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
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      border: '2px solid #3b82f6',
                      borderRadius: '12px',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Wallet Balances */}
        <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-8 border-4 border-white shadow-2xl">
          <div className="flex items-center space-x-3 mb-8">
            <Wallet className="text-blue-400 w-8 h-8" />
            <h2 className="text-3xl font-black text-white">Based Holdings</h2>
          </div>
          <div className="space-y-6">
            {walletBalances.map((asset, index) => (
              <div key={index} className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-900/50 to-blue-800/50 hover:from-blue-800/60 hover:to-blue-700/60 transition-all duration-300 border-2 border-blue-500/30 hover:border-blue-400/50">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-lg">{asset.symbol === 'BASED' ? '🐕' : asset.symbol[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-black text-white text-xl">{asset.token}</h3>
                    <p className="text-blue-400 text-lg font-bold">{asset.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-white text-xl">{asset.balance} {asset.symbol}</p>
                  <p className="text-blue-400 text-lg">{asset.usdValue}</p>
                </div>
                <div className="text-right">
                  <p className={`font-black text-xl ${asset.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-8 border-4 border-white shadow-2xl">
          <h2 className="text-4xl font-black text-blue-400 mb-6 text-center">WHAT DOES IT MEAN TO BE A BASED GUY?</h2>
          <div className="space-y-4 text-white text-lg font-bold max-w-4xl mx-auto">
            <p>1) IT MEANS WE WORK HARD</p>
            <p>2) IT MEANS WE'RE INCREDIBLY OPTIMISTIC</p>
            <p>3) IT MEANS WE PUSH BOUNDARIES WITH CREATIVITY SO WE'RE NOT AFRAID TO GO OUTSIDE THE BOX THINK OUTSIDE THE BOX DRAW OUTSIDE THE LINES</p>
            <p>4) IT MEANS WE DO THE RIGHT THING EVEN WHEN IT'S TOUGH</p>
            <p>5) IT MEANS WE PUT THE TEAM OVER THE INDIVIDUAL</p>
            <p className="text-center mt-8 text-xl">
              WE'RE CREATING A NEW CULTURE THAT CAN HELP THE BASE ECONOMY WORK BETTER FOR THE PEOPLE. THAT'S WHAT BEING A BASED GUY MEANS, AND THIS DEFINES OUR MISSION FOR THE JUST A BASED GUY CTO. 
              <span className="text-blue-400 font-black">STAY BASED OUT THERE!!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
