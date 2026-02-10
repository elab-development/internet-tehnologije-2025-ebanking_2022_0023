"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthenticationContext";
import Navigation from "@/components/Navigation";
import ClientCard from "@/components/ClientCard";
import EditClientForm from "@/components/EditClientForm";

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loadingClients, setLoadingClients] = useState(true);

  // Role protection
  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push("/login");
      else if (user.role !== "ADMIN") router.push("/dashboard");
    }
  }, [user, isLoading, router]);

    const fetchClients = async () => {
    const res = await fetch("/api/clients", {
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

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchClients();
    }
  }, [user]);

    if (isLoading || loadingClients) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Svi klijenti
        </h1>
        <p className="text-gray-600 mb-8">
          Administracija klijenata
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={() => setSelectedClient(client)}
            />
          ))}
        </div>
      </main>

      {selectedClient && (
        <EditClientForm
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onSaved={fetchClients}
        />
      )}
    </div>
  );
}
