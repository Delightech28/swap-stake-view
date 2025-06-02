
import { useState } from 'react';

const Staking = () => {
  const [selectedPool, setSelectedPool] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [activeTab, setActiveTab] = useState('stake');

  const stakingPools = [
    {
      name: 'ETH Staking',
      symbol: 'ETH',
      apy: '4.2%',
      totalStaked: '32.5 ETH',
      rewards: '0.1234 ETH',
      lockPeriod: 'Flexible',
      minStake: '0.01',
      description: 'Stake ETH and earn rewards while securing the network'
    },
    {
      name: 'BTC Pool',
      symbol: 'BTC',
      apy: '3.8%',
      totalStaked: '1.2 BTC',
      rewards: '0.0045 BTC',
      lockPeriod: '30 days',
      minStake: '0.001',
      description: 'High-yield BTC staking with locked rewards'
    },
    {
      name: 'USDC Vault',
      symbol: 'USDC',
      apy: '8.5%',
      totalStaked: '10,000 USDC',
      rewards: '125.67 USDC',
      lockPeriod: 'Flexible',
      minStake: '100',
      description: 'Stable coin staking with competitive returns'
    },
  ];

  const currentPool = stakingPools[selectedPool];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600 bg-clip-text text-transparent">
          Staking Pools
        </h1>
        <p className="text-gray-400 text-lg">Earn passive income by staking your crypto assets</p>
      </div>

      {/* Staking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center">
          <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-2">Total Staked Value</h3>
          <p className="text-2xl font-bold text-white">$89,234.50</p>
          <p className="text-green-400 text-sm mt-1">+$2,456.78 this month</p>
        </div>
        <div className="glass-card p-6 text-center">
          <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-2">Total Rewards Earned</h3>
          <p className="text-2xl font-bold text-purple-400">$1,245.67</p>
          <p className="text-gray-400 text-sm mt-1">This month</p>
        </div>
        <div className="glass-card p-6 text-center">
          <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-2">Average APY</h3>
          <p className="text-2xl font-bold text-green-400">5.5%</p>
          <p className="text-gray-400 text-sm mt-1">Across all pools</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Staking Pools */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">Available Pools</h2>
          <div className="space-y-4">
            {stakingPools.map((pool, index) => (
              <div
                key={index}
                onClick={() => setSelectedPool(index)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedPool === index
                    ? 'bg-crypto-gradient shadow-lg shadow-purple-500/25'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{pool.name}</h3>
                    <p className="text-gray-400 text-sm">{pool.description}</p>
                  </div>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm font-semibold">
                    {pool.apy} APY
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Total Staked:</span>
                    <p className="text-white font-medium">{pool.totalStaked}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Lock Period:</span>
                    <p className="text-white font-medium">{pool.lockPeriod}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staking Interface */}
        <div className="glass-card p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('stake')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'stake'
                  ? 'bg-crypto-gradient text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Stake
            </button>
            <button
              onClick={() => setActiveTab('unstake')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'unstake'
                  ? 'bg-crypto-gradient text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Unstake
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">{currentPool.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">APY:</span>
                  <p className="text-green-400 font-semibold">{currentPool.apy}</p>
                </div>
                <div>
                  <span className="text-gray-400">Min Stake:</span>
                  <p className="text-white">{currentPool.minStake} {currentPool.symbol}</p>
                </div>
                <div>
                  <span className="text-gray-400">Your Staked:</span>
                  <p className="text-white">{currentPool.totalStaked}</p>
                </div>
                <div>
                  <span className="text-gray-400">Rewards:</span>
                  <p className="text-purple-400">{currentPool.rewards}</p>
                </div>
              </div>
            </div>

            {activeTab === 'stake' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Amount to Stake</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="0.0"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="flex-1 bg-white/10 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="bg-white/10 px-4 py-3 rounded-lg text-gray-400">
                      {currentPool.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>Available: 12.5847 {currentPool.symbol}</span>
                    <button
                      onClick={() => setStakeAmount('12.5847')}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Max
                    </button>
                  </div>
                </div>

                {stakeAmount && (
                  <div className="bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Annual Rewards:</span>
                      <span className="text-green-400">
                        {(parseFloat(stakeAmount) * parseFloat(currentPool.apy) / 100).toFixed(4)} {currentPool.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lock Period:</span>
                      <span className="text-white">{currentPool.lockPeriod}</span>
                    </div>
                  </div>
                )}

                <button
                  disabled={!stakeAmount || parseFloat(stakeAmount) < parseFloat(currentPool.minStake)}
                  className="w-full crypto-button py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Stake {currentPool.symbol}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Amount to Unstake</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="0.0"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      className="flex-1 bg-white/10 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="bg-white/10 px-4 py-3 rounded-lg text-gray-400">
                      {currentPool.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>Staked: {currentPool.totalStaked}</span>
                    <button
                      onClick={() => setUnstakeAmount(currentPool.totalStaked.split(' ')[0])}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Max
                    </button>
                  </div>
                </div>

                <button
                  disabled={!unstakeAmount}
                  className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Unstake {currentPool.symbol}
                </button>

                <button className="w-full crypto-button py-3 rounded-lg text-white font-semibold">
                  Claim Rewards ({currentPool.rewards})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Staking History */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">Staking History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="text-left py-2">Pool</th>
                <th className="text-left py-2">Action</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {[
                { pool: 'ETH', action: 'Stake', amount: '5.0 ETH', date: '2024-01-15', status: 'Active' },
                { pool: 'BTC', action: 'Claim', amount: '0.0045 BTC', date: '2024-01-14', status: 'Completed' },
                { pool: 'USDC', action: 'Stake', amount: '2,000 USDC', date: '2024-01-10', status: 'Active' },
              ].map((tx, index) => (
                <tr key={index} className="border-t border-white/10">
                  <td className="py-3">{tx.pool}</td>
                  <td className="py-3">{tx.action}</td>
                  <td className="py-3">{tx.amount}</td>
                  <td className="py-3">{tx.date}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      tx.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Staking;
