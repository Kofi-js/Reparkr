"use client";

import type React from "react";
import toast from "react-hot-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  UserPlus,
  CalendarIcon,
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn, felt252ToString } from "@/lib/utils";
import { WalletGuard } from "@/components/wallet-guard";
import {
  useContractFetch,
  writeContractWithStarknetJs,
} from "@/hooks/use-blockchain";
import { useAccount } from "@starknet-react/core";
import { REPARKR_ABI } from "@/abis/reparkr_abi";
import { useRouter } from "next/navigation";

interface PageProps {
  params: {
    platenumber: string;
  };
}

export default function DelegatePage({ params }: PageProps) {
  const { platenumber } = params;
  const router = useRouter();
  const { address } = useAccount();
  const { account } = useAccount();
  const [selectedCar, setSelectedCar] = useState(platenumber || "");
  const [delegateAddress, setDelegateAddress] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [expiryTime, setExpiryTime] = useState("");
  const [isSettingDelegate, setIsSettingDelegate] = useState(false);

  const {
    readData: fetchedCars,
    dataRefetch: refectchCars,
    readIsError,
    readIsLoading: isFetchingCars,
    readError,
  } = useContractFetch(REPARKR_ABI, "get_owner_cars", [address]);

  const handleAddDelegate = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!account) return;

      setIsSettingDelegate(true);

      await writeContractWithStarknetJs(account, "add_delegate", [
        selectedCar,
        delegateAddress,
      ]);

      toast.success("Car delegate added successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
    } finally {
      setIsSettingDelegate(false);
    }
  };

  return (
    <WalletGuard
      title="Connect Wallet to Set Delegate"
      description="Connect your Starknet wallet to manage delegate drivers for your cars"
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Set Delegate Driver</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Allow someone else to use your car temporarily. They'll receive
            repark alerts on your behalf.
          </p>
        </div>

        {/* Delegate Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Delegate Configuration</span>
            </CardTitle>
            <CardDescription>
              Set up temporary access for another driver. This creates a secure
              delegation on Starknet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleAddDelegate(e)} className="space-y-6">
              {/* Select Car */}
              <div className="space-y-2">
                <Label htmlFor="car-select">Select Your Car *</Label>
                <Select value={selectedCar} onValueChange={setSelectedCar}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose which car to delegate" />
                  </SelectTrigger>
                  <SelectContent>
                    {fetchedCars?.map((car: any, i: number) => (
                      <SelectItem key={i} value={felt252ToString(car.plate)}>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="font-mono">
                            {felt252ToString(car.plate)}
                          </Badge>
                          <span>{felt252ToString(car.car_model)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Delegate Address */}
              <div className="space-y-2">
                <Label htmlFor="delegate-address">
                  Delegate Wallet Address *
                </Label>
                <Input
                  id="delegate-address"
                  placeholder="0x..."
                  value={delegateAddress}
                  onChange={(e) => setDelegateAddress(e.target.value)}
                  className="font-mono"
                  required
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  The Starknet wallet address of the person you're delegating to
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      How Delegation Works
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>
                        • The delegate can receive repark alerts for your car
                      </li>
                      <li>
                        • Delegation automatically expires at the set date/time
                      </li>
                      <li>
                        • You can revoke delegation anytime from your dashboard
                      </li>
                      <li>• All actions are recorded on Starknet blockchain</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSettingDelegate}
              >
                {isSettingDelegate ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting Delegate on Starknet...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Set Delegate Driver
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current Delegations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Active Delegations</span>
            </CardTitle>
            <CardDescription>
              Current delegate drivers for your cars
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock active delegation */}
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Sarah Wilson</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Driving{" "}
                      <Badge variant="outline" className="font-mono ml-1">
                        ABC-123
                      </Badge>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="default" className="bg-green-600 mb-1">
                    Active
                  </Badge>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Expires Jan 15, 2024 at 6:00 PM
                  </p>
                </div>
              </div>

              {/* Empty state */}
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No other active delegations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WalletGuard>
  );
}
