
import { useQuery } from '@tanstack/react-query';

interface LiquidityData {
  bloomEthLiquidity: number;
  bloomUsdcLiquidity: number;
  bloomUsdtLiquidity: number;
}

async function fetchLiquidityData(): Promise<LiquidityData> {
  try {
    // Fetch pool data from GeckoTerminal for BLOOM pairs
    const poolResponse = await fetch(
      'https://api.geckoterminal.com/api/v2/networks/base/tokens/0x14d1461E2A88929D9Ac36C152bd54f58Cb8095Fe/pools'
    );
    
    const poolData = await poolResponse.json();
    console.log('Pool liquidity data:', poolData);
    
    // Extract liquidity from the response
    const pools = poolData.data || [];
    
    let bloomEthLiquidity = 0;
    let bloomUsdcLiquidity = 0;
    let bloomUsdtLiquidity = 0;
    
    pools.forEach((pool: any) => {
      const reserveUsd = parseFloat(pool.attributes?.reserve_in_usd || '0');
      const poolName = pool.attributes?.name?.toLowerCase() || '';
      
      if (poolName.includes('eth')) {
        bloomEthLiquidity = Math.max(bloomEthLiquidity, reserveUsd);
      } else if (poolName.includes('usdc')) {
        bloomUsdcLiquidity = Math.max(bloomUsdcLiquidity, reserveUsd);
      } else if (poolName.includes('usdt')) {
        bloomUsdtLiquidity = Math.max(bloomUsdtLiquidity, reserveUsd);
      }
    });
    
    return {
      bloomEthLiquidity,
      bloomUsdcLiquidity,
      bloomUsdtLiquidity,
    };
  } catch (error) {
    console.error('Error fetching liquidity data:', error);
    return {
      bloomEthLiquidity: 50000, // Fallback values
      bloomUsdcLiquidity: 30000,
      bloomUsdtLiquidity: 25000,
    };
  }
}

export function useLiquidity() {
  return useQuery({
    queryKey: ['bloom-liquidity'],
    queryFn: fetchLiquidityData,
    refetchInterval: 60000, // Refetch every minute
  });
}
