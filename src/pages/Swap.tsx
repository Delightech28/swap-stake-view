import { useState, useEffect } from 'react';
import { ArrowDown, AlertTriangle, Info, CheckCircle, Loader2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { useTokenPrices } from '../hooks/useTokenPrices';
import { useUniswapLiquidity } from '../hooks/useUniswapLiquidity';
import { useBaseBalances } from '../hooks/useBaseBalances';
import { useSwapExecution } from '../hooks/useSwapExecution';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const Swap = () => {
  const [bloomAmount, setBloomAmount] = useState('');
  const [ethAmount, setEthAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [error, setError] = useState('');
  const [priceImpact, setPriceImpact] = useState(0);
  const [usdcEquivalent, setUsdcEquivalent] = useState('');
  const [usdtEquivalent, setUsdtEquivalent] = useState('');
  const [needsApproval, setNeedsApproval] = useState(false);

  const { isConnected } = useAccount();
  const { bloomBalance } = useTokenBalance();
  const { data: prices, isLoading: pricesLoading } = useTokenPrices();
  const { data: liquidityData } = useUniswapLiquidity();
  const { ethBalance } = useBaseBalances();
  const { toast } = useToast();

  const {
    executeSwap,
    approveToken,
    isPending,
    isConfirming,
    isSuccess,
    error: swapError,
    hash,
  } = useSwapExecution();

  const bloomPrice = prices?.bloom.price || 0.00003557;
  const ethPrice = prices?.eth.price || 2624.83;
  const usdcPrice = prices?.usdc.price || 0.999799;
  const usdtPrice = prices?.usdt.price || 1.0;

  const calculatePriceImpact = (bloomInput: string) => {
    if (!bloomInput || !liquidityData) return 0;
    
    const bloomInputNum = parseFloat(bloomInput);
    const poolLiquidityEth = liquidityData.ethLiquidity;
    
    // Simple price impact calculation: (input / pool_liquidity) * 100
    // This is a simplified model - real implementation would use AMM formulas
    const impact = (bloomInputNum * bloomPrice) / (poolLiquidityEth * ethPrice) * 100;
    return Math.min(impact, 50); // Cap at 50% for safety
  };

  const handleBloomAmountChange = (value: string) => {
    setBloomAmount(value);
    
    if (value && prices) {
      const bloomNum = parseFloat(value);
      const bloomUsdValue = bloomNum * bloomPrice;
      
      // Calculate price impact
      const impact = calculatePriceImpact(value);
      setPriceImpact(impact);
      
      // Calculate ETH amount with price impact
      const ethAmountBeforeImpact = bloomUsdValue / ethPrice;
      const ethAmountAfterImpact = ethAmountBeforeImpact * (1 - impact / 100);
      setEthAmount(ethAmountAfterImpact.toFixed(8));
      
      // Calculate USDC/USDT equivalents
      setUsdcEquivalent((bloomUsdValue / usdcPrice).toFixed(2));
      setUsdtEquivalent((bloomUsdValue / usdtPrice).toFixed(2));
    } else {
      setEthAmount('');
      setPriceImpact(0);
      setUsdcEquivalent('');
      setUsdtEquivalent('');
    }
    
    // Validate balance
    if (value && isConnected) {
      const bloomNum = parseFloat(value);
      const balance = parseFloat(bloomBalance || '0');
      
      if (bloomNum > balance) {
        setError('Insufficient BLOOM balance');
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

  const handleSwap = async () => {
    if (!bloomAmount || !ethAmount || !isConnected) return;

    try {
      if (needsApproval) {
        toast({
          title: "Approving BLOOM...",
          description: "Please confirm the approval transaction in your wallet.",
        });
        await approveToken(bloomAmount);
        setNeedsApproval(false);
        return;
      }

      toast({
        title: "Executing Swap...",
        description: "Please confirm the swap transaction in your wallet.",
      });

      await executeSwap({
        bloomAmount,
        ethAmount,
        slippage,
      });
    } catch (error) {
      console.error('Swap failed:', error);
      toast({
        title: "Swap Failed",
        description: "The swap transaction failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess && hash) {
      toast({
        title: "Swap Successful!",
        description: `Transaction completed: ${hash.slice(0, 10)}...`,
      });
      // Reset form
      setBloomAmount('');
      setEthAmount('');
      setPriceImpact(0);
      setUsdcEquivalent('');
      setUsdtEquivalent('');
    }
  }, [isSuccess, hash, toast]);

  // Handle swap errors
  useEffect(() => {
    if (swapError) {
      toast({
        title: "Transaction Error",
        description: swapError.message || "An error occurred during the swap.",
        variant: "destructive",
      });
    }
  }, [swapError, toast]);

  const formatPriceImpact = (impact: number) => {
    if (impact < 0.01) return '< 0.01%';
    if (impact > 15) return `${impact.toFixed(2)}% (Very High)`;
    if (impact > 5) return `${impact.toFixed(2)}% (High)`;
    return `${impact.toFixed(2)}%`;
  };

  const getImpactColor = (impact: number) => {
    if (impact > 15) return 'text-red-400';
    if (impact > 5) return 'text-yellow-400';
    return 'text-green-400';
  };

  useEffect(() => {
    if (bloomAmount) {
      handleBloomAmountChange(bloomAmount);
    }
  }, [prices, liquidityData]);

  // Calculate USD values for display
  const bloomUsdValue = bloomAmount ? (parseFloat(bloomAmount) * bloomPrice).toFixed(2) : '0.00';
  const ethUsdValue = ethAmount ? (parseFloat(ethAmount) * ethPrice).toFixed(2) : '0.00';

  // Determine button state and text
  const getButtonState = () => {
    if (!isConnected) return { disabled: true, text: 'Connect Wallet' };
    if (!bloomAmount) return { disabled: true, text: 'Enter BLOOM Amount' };
    if (error) return { disabled: true, text: error };
    if (priceImpact > 20) return { disabled: true, text: 'Price Impact Too High' };
    if (isPending || isConfirming) return { disabled: true, text: isPending ? 'Confirming...' : 'Processing...' };
    if (needsApproval) return { disabled: false, text: 'Approve BLOOM' };
    return { disabled: false, text: 'Swap BLOOM for ETH' };
  };

  const buttonState = getButtonState();

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
      <div className="max-w-md md:max-w-lg mx-auto space-y-4 md:space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 md:space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">
            Swap BLOOM to ETH
          </h1>
          <p className="text-gray-400 text-base md:text-lg">Trade BLOOM tokens for ETH on Base Network</p>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="glass-card p-4 md:p-6 border border-yellow-500/20 shadow-2xl shadow-yellow-500/10">
            <p className="text-center text-yellow-400 font-medium">
              Connect your wallet to see real Base network balances and enable swapping
            </p>
          </div>
        )}

        {/* Success Message */}
        {isSuccess && (
          <Alert className="border-green-500/20 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-400">
              Swap completed successfully! Check your wallet for the ETH.
            </AlertDescription>
          </Alert>
        )}

        {/* Liquidity Warning */}
        {liquidityData?.isLowLiquidity && (
          <Alert variant="destructive" className="border-yellow-500/20 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-yellow-400">
              Low liquidity detected! Large swaps may experience high slippage.
            </AlertDescription>
          </Alert>
        )}

        {/* High Price Impact Warning */}
        {priceImpact > 5 && (
          <Alert variant="destructive" className="border-red-500/20 bg-red-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-400">
              High price impact detected ({formatPriceImpact(priceImpact)})! Consider reducing your swap amount.
            </AlertDescription>
          </Alert>
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
          {/* BLOOM Input */}
          <div className="space-y-3">
            <label className="text-sm text-gray-400 font-semibold uppercase tracking-wider">From BLOOM</label>
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-4 md:p-6 space-y-4 border border-white/10 hover:border-green-500/20 transition-all duration-300">
              <div className="flex justify-between items-center gap-2">
                <input
                  type="number"
                  placeholder="0.0"
                  value={bloomAmount}
                  onChange={(e) => handleBloomAmountChange(e.target.value)}
                  className="bg-transparent text-2xl md:text-3xl font-bold text-white placeholder-gray-400 outline-none flex-1 min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-xl font-bold shadow-lg shadow-green-500/30 text-sm md:text-base">
                  BLOOM
                </div>
              </div>
              <div className="flex justify-between text-xs md:text-sm text-gray-400">
                <span className="font-medium">
                  Balance: {parseFloat(bloomBalance || '0').toFixed(0)} BLOOM
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">${bloomPrice.toFixed(8)}</span>
                </div>
              </div>
              {/* USD Value Display */}
              {bloomAmount && (
                <div className="text-center">
                  <span className="text-lg font-bold text-green-400">${bloomUsdValue}</span>
                </div>
              )}
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center">
            <div className="p-3 md:p-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/30">
              <ArrowDown className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>

          {/* ETH Output */}
          <div className="space-y-3">
            <label className="text-sm text-gray-400 font-semibold uppercase tracking-wider">To ETH</label>
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-4 md:p-6 space-y-4 border border-white/10 hover:border-green-500/20 transition-all duration-300">
              <div className="flex justify-between items-center gap-2">
                <input
                  type="number"
                  placeholder="0.0"
                  value={ethAmount}
                  readOnly
                  className="bg-transparent text-2xl md:text-3xl font-bold text-white placeholder-gray-400 outline-none flex-1 min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 text-sm md:text-base">
                  ETH
                </div>
              </div>
              <div className="flex justify-between text-xs md:text-sm text-gray-400">
                <span className="font-medium">
                  Balance: {parseFloat(ethBalance || '0').toFixed(4)} ETH
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">${ethPrice.toLocaleString()}</span>
                </div>
              </div>
              {/* USD Value Display */}
              {ethAmount && (
                <div className="text-center">
                  <span className="text-lg font-bold text-blue-400">${ethUsdValue}</span>
                </div>
              )}
            </div>
          </div>

          {/* Equivalent Values */}
          {bloomAmount && (
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-4 md:p-6 space-y-3 border border-white/10">
              <div className="flex items-center space-x-2 mb-3">
                <Info className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 font-semibold">Equivalent Values</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">USDC</div>
                  <div className="text-lg font-bold text-white">{usdcEquivalent}</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">USDT</div>
                  <div className="text-lg font-bold text-white">{usdtEquivalent}</div>
                </div>
              </div>
            </div>
          )}

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
          {bloomAmount && ethAmount && (
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-4 md:p-6 space-y-3 text-xs md:text-sm border border-white/10">
              <div className="flex justify-between text-gray-400">
                <span className="font-medium">Exchange Rate</span>
                <span className="font-bold text-white">1 BLOOM = {(parseFloat(ethAmount) / parseFloat(bloomAmount)).toFixed(8)} ETH</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span className="font-medium">Price Impact</span>
                <span className={`font-bold ${getImpactColor(priceImpact)}`}>{formatPriceImpact(priceImpact)}</span>
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
            onClick={handleSwap}
            className={`w-full py-3 md:py-4 rounded-xl text-white font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 ${
              buttonState.disabled
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30 hover:shadow-green-500/40'
            }`}
            disabled={buttonState.disabled}
          >
            {(isPending || isConfirming) && (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
            <span>{buttonState.text}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Swap;
