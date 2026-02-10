"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthenticationContext";
import Navigation from "@/components/Navigation";
import ClientCard from "@/components/ClientCard";

type Client = {
  id: string;
  firstName: string;
  lastName: string;
};

export default function ManagerDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  // Role protection
  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push("/login");
      else if (user.role !== "MANAGER") router.push("/dashboard");
    }
  }, [user, isLoading, router]);

    useEffect(() => {
    const fetchClients = async () => {
      const res = await fetch("/api/clients/manager", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setClients(data.clients);
      }
      setLoadingClients(false);
    };

    if (user?.role === "MANAGER") {
      fetchClients();
    }
  }, [user]);

    if (isLoading || loadingClients) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation
          showHomeButton={false}
          clickableLogo={false}
        />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        showHomeButton={false}
        clickableLogo={false}
      />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Vaši klijenti
        </h1>
        <p className="text-gray-600 mb-8">
          Klijenti koji su dodeljeni vama
        </p>

        {clients.length === 0 ? (
          <p className="text-gray-500">Nemate dodeljene klijente.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


