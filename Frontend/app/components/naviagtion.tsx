"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Car, Home, User, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { WalletButton } from "./wallet-button";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Scan", icon: Home },
    { href: "/register", label: "Register Car", icon: Car },
    { href: "/dashboard", label: "My Cars", icon: User },
    { href: "/delegate", label: "Set Delegate", icon: UserPlus },
  ];

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ReParkr
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? "default" : "ghost"}
                    size="sm"
                    asChild
                    className={cn(
                      "flex items-center space-x-2",
                      pathname === item.href && "bg-blue-600 text-white"
                    )}
                  >
                    <Link href={item.href}>
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>

            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
