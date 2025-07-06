"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  User,
} from "lucide-react";
import { ConnectWalletModal } from "./connect-wallet-modal";
import toast from "react-hot-toast";
import { useAccount, useDisconnect } from "@starknet-react/core";
import { add } from "date-fns";

export function WalletButton() {
  const { address } = useAccount();
  const hasPromptedTelegram = useRef(false);

  // useEffect(() => {
  //   console.log(address);
  //   if (address && !hasPromptedTelegram.current) {
  //     toast.success("Wallet connected successfully!");
  //     hasPromptedTelegram.current = true;

  //     setTimeout(() => {
  //       const confirmed = window.confirm(
  //         "Do you want to receive parking alerts via Telegram?"
  //       );
  //       if (confirmed) {
  //         window.open(`https://t.me/ReParkrBot?start=${address}`, "_blank");
  //       }
  //     }, 500);
  //   }
  // }, [address]);

  const { disconnectAsync } = useDisconnect();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied!");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectAsync();

      toast.success("Wallet disconnected");
    } catch (err) {
      console.log(err);
    }
  };

  if (!address) {
    return (
      <>
        <Button
          onClick={() => setShowConnectModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
        <ConnectWalletModal
          open={showConnectModal}
          onOpenChange={setShowConnectModal}
        />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="font-mono text-sm">{formatAddress(address!)}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-3 py-2">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">Connected</p>
              {/* <Badge variant="outline" className="text-xs">
                {walletType?.charAt(0).toUpperCase() + walletType?.slice(1)}
                ArgentX
              </Badge> */}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs font-mono break-all">
            {address}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="w-4 h-4 mr-2" />
          Copy Address
        </DropdownMenuItem>

        <DropdownMenuItem>
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
