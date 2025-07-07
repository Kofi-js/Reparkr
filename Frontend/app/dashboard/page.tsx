"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Car, Edit, Trash2, UserPlus, Bell, Shield, Clock } from "lucide-react";
import Link from "next/link";
import { WalletGuard } from "@/components/wallet-guard";
import { useAccount } from "@starknet-react/core";
import { REPARKR_ABI } from "@/abis/reparkr_abi";
import {
  useContractFetch,
  writeContractWithStarknetJs,
} from "@/hooks/use-blockchain";
import toast from "react-hot-toast";
import { bigIntToHex, felt252ToString } from "@/lib/utils";

export default function DashboardPage() {
  const { address, account } = useAccount();
  const [isDeletingDelegate, setIsDeletingDelegate] = useState(false);

  const {
    readData: fetchedCars,
    dataRefetch: refectchCars,
    readIsError,
    readIsLoading: isFetchingCars,
    readError,
  } = useContractFetch(REPARKR_ABI, "get_owner_cars", [address]);

  console.log(fetchedCars);

  const handleDeleteDelegate = async (
    e: React.FormEvent,
    plateNumber: string
  ) => {
    try {
      e.preventDefault();
      if (!account) return;
      setIsDeletingDelegate(true);

      await writeContractWithStarknetJs(account, "remove_delegate", [
        plateNumber,
      ]);

      toast.success("Car delegate removed successfully!");
    } catch (err) {
      console.log(err);
    } finally {
      setIsDeletingDelegate(false);
    }
  };

  const toggleCarStatus = (carId: number) => {
    // Toggle car active status
    console.log("Toggle car status:", carId);
  };

  return (
    <WalletGuard
      title="Connect Wallet to View Cars"
      description="Connect your Starknet wallet to view and manage your registered cars"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Cars</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your registered vehicles and settings
            </p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/register">
              <Car className="w-4 h-4 mr-2" />
              Register New Car
            </Link>
          </Button>
        </div>

        {fetchedCars?.length !== 0 && (
          <>
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {fetchedCars?.length}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Registered Cars
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {fetchedCars?.reduce((acc: number, car: any) => {
                          if (Number(car.delegate_driver) !== 0) {
                            return acc + 1;
                          }
                          return acc;
                        }, 0)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Active Delegates
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cars List */}
            <div className="space-y-4">
              {fetchedCars?.map((car: any, i: number) => (
                <Card key={i} className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="font-mono text-lg">
                            {felt252ToString(car.plate)}
                          </CardTitle>
                          <CardDescription>
                            {felt252ToString(car.car_model)}
                            {felt252ToString(car.plate)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={car.active ? "default" : "secondary"}>
                          {car.active ? "Active" : "Inactive"}
                        </Badge>
                        {/* <div className="flex items-center space-x-2">
                      <Label htmlFor={`toggle-${car.id}`} className="text-sm">
                        Active
                      </Label>
                      <Switch
                        id={`toggle-${car.id}`}
                        checked={car.isActive}
                        onCheckedChange={() => toggleCarStatus(car.id)}
                      />
                    </div> */}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Shield className="w-4 h-4 mr-2" />
                          Contact Method
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Email
                            </span>
                            <Badge
                              variant="outline"
                              className="font-mono text-xs"
                            >
                              {felt252ToString(car.email)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Bell className="w-4 h-4 mr-2" />
                      Alert Statistics
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span>Total: {car.stats.totalAlerts}</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Last: {car.stats.lastAlert}
                        </span>
                      </div>
                    </div>
                  </div> */}
                    </div>

                    {/* Delegate Info */}
                    {car.delegate_driver ? (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Current Delegate
                        </h4>
                        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              {/* <p className="font-medium text-blue-900 dark:text-blue-100">
                            {car.delegate.name}
                          </p> */}
                              <p className="text-sm text-blue-700 dark:text-blue-300 font-mono">
                                {bigIntToHex(car.delegate_driver)}
                              </p>
                            </div>
                            {/* <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            <Clock className="w-3 h-3 mr-1" />
                            Expires{" "}
                            {new Date(
                              car.delegate.expiresAt
                            ).toLocaleDateString()}
                          </Badge>
                        </div> */}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Delegate Driver
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            No delegate assigned
                          </p>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/delegate/${car.plate}`}>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Set Delegate
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {Number(car.delegate_driver) !== 0 && (
                      <div className="flex items-center space-x-2 pt-2 border-t">
                        {/* <Button variant="outline" size="sm" asChild>
                          <Link href="/delegate">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Manage Delegate
                          </Link>
                        </Button> */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 disabled:cursor-not-allowed"
                          disabled={isDeletingDelegate}
                          onClick={(e) =>
                            handleDeleteDelegate(e, felt252ToString(car.plate))
                          }
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {!isDeletingDelegate ? "Remove" : "Removing Delegate"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {fetchedCars?.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No cars registered</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Register your first car to start using ReParkRa
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/register">
                  <Car className="w-4 h-4 mr-2" />
                  Register Your Car
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </WalletGuard>
  );
}
