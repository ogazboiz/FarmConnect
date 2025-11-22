"use client";

import { useCallback, useEffect, useState } from 'react';
import { useWalletConnect } from './walletconnect-provider';
import { useAppKit } from '@reown/appkit/react';
import { SessionTypes } from '@walletconnect/types';

// Enhanced wallet operations hook
export function useWalletOperations() {
  const { 
    core, 
    isInitialized, 
    sessions, 
    activeSession,
    connect,
    disconnect,
    error,
    clearError 
  } = useWalletConnect();
  
  const { address, chainId, isConnected, open } = useAppKit();
  
  const [isConnecting, setIsConnecting] = useState(false);

  // Connect wallet via WalletConnect
  const connectWalletConnect = useCallback(async (uri: string) => {
    setIsConnecting(true);
    try {
      await connect(uri);
    } catch (err) {
      console.error('Failed to connect via WalletConnect:', err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [connect]);

  // Connect via AppKit (fallback)
  const connectAppKit = useCallback(async () => {
    setIsConnecting(true);
    try {
      await open();
    } catch (err) {
      console.error('Failed to connect via AppKit:', err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [open]);

  // Disconnect all sessions
  const disconnectAll = useCallback(async () => {
    try {
      for (const session of sessions) {
        await disconnect(session.topic);
      }
    } catch (err) {
      console.error('Failed to disconnect sessions:', err);
      throw err;
    }
  }, [disconnect, sessions]);

  // Get session by topic
  const getSession = useCallback((topic: string) => {
    return sessions.find(session => session.topic === topic);
  }, [sessions]);

  // Check if session is active
  const isSessionActive = useCallback((topic: string) => {
    return activeSession?.topic === topic;
  }, [activeSession]);

  return {
    // Connection state
    isInitialized,
    isConnected,
    isConnecting,
    address,
    chainId,
    
    // Sessions
    sessions,
    activeSession,
    getSession,
    isSessionActive,
    
    // Connection methods
    connectWalletConnect,
    connectAppKit,
    disconnectAll,
    
    // Error handling
    error,
    clearError,
  };
}

// Wallet session management hook
export function useWalletSession() {
  const { 
    core, 
    sessions, 
    activeSession,
    disconnect,
    error 
  } = useWalletConnect();
  
  const { address, chainId } = useAppKit();
  
  const [sessionHistory, setSessionHistory] = useState<SessionTypes.Struct[]>([]);

  // Get session metadata
  const getSessionMetadata = useCallback((session: SessionTypes.Struct) => {
    return {
      topic: session.topic,
      peerMetadata: session.peer.metadata,
      namespaces: session.namespaces,
      expiry: session.expiry,
      acknowledged: session.acknowledged,
    };
  }, []);

  // Get all session metadata
  const getAllSessionMetadata = useCallback(() => {
    return sessions.map(getSessionMetadata);
  }, [sessions, getSessionMetadata]);

  // Check session expiry
  const isSessionExpired = useCallback((session: SessionTypes.Struct) => {
    return Date.now() / 1000 > session.expiry;
  }, []);

  // Get expired sessions
  const getExpiredSessions = useCallback(() => {
    return sessions.filter(isSessionExpired);
  }, [sessions, isSessionExpired]);

  // Clean up expired sessions
  const cleanupExpiredSessions = useCallback(async () => {
    const expiredSessions = getExpiredSessions();
    for (const session of expiredSessions) {
      try {
        await disconnect(session.topic);
      } catch (err) {
        console.error('Failed to cleanup expired session:', err);
      }
    }
  }, [getExpiredSessions, disconnect]);

  // Update session history
  useEffect(() => {
    setSessionHistory(prev => {
      const newHistory = [...prev];
      sessions.forEach(session => {
        if (!newHistory.find(s => s.topic === session.topic)) {
          newHistory.push(session);
        }
      });
      return newHistory;
    });
  }, [sessions]);

  return {
    // Session data
    sessions,
    activeSession,
    sessionHistory,
    
    // Session utilities
    getSessionMetadata,
    getAllSessionMetadata,
    isSessionExpired,
    getExpiredSessions,
    cleanupExpiredSessions,
    
    // Current wallet state
    address,
    chainId,
    
    // Error handling
    error,
  };
}

// Wallet request handling hook
export function useWalletRequests() {
  const { 
    core, 
    sessions
  } = useWalletConnect();
  
  const [requests, setRequests] = useState<SessionTypes.RequestEvent[]>([]);
  const [requestHistory, setRequestHistory] = useState<Array<{
    request: SessionTypes.RequestEvent;
    response: 'approved' | 'rejected';
    timestamp: number;
  }>>([]);

  // Handle incoming requests
  const handleRequest = useCallback(async (request: SessionTypes.RequestEvent, approve: boolean) => {
    try {
      // Update request history
      setRequestHistory(prev => [...prev, {
        request,
        response: approve ? 'approved' : 'rejected',
        timestamp: Date.now(),
      }]);
      
      // Remove from pending requests
      setRequests(prev => prev.filter(req => req.id !== request.id));
    } catch (err) {
      console.error('Failed to handle request:', err);
      throw err;
    }
  }, []);

  // Get request details
  const getRequestDetails = useCallback((request: SessionTypes.RequestEvent) => {
    const { topic, params } = request;
    const { request: requestParams } = params;
    
    return {
      id: requestParams.id,
      method: requestParams.method,
      params: requestParams.params,
      session: sessions.find(s => s.topic === topic),
      timestamp: Date.now(),
    };
  }, [sessions]);

  // Get requests by method
  const getRequestsByMethod = useCallback((method: string) => {
    return requests.filter(req => {
      const { params } = req;
      const { request: requestParams } = params;
      return requestParams.method === method;
    });
  }, [requests]);

  // Get requests by session
  const getRequestsBySession = useCallback((topic: string) => {
    return requests.filter(req => req.topic === topic);
  }, [requests]);

  // Clear request history
  const clearRequestHistory = useCallback(() => {
    setRequestHistory([]);
  }, []);

  // Clear pending requests
  const clearPendingRequests = useCallback(() => {
    setRequests([]);
  }, []);

  return {
    // Request data
    requests,
    requestHistory,
    
    // Request handling
    handleRequest,
    getRequestDetails,
    getRequestsByMethod,
    getRequestsBySession,
    
    // Utilities
    clearRequestHistory,
    clearPendingRequests,
  };
}

// Wallet QR code generation hook
export function useWalletQR() {
  const { core, isInitialized } = useWalletConnect();
  const [qrCodeUri, setQrCodeUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate QR code for connection
  const generateQRCode = useCallback(async () => {
    if (!core || !isInitialized) {
      throw new Error('WalletConnect not initialized');
    }

    setIsGenerating(true);
    try {
      const { uri } = await core.pairing.create();
      setQrCodeUri(uri);
      return uri;
    } catch (err) {
      console.error('Failed to generate QR code:', err);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [core, isInitialized]);

  // Clear QR code
  const clearQRCode = useCallback(() => {
    setQrCodeUri(null);
  }, []);

  return {
    qrCodeUri,
    isGenerating,
    generateQRCode,
    clearQRCode,
  };
}
