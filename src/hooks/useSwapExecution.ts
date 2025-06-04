
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { base } from 'viem/chains';

const SWAP_ROUTER_ADDRESS = '0x2626664c2603336E57B271c5C0b26F421741e481'; // Uniswap V3 SwapRouter on Base
const BLOOM_ADDRESS = '0x14d1461E2A88929D9Ac36C152bd54f58Cb8095Fe';
const WETH_ADDRESS = '0x4200000000000000000000000000000000000006';

// ERC20 ABI for approve
const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

// Simplified SwapRouter ABI
const SWAP_ROUTER_ABI = [
  {
    name: 'exactInputSingle',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'tokenIn', type: 'address' },
          { name: 'tokenOut', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'recipient', type: 'address' },
          { name: 'deadline', type: 'uint256' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOutMinimum', type: 'uint256' },
          { name: 'sqrtPriceLimitX96', type: 'uint160' },
        ],
      },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
  },
] as const;

interface SwapParams {
  bloomAmount: string;
  ethAmount: string;
  slippage: string;
}

export function useSwapExecution() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const executeSwap = async ({ bloomAmount, ethAmount, slippage }: SwapParams) => {
    if (!address || !bloomAmount || !ethAmount) return;

    try {
      const amountIn = parseUnits(bloomAmount, 18);
      const amountOutMinimum = parseEther(ethAmount);
      
      // Calculate minimum amount out with slippage
      const slippagePercent = parseFloat(slippage);
      const minimumOut = (amountOutMinimum * BigInt(Math.floor((100 - slippagePercent) * 100))) / BigInt(10000);
      
      // Set deadline to 20 minutes from now
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200);

      const swapParams = {
        tokenIn: BLOOM_ADDRESS as `0x${string}`,
        tokenOut: WETH_ADDRESS as `0x${string}`,
        fee: 3000, // 0.3%
        recipient: address,
        deadline,
        amountIn,
        amountOutMinimum: minimumOut,
        sqrtPriceLimitX96: BigInt(0),
      };

      console.log('Executing swap with params:', swapParams);

      await writeContract({
        address: SWAP_ROUTER_ADDRESS as `0x${string}`,
        abi: SWAP_ROUTER_ABI,
        functionName: 'exactInputSingle',
        args: [swapParams],
        chain: base,
        account: address,
      });
    } catch (error) {
      console.error('Swap execution error:', error);
      throw error;
    }
  };

  const approveToken = async (amount: string) => {
    if (!address) return;

    try {
      const amountToApprove = parseUnits(amount, 18);
      
      await writeContract({
        address: BLOOM_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [SWAP_ROUTER_ADDRESS as `0x${string}`, amountToApprove],
        chain: base,
        account: address,
      });
    } catch (error) {
      console.error('Approval error:', error);
      throw error;
    }
  };

  return {
    executeSwap,
    approveToken,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
