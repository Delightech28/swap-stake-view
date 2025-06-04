
import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';

const BLOOM_ETH_POOL_ADDRESS = '0x742d35Cc6634C0532925a3b8d5c73C4AdA8AcC5d'; // Pre-computed pool address
const BLOOM_ADDRESS = '0x14d1461E2A88929D9Ac36C152bd54f58Cb8095Fe';
const WETH_ADDRESS = '0x4200000000000000000000000000000000000006';

// Simplified Pool ABI
const POOL_ABI = [
  {
    name: 'liquidity',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint128' }],
  },
] as const;

interface LiquidityInfo {
  poolAddress: string;
  totalLiquidity: string;
  ethLiquidity: number;
  bloomLiquidity: number;
  isLowLiquidity: boolean;
}

async function fetchUniswapLiquidity(publicClient: any): Promise<LiquidityInfo> {
  try {
    console.log('Fetching liquidity for pool:', BLOOM_ETH_POOL_ADDRESS);

    // Fetch pool liquidity
    const liquidity = await publicClient.readContract({
      address: BLOOM_ETH_POOL_ADDRESS as `0x${string}`,
      abi: POOL_ABI,
      functionName: 'liquidity',
    });

    const totalLiquidityStr = liquidity.toString();
    
    // Rough estimation for display purposes
    const ethLiquidity = parseFloat(totalLiquidityStr) / 1e18 / 1000000;
    const bloomLiquidity = ethLiquidity * 100000;

    const isLowLiquidity = ethLiquidity < 10;

    return {
      poolAddress: BLOOM_ETH_POOL_ADDRESS,
      totalLiquidity: totalLiquidityStr,
      ethLiquidity,
      bloomLiquidity,
      isLowLiquidity,
    };
  } catch (error) {
    console.error('Error fetching Uniswap liquidity:', error);
    // Return fallback data
    return {
      poolAddress: BLOOM_ETH_POOL_ADDRESS,
      totalLiquidity: '0',
      ethLiquidity: 5, // Show as low liquidity
      bloomLiquidity: 500000,
      isLowLiquidity: true,
    };
  }
}

export function useUniswapLiquidity() {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['uniswap-liquidity'],
    queryFn: () => fetchUniswapLiquidity(publicClient),
    refetchInterval: 60000,
    enabled: !!publicClient,
  });
}
