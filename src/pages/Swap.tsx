
import { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, AlertTriangle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { useTokenPrices } from '../hooks/useTokenPrices';
import { useLiquidity } from '../hooks/useLiquidity';
import { useBaseBalances } from '../hooks/useBaseBalances';
import { Alert, AlertDescription } from '../components/ui/alert';

const Swap = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState('BLOOM');
  const [toToken, setToToken] = useState('ETH');
  const [slippage, setSlippage] = useState('0.5');
  const [error, setError] = useState('');

  const { isConnected } = useAccount();
  const { bloomBalance } = useTokenBalance();
  const { data: prices, isLoading: pricesLoading } = useTokenPrices();
  const { data: liquidity } = useLiquidity();
  const { ethBalance, usdcBalance, usdtBalance } = useBaseBalances();

  const tokens = [
    { 
      symbol: 'BLOOM', 
      name: 'BLOOM Token', 
      price: prices?.bloom.price || 0.00003538,
      priceChange24h: prices?.bloom.priceChange24h || 0,
      balance: isConnected ? bloomBalance : '0'
    },
    { 
      symbol: 'ETH', 
      name: 'Ethereum (Base)', 
      price: prices?.eth.price || 3500,
      priceChange24h: prices?.eth.priceChange24h || 0,
      balance: isConnected ? ethBalance : '0'
    },
    { 
      symbol: 'USDC', 
      name: 'USD Coin (Base)', 
      price: prices?.usdc.price || 1,
      priceChange24h: prices?.usdc.priceChange24h || 0,
      balance: isConnected ? usdcBalance : '0' 
    },
    { 
      symbol: 'USDT', 
      name: 'Tether (Base)', 
      price: prices?.usdt.price || 1,
      priceChange24h: prices?.usdt.priceChange24h || 0,
      balance: isConnected ? usdtBalance : '0' 
    },
  ];

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
    setError('');
  };

  const validateSwap = (amount: string, token: string) => {
    if (!amount || !isConnected) return '';
    
    const fromTokenData = tokens.find(t => t.symbol === token);
    const amountNum = parseFloat(amount);
    const balance = parseFloat(fromTokenData?.balance || '0');
    
    if (amountNum > balance) {
      return 'Insufficient balance';
    }
    
    // Check liquidity for BLOOM swaps
    if (token === 'BLOOM' && liquidity) {
      const usdValue = amountNum * (fromTokenData?.price || 0);
      let availableLiquidity = 0;
      
      if (toToken === 'ETH') {
        availableLiquidity = liquidity.bloomEthLiquidity;
      } else if (toToken === 'USDC') {
        availableLiquidity = liquidity.bloomUsdcLiquidity;
      } else if (toToken === 'USDT') {
        availableLiquidity = liquidity.bloomUsdtLiquidity;
      }
      
      if (usdValue > availableLiquidity * 0.1) { // Allow up to 10% of liquidity
        return 'Insufficient liquidity for this swap amount';
      }
    }
    
    return '';
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    
    if (value) {
      const fromTokenData = tokens.find(t => t.symbol === fromToken);
      const toTokenData = tokens.find(t => t.symbol === toToken);
      
      if (fromTokenData && toTokenData && fromTokenData.price && toTokenData.price) {
        const usdValue = parseFloat(value) * fromTokenData.price;
        const toValue = usdValue / toTokenData.price;
        setToAmount(toValue.toFixed(8));
        
        // Apply slippage for display
        const slippageNum = parseFloat(slippage) / 100;
        const finalAmount = toValue * (1 - slippageNum);
        setToAmount(finalAmount.toFixed(8));
      }
    } else {
      setToAmount('');
    }
    
    // Validate the swap
    const validationError = validateSwap(value, fromToken);
    setError(validationError);
  };

  const formatPriceChange = (change: number) => {
    const isPositive = change >= 0;
    const formattedChange = Math.abs(change).toFixed(2);
    return (
      <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? '+' : '-'}{formattedChange}%
      </span>
    );
  };

  useEffect(() => {
    if (fromAmount) {
      handleFromAmountChange(fromAmount);
    }
  }, [prices, fromToken, toToken, slippage]);

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
      <div className="max-w-md md:max-w-lg mx-auto space-y-4 md:space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 md:space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">
            Swap Tokens
          </h1>
          <p className="text-gray-400 text-base md:text-lg">Trade tokens instantly on Base Network</p>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="glass-card p-4 md:p-6 border border-yellow-500/20 shadow-2xl shadow-yellow-500/10">
            <p className="text-center text-yellow-400 font-medium">
              Connect your wallet to see real Base network balances and enable swapping
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="border-red-500/20 bg-red-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Swap Interface */}
        <div className="glass-card p-4 md:p-8 space-y-4 md:space-y-6 border border-green-500/20 shadow-2xl shadow-green-500/10">
          {/* From Token */}
          <div className="space-y-3">
            <label className="text-sm text-gray-400 font-semibold uppercase tracking-wider">From</label>
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-4 md:p-6 space-y-4 border border-white/10 hover:border-green-500/20 transition-all duration-300">
              <div className="flex justify-between items-center gap-2">
                <input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="bg-transparent text-2xl md:text-3xl font-bold text-white placeholder-gray-400 outline-none flex-1 min-w-0"
                />
                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-xl font-bold outline-none cursor-pointer shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300 text-sm md:text-base"
                >
                  {tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol} className="bg-gray-800">
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between text-xs md:text-sm text-gray-400">
                <span className="font-medium">
                  Balance: {parseFloat(tokens.find(t => t.symbol === fromToken)?.balance || '0').toFixed(4)} {fromToken}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">${tokens.find(t => t.symbol === fromToken)?.price.toLocaleString()}</span>
                  {formatPriceChange(tokens.find(t => t.symbol === fromToken)?.priceChange24h || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwapTokens}
              className="p-3 md:p-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:rotate-180 shadow-lg shadow-green-500/30 hover:shadow-green-500/40"
            >
              <ArrowDown className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>

          {/* To Token */}
          <div className="space-y-3">
            <label className="text-sm text-gray-400 font-semibold uppercase tracking-wider">To</label>
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-4 md:p-6 space-y-4 border border-white/10 hover:border-green-500/20 transition-all duration-300">
              <div className="flex justify-between items-center gap-2">
                <input
                  type="number"
                  placeholder="0.0"
                  value={toAmount}
                  readOnly
                  className="bg-transparent text-2xl md:text-3xl font-bold text-white placeholder-gray-400 outline-none flex-1 min-w-0"
                />
                <select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-xl font-bold outline-none cursor-pointer shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300 text-sm md:text-base"
                >
                  {tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol} className="bg-gray-800">
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between text-xs md:text-sm text-gray-400">
                <span className="font-medium">
                  Balance: {parseFloat(tokens.find(t => t.symbol === toToken)?.balance || '0').toFixed(4)} {toToken}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">${tokens.find(t => t.symbol === toToken)?.price.toLocaleString()}</span>
                  {formatPriceChange(tokens.find(t => t.symbol === toToken)?.priceChange24h || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Slippage Settings */}
          <div className="space-y-3">
            <label className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Slippage Tolerance</label>
            <div className="flex space-x-2 md:space-x-3">
              {['0.1', '0.5', '1.0'].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 ${
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
                className="bg-white/10 text-white px-2 md:px-3 py-2 rounded-lg text-xs md:text-sm outline-none w-16 md:w-20 font-semibold border border-white/10 focus:border-green-500/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Swap Details */}
          {fromAmount && toAmount && (
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-4 md:p-6 space-y-3 text-xs md:text-sm border border-white/10">
              <div className="flex justify-between text-gray-400">
                <span className="font-medium">Exchange Rate</span>
                <span className="font-bold text-white">1 {fromToken} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(8)} {toToken}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span className="font-medium">Price Impact</span>
                <span className="text-green-400 font-bold">0.01%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span className="font-medium">Slippage Tolerance</span>
                <span className="font-bold text-white">{slippage}%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span className="font-medium">Base Network Fee</span>
                <span className="font-bold text-white">~$0.05</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <button
            className={`w-full py-3 md:py-4 rounded-xl text-white font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-[1.02] ${
              !fromAmount || !toAmount || !isConnected || error
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30 hover:shadow-green-500/40'
            }`}
            disabled={!fromAmount || !toAmount || !isConnected || !!error}
          >
            {!isConnected ? 'Connect Wallet' : error ? error : !fromAmount ? 'Enter Amount' : 'Swap on Base Network'}
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-4 md:p-8 border border-green-500/20 shadow-2xl shadow-green-500/10">
          <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Recent Base Network Swaps</h3>
          <div className="space-y-3 md:space-y-4">
            {[
              { from: 'BLOOM', to: 'ETH', amount: '1000', time: '2 hours ago' },
              { from: 'ETH', to: 'BLOOM', amount: '0.5', time: '1 day ago' },
              { from: 'BLOOM', to: 'USDC', amount: '500', time: '3 days ago' },
            ].map((tx, index) => (
              <div key={index} className="flex justify-between items-center p-3 md:p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-green-500/10 hover:to-green-600/10 transition-all duration-300 border border-white/10 hover:border-green-500/20">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <span className="text-white font-semibold text-sm md:text-base">{tx.amount} {tx.from}</span>
                  <ArrowUp className="w-3 h-3 md:w-4 md:h-4 text-green-400 rotate-45" />
                  <span className="text-gray-400 font-medium text-sm md:text-base">{tx.to}</span>
                </div>
                <span className="text-gray-400 text-xs md:text-sm font-medium">{tx.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
