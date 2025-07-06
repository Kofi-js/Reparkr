"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Search,
  Send,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAccount } from "@starknet-react/core";
import {
  readContractWithStarknetJs,
  useContractFetch,
} from "./hooks/use-blockchain";
import { REPARKR_ABI } from "./abis/reparkr_abi";
import { shortString } from "starknet";
import { felt252ToString } from "./lib/utils";

export default function HomePage() {
  const { address } = useAccount();
  const [plateNumber, setPlateNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSearch = async () => {
    try {
      if (!plateNumber.trim()) {
        toast("Enter the plate number of the car blocking you");
        return;
      }

      setIsSearching(true);

      const result = await readContractWithStarknetJs("get_car", [plateNumber]);

      setSearchResult(result);

      // console.log(result);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendAlert = async () => {
    try {
      setIsSending(true);
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: felt252ToString(searchResult.telegram_id),
          plate: felt252ToString(searchResult.plate),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send email");
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleQRScan = () => {
    toast("QR Scanner");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Car Blocking Your Exit?
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Find and alert the driver instantly using their license plate or QR
          code
        </p>
      </div>

      {/* Search Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Find Car Owner</span>
          </CardTitle>
          <CardDescription>
            Enter the license plate number or scan the QR code on the car
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter license plate (e.g., ABC-123)"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              className="flex-1"
              disabled={isSearching}
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || !plateNumber.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* <div className="flex items-center space-x-4">
            <Separator className="flex-1" />
            <span className="text-sm text-gray-500">or</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            onClick={handleQRScan}
            className="w-full"
            disabled={isSearching}
          >
            <Camera className="w-4 h-4 mr-2" />
            Scan QR Code
          </Button> */}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {searchResult.isRegistered ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-600" />
              )}
              <span>Search Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">License Plate:</span>
              <Badge variant="secondary" className="font-mono">
                {felt252ToString(searchResult.plate)}
              </Badge>
            </div>

            {searchResult.plate ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant="default" className="bg-green-600">
                    Registered
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Current Driver:</span>
                  <Badge variant="outline">
                    {Number(searchResult.delegate_driver) === 0
                      ? "Car Owner"
                      : "Delegate Driver"}
                  </Badge>
                </div>

                {/* <div className="flex items-center justify-between">
                  <span className="font-medium">Last Seen:</span>
                  <span className="text-sm text-gray-600">
                    {searchResult.lastSeen}
                  </span>
                </div> */}

                <Button
                  onClick={handleSendAlert}
                  disabled={isSending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Alert...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Repark Alert
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <AlertCircle className="w-12 h-12 text-orange-600 mx-auto" />
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-400">
                    Car Not Registered
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This car is not registered with ReParkRa. You may need to
                    find the owner manually.
                  </p>
                </div>
                <Button variant="outline" className="mt-4">
                  Report Unregistered Car
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Quick Search</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Find any registered car instantly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Private Alerts</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Encrypted messaging via Starknet
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
