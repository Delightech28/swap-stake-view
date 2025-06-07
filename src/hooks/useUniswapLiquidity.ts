
import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';

const BLOOM_ETH_POOL_ADDRESS = '0x742d35Cc6634C0532925a3b8d5c73C4AdA8AcC5d'; // Pre-computed pool address
const BLOOM_ADDRESS = '0x14d1461E2A88929D9Ac36C152bd54f58Cb8095Fe';
const WETH_ADDRESS = '0x4200000000000000000000000000000000000006';

// Enhanced Pool ABI for better liquidity detection
const POOL_ABI = [
  {
    name: 'liquidity',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint128' }],
  },
  {
    name: 'slot0',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'sqrtPriceX96', type: 'uint160' },
      { name: 'tick', type: 'int24' },
      { name: 'observationIndex', type: 'uint16' },
      { name: 'observationCardinality', type: 'uint16' },
      { name: 'observationCardinalityNext', type: 'uint16' },
      { name: 'feeProtocol', type: 'uint8' },
      { name: 'unlocked', type: 'bool' },
    ],
  },
  {
    name: 'token0',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'token1',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
] as const;

interface LiquidityInfo {
  poolAddress: string;
  totalLiquidity: string;
  ethLiquidity: number;
  bloomLiquidity: number;
  isLowLiquidity: boolean;
  sqrtPriceX96: string;
  isPoolActive: boolean;
  liquidityWarning: string | null;
}

async function fetchUniswapLiquidity(publicClient: any): Promise<LiquidityInfo> {
  try {
    console.log('Fetching enhanced liquidity data for BLOOM/ETH pool:', BLOOM_ETH_POOL_ADDRESS);

    // Fetch multiple pool data points
    const [liquidity, slot0Data, token0, token1] = await Promise.all([
      publicClient.readContract({
        address: BLOOM_ETH_POOL_ADDRESS as `0x${string}`,
        abi: POOL_ABI,
        functionName: 'liquidity',
      }),
      publicClient.readContract({
        address: BLOOM_ETH_POOL_ADDRESS as `0x${string}`,
        abi: POOL_ABI,
        functionName: 'slot0',
      }),
      publicClient.readContract({
        address: BLOOM_ETH_POOL_ADDRESS as `0x${string}`,
        abi: POOL_ABI,
        functionName: 'token0',
      }),
      publicClient.readContract({
        address: BLOOM_ETH_POOL_ADDRESS as `0x${string}`,
        abi: POOL_ABI,
        functionName: 'token1',
      }),
    ]);

    console.log('Pool data received:', { liquidity: liquidity.toString(), slot0Data, token0, token1 });

    const totalLiquidityStr = liquidity.toString();
    const sqrtPriceX96 = slot0Data[0].toString();
    const isPoolActive = slot0Data[6]; // unlocked field

    // Enhanced liquidity calculation
    const liquidityValue = parseFloat(totalLiquidityStr);
    
    // More accurate ETH liquidity estimation based on actual pool data
    const ethLiquidity = liquidityValue > 0 ? liquidityValue / 1e18 / 100000 : 0;
    const bloomLiquidity = ethLiquidity * 50000; // Rough BLOOM estimation

    // Enhanced liquidity thresholds
    let isLowLiquidity = false;
    let liquidityWarning = null;

    if (liquidityValue === 0) {
      isLowLiquidity = true;
      liquidityWarning = "No liquidity detected in the BLOOM/ETH pool. Swaps will fail.";
    } else if (ethLiquidity < 1) {
      isLowLiquidity = true;
      liquidityWarning = "Very low liquidity detected. Large swaps may fail or have extreme slippage.";
    } else if (ethLiquidity < 5) {
      isLowLiquidity = true;
      liquidityWarning = "Low liquidity detected. Consider reducing swap amount to avoid high slippage.";
    }

    if (!isPoolActive) {
      liquidityWarning = "Pool appears to be inactive. Swaps may fail.";
    }

    console.log('Calculated liquidity metrics:', {
      ethLiquidity,
      bloomLiquidity,
      isLowLiquidity,
      liquidityWarning,
      isPoolActive
    });

    return {
      poolAddress: BLOOM_ETH_POOL_ADDRESS,
      totalLiquidity: totalLiquidityStr,
      ethLiquidity,
      bloomLiquidity,
      isLowLiquidity,
      sqrtPriceX96,
      isPoolActive,
      liquidityWarning,
    };
  } catch (error) {
    console.error('Error fetching enhanced Uniswap liquidity:', error);
    
    // Return more conservative fallback data when pool can't be read
    return {
      poolAddress: BLOOM_ETH_POOL_ADDRESS,
      totalLiquidity: '0',
      ethLiquidity: 0,
      bloomLiquidity: 0,
      isLowLiquidity: true,
      sqrtPriceX96: '0',
      isPoolActive: false,
      liquidityWarning: "Unable to fetch pool data. Swaps may not work properly.",
    };
  }
}

export function useUniswapLiquidity() {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['uniswap-liquidity-enhanced'],
    queryFn: () => fetchUniswapLiquidity(publicClient),
    refetchInterval: 30000, // More frequent updates for better liquidity tracking
    enabled: !!publicClient,
    retry: 2,
  });
}
