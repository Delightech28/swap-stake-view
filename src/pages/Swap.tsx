
import { useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

const Swap = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [slippage, setSlippage] = useState('0.5');

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', price: 2000 },
    { symbol: 'BTC', name: 'Bitcoin', price: 50000 },
    { symbol: 'USDC', name: 'USD Coin', price: 1 },
    { symbol: 'USDT', name: 'Tether', price: 1 },
  ];

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value) {
      const fromTokenData = tokens.find(t => t.symbol === fromToken);
      const toTokenData = tokens.find(t => t.symbol === toToken);
      
      if (fromTokenData && toTokenData) {
        const usdValue = parseFloat(value) * fromTokenData.price;
        const toValue = usdValue / toTokenData.price;
        setToAmount(toValue.toFixed(6));
      }
    } else {
      setToAmount('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">
            Swap Tokens
          </h1>
          <p className="text-gray-400 text-lg">Trade tokens instantly with the best rates</p>
        </div>

        {/* Swap Interface */}
        <div className="glass-card p-8 space-y-6 border border-green-500/20 shadow-2xl shadow-green-500/10">
          {/* From Token */}
          <div className="space-y-3">
            <label className="text-sm text-gray-400 font-semibold uppercase tracking-wider">From</label>
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-6 space-y-4 border border-white/10 hover:border-green-500/20 transition-all duration-300">
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="bg-transparent text-3xl font-bold text-white placeholder-gray-400 outline-none flex-1 mr-4"
                />
                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold outline-none cursor-pointer shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300"
                >
                  {tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol} className="bg-gray-800">
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span className="font-medium">Balance: 12.5847 {fromToken}</span>
                <span className="font-bold">${tokens.find(t => t.symbol === fromToken)?.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwapTokens}
              className="p-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:rotate-180 shadow-lg shadow-green-500/30 hover:shadow-green-500/40"
            >
              <ArrowDown className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* To Token */}
          <div className="space-y-3">
            <label className="text-sm text-gray-400 font-semibold uppercase tracking-wider">To</label>
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-6 space-y-4 border border-white/10 hover:border-green-500/20 transition-all duration-300">
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  placeholder="0.0"
                  value={toAmount}
                  readOnly
                  className="bg-transparent text-3xl font-bold text-white placeholder-gray-400 outline-none flex-1 mr-4"
                />
                <select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold outline-none cursor-pointer shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300"
                >
                  {tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol} className="bg-gray-800">
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span className="font-medium">Balance: 5,000.00 {toToken}</span>
                <span className="font-bold">${tokens.find(t => t.symbol === toToken)?.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Slippage Settings */}
          <div className="space-y-3">
            <label className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Slippage Tolerance</label>
            <div className="flex space-x-3">
              {['0.1', '0.5', '1.0'].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    slippage === value
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <input
                type="number"
                step="0.1"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="bg-white/10 text-white px-3 py-2 rounded-lg text-sm outline-none w-20 font-semibold border border-white/10 focus:border-green-500/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Swap Details */}
          {fromAmount && toAmount && (
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-6 space-y-3 text-sm border border-white/10">
              <div className="flex justify-between text-gray-400">
                <span className="font-medium">Exchange Rate</span>
                <span className="font-bold text-white">{fromToken} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span className="font-medium">Price Impact</span>
                <span className="text-green-400 font-bold">0.01%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span className="font-medium">Network Fee</span>
                <span className="font-bold text-white">~$12.50</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <button
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-4 rounded-xl text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-[1.02]"
            disabled={!fromAmount || !toAmount}
          >
            {!fromAmount ? 'Enter Amount' : 'Swap Tokens'}
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-8 border border-green-500/20 shadow-2xl shadow-green-500/10">
          <h3 className="text-xl font-bold text-white mb-6">Recent Swaps</h3>
          <div className="space-y-4">
            {[
              { from: 'ETH', to: 'USDC', amount: '2.5', time: '2 hours ago' },
              { from: 'BTC', to: 'ETH', amount: '0.1', time: '1 day ago' },
              { from: 'USDC', to: 'BTC', amount: '1000', time: '3 days ago' },
            ].map((tx, index) => (
              <div key={index} className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-green-500/10 hover:to-green-600/10 transition-all duration-300 border border-white/10 hover:border-green-500/20">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-semibold">{tx.amount} {tx.from}</span>
                  <ArrowUp className="w-4 h-4 text-green-400 rotate-45" />
                  <span className="text-gray-400 font-medium">{tx.to}</span>
                </div>
                <span className="text-gray-400 text-sm font-medium">{tx.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
