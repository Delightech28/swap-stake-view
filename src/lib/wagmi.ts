
import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

export function getConfig() {
  return createConfig({
    chains: [base, baseSepolia],
    connectors: [
      coinbaseWallet({
        appName: 'BaseBloomer',
        preference: 'smartWalletOnly',
      }),
      metaMask(),
      walletConnect({
        projectId: import.meta.env.VITE_WC_PROJECT_ID || 'demo-project-id',
      }),
    ],
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http(),
    },
  });
}
