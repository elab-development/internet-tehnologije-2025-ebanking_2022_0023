
"use client";

import { useState } from "react";

type Props = {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  onClose: () => void;
  onSaved: () => void;
};

export default function EditClientForm({ client, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    firstName: client.firstName,
    lastName: client.lastName,
    phone: client.phone,
  });

  const submit = async () => {
    await fetch(`/api/clients/${client.id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(form),
    });
    };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-black tracking-wide">Izmena klijenta</h2>

        {["firstName", "lastName", "phone"].map((field) => (
          <input
            key={field}
            className="w-full border border-gray-400 rounded-lg px-4 py-2 mb-3 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"

            value={(form as any)[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
          />
        ))}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">
            Otkaži
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg"
          >
            Sačuvaj
          </button>
        </div>
      </div>
    </div>
  );
}
