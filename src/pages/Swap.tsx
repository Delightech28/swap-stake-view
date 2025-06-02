
import { useState } from 'react';
import { arrowDown, arrowUp } from 'lucide-react';

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

  const calculateSwap = () => {
    if (!fromAmount) return;
    
    const fromTokenData = tokens.find(t => t.symbol === fromToken);
    const toTokenData = tokens.find(t => t.symbol === toToken);
    
    if (fromTokenData && toTokenData) {
      const usdValue = parseFloat(fromAmount) * fromTokenData.price;
      const toValue = usdValue / toTokenData.price;
      setToAmount(toValue.toFixed(6));
    }
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
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600 bg-clip-text text-transparent">
            Swap Tokens
          </h1>
          <p className="text-gray-400">Trade tokens instantly with the best rates</p>
        </div>

        {/* Swap Interface */}
        <div className="glass-card p-6 space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">From</label>
            <div className="bg-white/5 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="bg-transparent text-2xl font-semibold text-white placeholder-gray-400 outline-none flex-1"
                />
                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className="bg-crypto-gradient text-white px-4 py-2 rounded-lg font-semibold outline-none cursor-pointer"
                >
                  {tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol} className="bg-gray-800">
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Balance: 12.5847 {fromToken}</span>
                <span>${tokens.find(t => t.symbol === fromToken)?.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwapTokens}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:rotate-180"
            >
              <arrowDown className="w-6 h-6 text-purple-400" />
            </button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">To</label>
            <div className="bg-white/5 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  placeholder="0.0"
                  value={toAmount}
                  readOnly
                  className="bg-transparent text-2xl font-semibold text-white placeholder-gray-400 outline-none flex-1"
                />
                <select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  className="bg-crypto-gradient text-white px-4 py-2 rounded-lg font-semibold outline-none cursor-pointer"
                >
                  {tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol} className="bg-gray-800">
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Balance: 5,000.00 {toToken}</span>
                <span>${tokens.find(t => t.symbol === toToken)?.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Slippage Settings */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Slippage Tolerance</label>
            <div className="flex space-x-2">
              {['0.1', '0.5', '1.0'].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                    slippage === value
                      ? 'bg-crypto-gradient text-white'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
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
                className="bg-white/10 text-white px-2 py-1 rounded-lg text-sm outline-none w-16"
              />
            </div>
          </div>

          {/* Swap Details */}
          {fromAmount && toAmount && (
            <div className="bg-white/5 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Exchange Rate</span>
                <span>1 {fromToken} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Price Impact</span>
                <span className="text-green-400">0.01%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Network Fee</span>
                <span>~$12.50</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <button
            className="w-full crypto-button py-4 rounded-lg text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!fromAmount || !toAmount}
          >
            {!fromAmount ? 'Enter Amount' : 'Swap Tokens'}
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Swaps</h3>
          <div className="space-y-3">
            {[
              { from: 'ETH', to: 'USDC', amount: '2.5', time: '2 hours ago' },
              { from: 'BTC', to: 'ETH', amount: '0.1', time: '1 day ago' },
              { from: 'USDC', to: 'BTC', amount: '1000', time: '3 days ago' },
            ].map((tx, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <div className="flex items-center space-x-2">
                  <span className="text-white">{tx.amount} {tx.from}</span>
                  <arrowUp className="w-4 h-4 text-purple-400 rotate-45" />
                  <span className="text-gray-400">{tx.to}</span>
                </div>
                <span className="text-gray-400 text-sm">{tx.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
