
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';

const BLOOM_CONTRACT = '0x14d1461E2A88929D9Ac36C152bd54f58Cb8095Fe' as const;

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'decimals', type: 'uint8' }],
  },
] as const;

export function useTokenBalance() {
  const { address } = useAccount();

  const { data: bloomBalance } = useReadContract({
    address: BLOOM_CONTRACT,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: decimals } = useReadContract({
    address: BLOOM_CONTRACT,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  const formattedBalance = bloomBalance && decimals 
    ? formatUnits(bloomBalance, decimals)
    : '0';

  return {
    bloomBalance: formattedBalance,
    isConnected: !!address,
  };
}
