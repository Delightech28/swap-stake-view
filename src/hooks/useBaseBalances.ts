
import { useAccount, useBalance, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { base } from 'viem/chains';

const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;
const USDT_BASE = '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2' as const;

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

export function useBaseBalances() {
  const { address, isConnected } = useAccount();

  // ETH balance on Base
  const { data: ethBalance } = useBalance({
    address: address,
    chainId: base.id,
  });

  // USDC and USDT balances on Base
  const { data: tokenBalances } = useReadContracts({
    contracts: address ? [
      {
        address: USDC_BASE,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
        chainId: base.id,
      },
      {
        address: USDC_BASE,
        abi: ERC20_ABI,
        functionName: 'decimals',
        chainId: base.id,
      },
      {
        address: USDT_BASE,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
        chainId: base.id,
      },
      {
        address: USDT_BASE,
        abi: ERC20_ABI,
        functionName: 'decimals',
        chainId: base.id,
      },
    ] : [],
    query: { enabled: !!address },
  });

  const usdcBalance = tokenBalances?.[0]?.result && tokenBalances?.[1]?.result
    ? formatUnits(tokenBalances[0].result, tokenBalances[1].result)
    : '0';

  const usdtBalance = tokenBalances?.[2]?.result && tokenBalances?.[3]?.result
    ? formatUnits(tokenBalances[2].result, tokenBalances[3].result)
    : '0';

  const ethBalanceFormatted = ethBalance 
    ? formatUnits(ethBalance.value, ethBalance.decimals)
    : '0';

  return {
    ethBalance: ethBalanceFormatted,
    usdcBalance,
    usdtBalance,
    isConnected,
  };
}
