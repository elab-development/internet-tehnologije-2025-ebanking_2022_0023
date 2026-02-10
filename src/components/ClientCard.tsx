
type Props = {
  client: {
    id: string;
    firstName: string;
    lastName: string;
  };
  onEdit?: () => void;
};

export default function ClientCard({ client, onEdit }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500 mb-1">ID</p>
      <p className="font-mono text-xs text-gray-700 mb-4">{client.id}</p>

      <p className="text-lg font-semibold text-gray-900">
        {client.firstName} {client.lastName}
      </p>

      {onEdit && (
        <button
          onClick={onEdit}
          className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-medium rounded-lg"
        >
          Izmeni
        </button>
      )}
    </div>
  );
}
