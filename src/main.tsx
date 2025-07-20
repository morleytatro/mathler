import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { Toaster } from 'sonner';
import './index.css';
import { App } from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DynamicContextProvider
      settings={{
        environmentId: '63ccbab9-90a9-4ada-adfb-a3d7f1507205',
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <App />
    </DynamicContextProvider>
    <Toaster />
  </StrictMode>
);
