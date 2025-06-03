
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { getConfig } from '../lib/wagmi';

interface OnchainProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function OnchainProviders({ children }: OnchainProvidersProps) {
  return (
    <WagmiProvider config={getConfig()}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={import.meta.env.VITE_ONCHAINKIT_API_KEY}
          chain={base}
          config={{
            appearance: {
              name: 'CryptoSwap',
              logo: '/placeholder.svg',
              mode: 'dark',
              theme: 'default',
            },
            wallet: {
              display: 'modal',
              termsUrl: 'https://base.org/terms',
              privacyUrl: 'https://base.org/privacy',
            },
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
