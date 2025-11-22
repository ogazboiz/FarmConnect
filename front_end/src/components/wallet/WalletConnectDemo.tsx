"use client";

import React, { useState } from 'react';
import { useWalletOperations, useWalletQR } from '@/hooks/useWalletConnect';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WalletStatus } from '@/components/wallet/WalletStatus';
import { 
  Wallet, 
  Smartphone, 
  QrCode, 
  Copy, 
  Check,
  ExternalLink 
} from 'lucide-react';

export function WalletConnectDemo() {
  const { 
    isConnected, 
    address, 
    chainId, 
    connectWalletConnect, 
    connectAppKit,
    isConnecting,
    error,
    clearError 
  } = useWalletOperations();
  
  const { 
    qrCodeUri, 
    isGenerating, 
    generateQRCode, 
    clearQRCode 
  } = useWalletQR();
  
  const [walletConnectUri, setWalletConnectUri] = useState('');
  const [copied, setCopied] = useState(false);

  const handleWalletConnectConnect = async () => {
    if (!walletConnectUri) return;
    
    try {
      await connectWalletConnect(walletConnectUri);
      setWalletConnectUri('');
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  };

  const handleGenerateQR = async () => {
    try {
      await generateQRCode();
    } catch (err) {
      console.error('Failed to generate QR:', err);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          WalletConnect Integration Demo
        </h1>
        <p className="text-slate-600">
          Experience the power of WalletConnect with AgriDAO
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallet Status */}
        <WalletStatus />

        {/* Connection Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Connection Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* AppKit Connection */}
            <div className="space-y-2">
              <Label>AppKit Connection</Label>
              <Button
                onClick={connectAppKit}
                disabled={isConnecting}
                className="w-full"
                variant="default"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect with AppKit'}
              </Button>
            </div>

            {/* WalletConnect Connection */}
            <div className="space-y-2">
              <Label htmlFor="walletconnect-uri">WalletConnect URI</Label>
              <div className="flex gap-2">
                <Input
                  id="walletconnect-uri"
                  value={walletConnectUri}
                  onChange={(e) => setWalletConnectUri(e.target.value)}
                  placeholder="wc:..."
                  className="flex-1"
                />
                <Button
                  onClick={handleWalletConnectConnect}
                  disabled={isConnecting || !walletConnectUri}
                  variant="outline"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* QR Code Generation */}
            <div className="space-y-2">
              <Label>Generate QR Code</Label>
              <Button
                onClick={handleGenerateQR}
                disabled={isGenerating}
                className="w-full"
                variant="outline"
              >
                <QrCode className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate QR Code'}
              </Button>
            </div>

            {/* QR Code Display */}
            {qrCodeUri && (
              <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Generated URI</Label>
                  <Button
                    onClick={() => copyToClipboard(qrCodeUri)}
                    variant="ghost"
                    size="sm"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="p-3 bg-white rounded border font-mono text-xs break-all">
                  {qrCodeUri}
                </div>
                <p className="text-xs text-slate-600 text-center">
                  Scan this QR code with your mobile wallet to connect
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
                <Button
                  onClick={clearError}
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Dismiss
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Connection Info */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Connection Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <h3 className="font-medium text-emerald-800 mb-2">Wallet Address</h3>
                <p className="text-sm text-emerald-600 font-mono break-all">
                  {address || 'N/A'}
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Chain ID</h3>
                <p className="text-sm text-blue-600 font-mono">
                  {chainId || 'N/A'}
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">Status</h3>
                <p className="text-sm text-purple-600">
                  Connected
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>WalletConnect Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Multi-Chain Support</h3>
              <p className="text-sm text-slate-600">
                Support for Core, Mantle, and other EVM-compatible chains
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Session Management</h3>
              <p className="text-sm text-slate-600">
                Automatic session handling with expiry and cleanup
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Request Handling</h3>
              <p className="text-sm text-slate-600">
                Smart request approval for seamless user experience
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">QR Code Generation</h3>
              <p className="text-sm text-slate-600">
                Easy mobile wallet connection via QR codes
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Error Handling</h3>
              <p className="text-sm text-slate-600">
                Comprehensive error handling and user feedback
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">TypeScript Support</h3>
              <p className="text-sm text-slate-600">
                Full TypeScript support for better development experience
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

