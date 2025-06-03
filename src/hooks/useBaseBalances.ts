
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

  // USDC contracts
  const usdcContracts = address ? [
    {
      address: USDC_BASE,
      abi: ERC20_ABI,
      functionName: 'balanceOf' as const,
      args: [address],
      chainId: base.id,
    },
    {
      address: USDC_BASE,
      abi: ERC20_ABI,
      functionName: 'decimals' as const,
      chainId: base.id,
    },
  ] : [];

  const { data: usdcData } = useReadContracts({
    contracts: usdcContracts,
    query: { enabled: !!address },
  });

  // USDT contracts
  const usdtContracts = address ? [
    {
      address: USDT_BASE,
      abi: ERC20_ABI,
      functionName: 'balanceOf' as const,
      args: [address],
      chainId: base.id,
    },
    {
      address: USDT_BASE,
      abi: ERC20_ABI,
      functionName: 'decimals' as const,
      chainId: base.id,
    },
  ] : [];

  const { data: usdtData } = useReadContracts({
    contracts: usdtContracts,
    query: { enabled: !!address },
  });

  const usdcBalance = usdcData?.[0]?.result && usdcData?.[1]?.result
    ? formatUnits(usdcData[0].result as bigint, usdcData[1].result as number)
    : '0';

  const usdtBalance = usdtData?.[0]?.result && usdtData?.[1]?.result
    ? formatUnits(usdtData[0].result as bigint, usdtData[1].result as number)
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
