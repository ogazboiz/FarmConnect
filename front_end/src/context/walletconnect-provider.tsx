"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Core } from '@walletconnect/core';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { SessionTypes } from '@walletconnect/types';
import { useAppKit } from '@reown/appkit/react';

// Types
interface WalletConnectContextType {
  // Core WalletConnect functionality
  core: Core | null;
  isInitialized: boolean;
  
  // Session management
  sessions: SessionTypes.Struct[];
  activeSession: SessionTypes.Struct | null;
  
  // Connection methods
  connect: (uri: string) => Promise<void>;
  disconnect: (topic: string) => Promise<void>;
  
  // Utility methods
  getActiveChainId: () => number | null;
  switchChain: (chainId: number) => Promise<void>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

const WalletConnectContext = createContext<WalletConnectContextType | null>(null);

// WalletConnect Provider Component
interface WalletConnectProviderProps {
  children: ReactNode;
}

export function WalletConnectProvider({ children }: WalletConnectProviderProps) {
  const { address, chainId, isConnected } = useAppKit();
  
  // State management
  const [core, setCore] = useState<Core | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessions, setSessions] = useState<SessionTypes.Struct[]>([]);
  const [activeSession, setActiveSession] = useState<SessionTypes.Struct | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize WalletConnect Core
  useEffect(() => {
    const initializeWalletConnect = async () => {
      try {
        // Initialize Core
        const coreClient = new Core({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "8387f0bbb57a265cd4dd96c3e658ac55",
          relayUrl: "wss://relay.walletconnect.com",
        });

        setCore(coreClient);
        setIsInitialized(true);

        // Set up event listeners
        setupEventListeners(coreClient);

      } catch (err) {
        console.error('Failed to initialize WalletConnect:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize WalletConnect');
      }
    };

    initializeWalletConnect();
  }, []);

  // Set up event listeners for WalletConnect
  const setupEventListeners = (core: Core) => {
    // Session proposal events
    core.pairing.on('pairing_proposal', async (proposal) => {
      console.log('Pairing proposal received:', proposal);
    });

    // Session events
    core.session.on('session_proposal', async (proposal) => {
      console.log('Session proposal received:', proposal);
    });

    // Session request events
    core.session.on('session_request', async (request) => {
      console.log('Session request received:', request);
    });

    // Session delete events
    core.session.on('session_delete', (session) => {
      console.log('Session deleted:', session);
      setSessions(prev => prev.filter(s => s.topic !== session.topic));
      if (activeSession?.topic === session.topic) {
        setActiveSession(null);
      }
    });

    // Session update events
    core.session.on('session_update', (session) => {
      console.log('Session updated:', session);
      setSessions(prev => prev.map(s => s.topic === session.topic ? session : s));
      if (activeSession?.topic === session.topic) {
        setActiveSession(session);
      }
    });
  };

  // Connect to WalletConnect URI
  const connect = async (uri: string) => {
    if (!core) {
      throw new Error('WalletConnect not initialized');
    }

    try {
      await core.pairing.pair({ uri });
    } catch (err) {
      console.error('Failed to connect:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect');
      throw err;
    }
  };

  // Disconnect session
  const disconnect = async (topic: string) => {
    if (!core) {
      throw new Error('WalletConnect not initialized');
    }

    try {
      await core.session.disconnect({ topic, reason: getSdkError('USER_DISCONNECTED') });
      setSessions(prev => prev.filter(s => s.topic !== topic));
      if (activeSession?.topic === topic) {
        setActiveSession(null);
      }
    } catch (err) {
      console.error('Failed to disconnect:', err);
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
      throw err;
    }
  };

  // Get active chain ID
  const getActiveChainId = () => {
    return chainId || null;
  };

  // Switch chain
  const switchChain = async (newChainId: number) => {
    // This would typically trigger a wallet chain switch
    // The actual implementation depends on your wallet integration
    console.log(`Switching to chain ${newChainId}`);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value: WalletConnectContextType = {
    core,
    isInitialized,
    sessions,
    activeSession,
    connect,
    disconnect,
    getActiveChainId,
    switchChain,
    error,
    clearError,
  };

  return (
    <WalletConnectContext.Provider value={value}>
      {children}
    </WalletConnectContext.Provider>
  );
}

// Custom hook to use WalletConnect context
export function useWalletConnect() {
  const context = useContext(WalletConnectContext);
  if (!context) {
    throw new Error('useWalletConnect must be used within a WalletConnectProvider');
  }
  return context;
}
