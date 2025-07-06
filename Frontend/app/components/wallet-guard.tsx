"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Shield, Lock } from "lucide-react";
import { ConnectWalletModal } from "./connect-wallet-modal";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "@starknet-react/core";
import toast from "react-hot-toast";

interface WalletGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function WalletGuard({
  children,
  title,
  description,
}: WalletGuardProps) {
  const { address } = useAccount();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const hasPromptedTelegram = useRef(false);

  useEffect(() => {
    console.log(address);
    if (address && !hasPromptedTelegram.current) {
      toast.success("Wallet connected successfully!");
      hasPromptedTelegram.current = true;

      setTimeout(() => {
        const confirmed = window.confirm(
          "Do you want to receive parking alerts via Telegram?"
        );
        if (confirmed) {
          window.open(`https://t.me/ReParkrBot?start=${address}`, "_blank");
        }
      }, 500);
    }
  }, [address]);

  if (!address) {
    return (
      <>
        <div className="max-w-md mx-auto">
          <Card className="text-center shadow-lg">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>{title || "Wallet Required"}</CardTitle>
              <CardDescription>
                {description ||
                  "Connect your Starknet wallet to access this feature"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setShowConnectModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>

              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-gray-600 mt-0.5" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium mb-1">Why do I need a wallet?</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Secure car registration on blockchain</li>
                      <li>• Private messaging system</li>
                      <li>• Delegate driver management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <ConnectWalletModal
          open={showConnectModal}
          onOpenChange={setShowConnectModal}
        />
      </>
    );
  }

  return <>{children}</>;
}
