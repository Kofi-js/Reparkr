"use client";

import { useState, useRef, useEffect } from "react";
import { Connector, useAccount, useConnect } from "@starknet-react/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wallet, ExternalLink, Shield } from "lucide-react";
import toast from "react-hot-toast";

interface ConnectWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectWalletModal({
  open,
  onOpenChange,
}: ConnectWalletModalProps) {
  const { connectors, isPending, connect, isSuccess } = useConnect();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const wallets = [
    {
      id: "argentX",
      name: "ArgentX",
      description: "The most popular Starknet wallet",
      icon: "🔷",
      features: ["Smart Contract Wallet", "Mobile App", "Hardware Support"],
      recommended: true,
    },
    {
      id: "braavos",
      name: "Braavos",
      description: "Advanced security features",
      icon: "🛡️",
      features: ["Multi-sig Support", "Advanced Security", "DeFi Optimized"],
      recommended: false,
    },
  ];

  const handleConnect = async (connector: Connector, walletId: string) => {
    setSelectedWallet(walletId);
    try {
      await connect({ connector });
      onOpenChange(false);
    } catch (error) {
      toast.error("Wallet connect failed");
    } finally {
      setSelectedWallet(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>Connect Wallet</span>
          </DialogTitle>
          <DialogDescription>
            Choose your preferred Starknet wallet to continue using ReParkr
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {connectors.map((connector) => {
            const wallet = wallets.find((wallet) => wallet.id === connector.id);
            if (!wallet) return null;

            return (
              <div
                key={wallet.id}
                className="relative border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {wallet.recommended && (
                  <Badge className="absolute -top-2 -right-2 bg-blue-600 text-xs">
                    Recommended
                  </Badge>
                )}

                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{wallet.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium">{wallet.name}</h3>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {wallet.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {wallet.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="outline"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleConnect(connector, wallet.id)}
                      disabled={isPending}
                      className="w-full"
                      variant={wallet.recommended ? "default" : "outline"}
                    >
                      {isPending && selectedWallet === wallet.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wallet className="w-4 h-4 mr-2" />
                          Connect {wallet.name}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg mt-4">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Why connect a wallet?
              </p>
              <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-xs">
                <li>• Register your cars</li>
                <li>• Receive encrypted reparkr notifications</li>
                <li>• Set delegate drivers securely</li>
                <li>• Your data stays private and decentralized</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
