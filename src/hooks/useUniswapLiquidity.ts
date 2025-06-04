
import { useQuery } from '@tanstack/react-query';
import { computePoolAddress, FeeAmount } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';
import { base } from 'viem/chains';
import { usePublicClient } from 'wagmi';

const FACTORY_ADDRESS = '0x33128a8fC17869897dcE68Ed026d694621f6FDf9';
const BLOOM_ADDRESS = '0x14d1461E2A88929D9Ac36C152bd54f58Cb8095Fe';
const WETH_ADDRESS = '0x4200000000000000000000000000000000000006'; // WETH on Base

// Pool ABI for liquidity0 and liquidity1
const POOL_ABI = [
  {
    name: 'liquidity',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint128' }],
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
      { name: 'unlocked', type: 'bool' }
    ],
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
    // Create token instances
    const WETH = new Token(base.id, WETH_ADDRESS, 18, 'WETH', 'Wrapped Ether');
    const BLOOM = new Token(base.id, BLOOM_ADDRESS, 18, 'BLOOM', 'Base Bloomer');

    // Compute pool address
    const poolAddress = computePoolAddress({
      factoryAddress: FACTORY_ADDRESS,
      tokenA: WETH,
      tokenB: BLOOM,
      fee: FeeAmount.MEDIUM, // 0.3% = 3000
    });

    console.log('Pool address:', poolAddress);

    // Fetch pool data
    const [liquidity, slot0Data] = await Promise.all([
      publicClient.readContract({
        address: poolAddress as `0x${string}`,
        abi: POOL_ABI,
        functionName: 'liquidity',
      }),
      publicClient.readContract({
        address: poolAddress as `0x${string}`,
        abi: POOL_ABI,
        functionName: 'slot0',
      }),
    ]);

    const totalLiquidityStr = liquidity.toString();
    
    // Simple approximation - in reality you'd need to calculate based on price ranges
    // For demonstration, we'll estimate based on total liquidity
    const ethLiquidity = parseFloat(totalLiquidityStr) / 1e18 / 1000000; // Rough estimation
    const bloomLiquidity = ethLiquidity * 100000; // Rough estimation based on price difference

    const isLowLiquidity = ethLiquidity < 10; // Less than 10 ETH equivalent

    return {
      poolAddress,
      totalLiquidity: totalLiquidityStr,
      ethLiquidity,
      bloomLiquidity,
      isLowLiquidity,
    };
  } catch (error) {
    console.error('Error fetching Uniswap liquidity:', error);
    // Return fallback data
    return {
      poolAddress: '0x0000000000000000000000000000000000000000',
      totalLiquidity: '0',
      ethLiquidity: 0,
      bloomLiquidity: 0,
      isLowLiquidity: true,
    };
  }
}

export function useUniswapLiquidity() {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['uniswap-liquidity'],
    queryFn: () => fetchUniswapLiquidity(publicClient),
    refetchInterval: 60000, // Refetch every minute
    enabled: !!publicClient,
  });
}
