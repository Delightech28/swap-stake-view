
import { useQuery } from '@tanstack/react-query';

const BLOOM_CONTRACT = '0x14d1461E2A88929D9Ac36C152bd54f58Cb8095Fe';

interface TokenPriceData {
  price: number;
  priceChange24h: number;
  volume24h: number;
}

interface AllTokenPrices {
  bloom: TokenPriceData;
  eth: TokenPriceData;
  usdc: TokenPriceData;
  usdt: TokenPriceData;
}

async function fetchAllTokenPrices(): Promise<AllTokenPrices> {
  try {
    // Fetch BLOOM price from GeckoTerminal (Base network)
    const bloomResponse = await fetch(
      `https://api.geckoterminal.com/api/v2/networks/base/tokens/${BLOOM_CONTRACT}`
    );
    
    // Fetch ETH, USDC, USDT prices from CoinGecko
    const coingeckoResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin,tether&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true'
    );
    
    const [bloomData, coingeckoData] = await Promise.all([
      bloomResponse.json(),
      coingeckoResponse.json()
    ]);
    
    console.log('BLOOM price data:', bloomData);
    console.log('CoinGecko price data:', coingeckoData);
    
    const bloomTokenData = bloomData.data?.attributes;
    
    return {
      bloom: {
        price: parseFloat(bloomTokenData?.price_usd || '0.00003538'),
        priceChange24h: parseFloat(bloomTokenData?.price_change_percentage?.h24 || '0'),
        volume24h: parseFloat(bloomTokenData?.volume_usd?.h24 || '0'),
      },
      eth: {
        price: coingeckoData.ethereum?.usd || 3500,
        priceChange24h: coingeckoData.ethereum?.usd_24h_change || 0,
        volume24h: coingeckoData.ethereum?.usd_24h_vol || 0,
      },
      usdc: {
        price: coingeckoData['usd-coin']?.usd || 1,
        priceChange24h: coingeckoData['usd-coin']?.usd_24h_change || 0,
        volume24h: coingeckoData['usd-coin']?.usd_24h_vol || 0,
      },
      usdt: {
        price: coingeckoData.tether?.usd || 1,
        priceChange24h: coingeckoData.tether?.usd_24h_change || 0,
        volume24h: coingeckoData.tether?.usd_24h_vol || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching token prices:', error);
    // Return fallback values if API fails
    return {
      bloom: { price: 0.00003538, priceChange24h: 0, volume24h: 0 },
      eth: { price: 3500, priceChange24h: 0, volume24h: 0 },
      usdc: { price: 1, priceChange24h: 0, volume24h: 0 },
      usdt: { price: 1, priceChange24h: 0, volume24h: 0 },
    };
  }
}

export function useTokenPrices() {
  return useQuery({
    queryKey: ['all-token-prices'],
    queryFn: fetchAllTokenPrices,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
