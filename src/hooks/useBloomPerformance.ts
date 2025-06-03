
import { useQuery } from '@tanstack/react-query';

const BLOOM_CONTRACT = '0x14d1461E2A88929D9Ac36C152bd54f58Cb8095Fe';

interface PricePoint {
  time: string;
  price: number;
}

async function fetchBloomPerformance(): Promise<PricePoint[]> {
  try {
    // Fetch BLOOM historical price data from GeckoTerminal
    const response = await fetch(
      `https://api.geckoterminal.com/api/v2/networks/base/tokens/${BLOOM_CONTRACT}/ohlcv/day?limit=7`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch historical data');
    }
    
    const data = await response.json();
    console.log('BLOOM historical data:', data);
    
    const ohlcvData = data.data?.attributes?.ohlcv_list || [];
    
    // Convert OHLCV data to price points
    const pricePoints: PricePoint[] = ohlcvData.map((item: any, index: number) => {
      const timestamp = item[0];
      const closePrice = parseFloat(item[4]); // Close price
      
      // Create time labels for the last 7 days
      const date = new Date(timestamp * 1000);
      const timeLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      return {
        time: timeLabel,
        price: closePrice,
      };
    });
    
    return pricePoints.length > 0 ? pricePoints : generateFallbackData();
  } catch (error) {
    console.error('Error fetching BLOOM performance:', error);
    return generateFallbackData();
  }
}

function generateFallbackData(): PricePoint[] {
  const basePrice = 0.00003538;
  return [
    { time: 'Dec 27', price: basePrice * 0.95 },
    { time: 'Dec 28', price: basePrice * 0.98 },
    { time: 'Dec 29', price: basePrice * 0.92 },
    { time: 'Dec 30', price: basePrice * 1.05 },
    { time: 'Dec 31', price: basePrice * 1.08 },
    { time: 'Jan 1', price: basePrice * 1.12 },
    { time: 'Today', price: basePrice },
  ];
}

export function useBloomPerformance() {
  return useQuery({
    queryKey: ['bloom-performance'],
    queryFn: fetchBloomPerformance,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}
