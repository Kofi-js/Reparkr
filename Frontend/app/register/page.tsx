"use client";

import type React from "react";

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
import { Car, Shield, Loader2, CheckCircle } from "lucide-react";
import { WalletGuard } from "@/components/wallet-guard";
import toast from "react-hot-toast";
import {
  useContractWriteUtility,
  writeContractWithStarknetJs,
} from "@/hooks/use-blockchain";
import { REPARKR_ABI } from "@/abis/reparkr_abi";
import { useAccount } from "@starknet-react/core";
import { shortString } from "starknet";

export default function RegisterPage() {
  const { account } = useAccount();
  const [plateNumber, setPlateNumber] = useState("TCN-3047");
  const [contactMethod, setContactMethod] = useState("email");
  const [contactValue, setContactValue] = useState("user@email.com");
  const [carModel, setCarModel] = useState("Toyota");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!account) return;

      if (!plateNumber || !contactMethod || !contactValue) {
        toast.error("Please fill in all required fields");

        return;
      }

      setIsRegistering(true);

      await writeContractWithStarknetJs(account, "register_car", {
        plate:plateNumber,
        carModel: carModel,
        email: shortString.encodeShortString(contactValue),
    });

      toast.success("Car registered successfully!");
    } catch (err) {
      console.log(err);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <WalletGuard
      title="Connect Wallet to Register"
      description="Connect your Starknet wallet to register your car on the blockchain"
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Register Your Car</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Add your car to the ReParkRa network so others can reach you when
            needed
          </p>
        </div>

        {/* Registration Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="w-5 h-5" />
              <span>Car Registration</span>
            </CardTitle>
            <CardDescription>
              Your contact information is encrypted and stored securely on
              Starknet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              {/* License Plate */}
              <div className="space-y-2">
                <Label htmlFor="plate">License Plate Number *</Label>
                <Input
                  id="plate"
                  placeholder="e.g., ABC-123"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                  className="font-mono"
                  required
                />
              </div>

              {/* Car Model (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="model">Car Model (Optional)</Label>
                <Input
                  id="model"
                  placeholder="e.g., Toyota Camry 2020"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                />
              </div>

              {/* Contact Method */}
              <div className="space-y-2">
                <Label htmlFor="contact-method">
                  Preferred Contact Method *
                </Label>
                <Select value={contactMethod} onValueChange={setContactMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select how you want to be contacted" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    {/* <SelectItem value="telegram">Telegram</SelectItem> */}
                    {/* <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Value */}
              <div className="space-y-2">
                <Label htmlFor="contact-value">Email Address</Label>
                <Input
                  id="contact-value"
                  placeholder="@username"
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)} 
                  disabled={contactMethod === "push"}
                  required
                />
              </div>

              {/* Privacy Notice */}
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      Privacy & Security
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Your contact information is encrypted end-to-end and
                      stored on Starknet. Only authorized users who scan your
                      car can send you repark requests.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registering on Starknet...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Register My Car
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-2">Secure</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                End-to-end encrypted communication
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">Convenient</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified instantly when needed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-2">Decentralized</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Powered by Starknet blockchain
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </WalletGuard>
  );
}
