"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthenticationContext";
import Button from "./Button";
import { RiHome5Line, RiLogoutBoxLine, RiUserLine } from "@remixicon/react";


type NavigationProps = {
  showHomeButton?: boolean;
  clickableLogo?: boolean;
};

export default function Navigation({
  showHomeButton = true,
  clickableLogo = true,
}: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (pathname === "/login") {
    return null;
  }

  const LogoContent = (
    <>
      <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
        <span className="text-black font-bold text-xl">B</span>
      </div>
      <span className="text-xl font-bold text-gray-900">
        ITEH Banka
      </span>
    </>
  );

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            {clickableLogo ? (
              <Link href="/dashboard" className="flex items-center gap-2">
                {LogoContent}
              </Link>
            ) : (
              <div className="flex items-center gap-2 cursor-default">
                {LogoContent}
              </div>
            )}

            {showHomeButton && (
              <div className="hidden md:flex items-center gap-1">
                <Link href="/dashboard">
                  <button
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      pathname === "/dashboard"
                        ? "bg-yellow-50 text-yellow-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <RiHome5Line className="w-5 h-5" />
                    Početna
                  </button>
                </Link>
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <RiUserLine className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="!text-gray-700 hover:!text-red-600"
              >
                <RiLogoutBoxLine className="w-5 h-5" />
                Odjavi se
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

