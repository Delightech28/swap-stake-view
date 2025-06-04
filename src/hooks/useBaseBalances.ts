
import { useBalance } from 'wagmi';
import { useAccount } from 'wagmi';
import { base } from 'viem/chains';

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDT_ADDRESS = '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2';

export function useBaseBalances() {
  const { address } = useAccount();

  const { data: ethBalance } = useBalance({
    address,
    chainId: base.id,
  });

  const { data: usdcBalance } = useBalance({
    address,
    token: USDC_ADDRESS as `0x${string}`,
    chainId: base.id,
  });

  const { data: usdtBalance } = useBalance({
    address,
    token: USDT_ADDRESS as `0x${string}`,
    chainId: base.id,
  });

  return {
    ethBalance: ethBalance?.formatted || '0',
    usdcBalance: usdcBalance?.formatted || '0',
    usdtBalance: usdtBalance?.formatted || '0',
  };
}
