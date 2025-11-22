"use client";

import React, { useState } from 'react';
import { useWalletOperations, useWalletSession, useWalletRequests } from '@/hooks/useWalletConnect';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Smartphone, 
  Monitor, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Settings,
  Activity,
  Users,
  Zap
} from 'lucide-react';

interface WalletStatusProps {
  className?: string;
}

export function WalletStatus({ className }: WalletStatusProps) {
  const { 
    isConnected, 
    address, 
    chainId, 
    sessions, 
    activeSession,
    isConnecting,
    error 
  } = useWalletOperations();
  
  const { 
    getAllSessionMetadata, 
    isSessionExpired, 
    getExpiredSessions 
  } = useWalletSession();
  
  const { 
    requests, 
    requestHistory 
  } = useWalletRequests();
  
  const [showDetails, setShowDetails] = useState(false);

  const sessionMetadata = getAllSessionMetadata();
  const expiredSessions = getExpiredSessions();
  const activeSessions = sessions.filter(session => !isSessionExpired(session));

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 1114: return 'Core Testnet2';
      case 1116: return 'Core Mainnet';
      case 5000: return 'Mantle Mainnet';
      case 5003: return 'Mantle Sepolia';
      default: return `Chain ${chainId}`;
    }
  };

  const getConnectionMethod = () => {
    if (activeSession) {
      return 'WalletConnect';
    }
    return 'AppKit';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Status
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-3">
            {isConnected ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <div>
              <p className="font-medium text-slate-800">
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
              <p className="text-sm text-slate-600">
                via {getConnectionMethod()}
              </p>
            </div>
          </div>
          {isConnecting && (
            <Badge variant="secondary" className="animate-pulse">
              <Clock className="w-3 h-3 mr-1" />
              Connecting
            </Badge>
          )}
        </div>

        {/* Wallet Info */}
        {isConnected && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-800">Address</p>
                  <p className="text-sm text-emerald-600 font-mono">
                    {address ? formatAddress(address) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Network</p>
                  <p className="text-sm text-blue-600">
                    {chainId ? getChainName(chainId) : 'N/A'}
                  </p>
                </div>
              </div>
              {chainId && (
                <Badge variant="outline" className="text-xs">
                  {chainId}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* WalletConnect Sessions */}
        {showDetails && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-600" />
              <h3 className="font-medium text-slate-800">WalletConnect Sessions</h3>
              <Badge variant="secondary" className="text-xs">
                {activeSessions.length}
              </Badge>
            </div>

            {activeSessions.length > 0 ? (
              <div className="space-y-2">
                {activeSessions.map((session) => (
                  <div key={session.topic} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">
                          {session.peer.metadata?.name || 'Unknown App'}
                        </p>
                        <p className="text-xs text-slate-600">
                          {session.peer.metadata?.url || 'No URL'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-sm text-slate-600">No active WalletConnect sessions</p>
              </div>
            )}

            {/* Expired Sessions */}
            {expiredSessions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-slate-700 text-sm">Expired Sessions</h4>
                {expiredSessions.map((session) => (
                  <div key={session.topic} className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-800 text-sm">
                          {session.peer.metadata?.name || 'Unknown App'}
                        </p>
                        <p className="text-xs text-red-600">
                          Expired
                        </p>
                      </div>
                      <XCircle className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Request Statistics */}
        {showDetails && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-slate-600" />
              <h3 className="font-medium text-slate-800">Request Statistics</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-yellow-50 rounded-lg text-center">
                <p className="text-lg font-bold text-yellow-800">
                  {requests.length}
                </p>
                <p className="text-xs text-yellow-600">Pending</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-lg font-bold text-green-800">
                  {requestHistory.length}
                </p>
                <p className="text-xs text-green-600">Total</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {isConnected && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

