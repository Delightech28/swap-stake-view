
import { useQuery } from '@tanstack/react-query';

const BLOOM_CONTRACT = '0x14d1461E2A88929D9Ac36C152bd54f58Cb8095Fe';

interface TokenPriceData {
  price: number;
  priceChange24h: number;
  volume24h: number;
}

async function fetchBloomPrice(): Promise<TokenPriceData> {
  try {
    // Using GeckoTerminal API for Base network
    const response = await fetch(
      `https://api.geckoterminal.com/api/v2/networks/base/tokens/${BLOOM_CONTRACT}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch price');
    }
    
    const data = await response.json();
    const tokenData = data.data.attributes;
    
    console.log('Real BLOOM price data:', tokenData);
    
    return {
      price: parseFloat(tokenData.price_usd || '0'),
      priceChange24h: parseFloat(tokenData.price_change_percentage?.h24 || '0'),
      volume24h: parseFloat(tokenData.volume_usd?.h24 || '0'),
    };
  } catch (error) {
    console.error('Error fetching BLOOM price:', error);
    // Return zero values if API fails
    return {
      price: 0,
      priceChange24h: 0,
      volume24h: 0,
    };
  }
}

export function useTokenPrice() {
  return useQuery({
    queryKey: ['bloom-price'],
    queryFn: fetchBloomPrice,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
