import React from 'react';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type TableProps = {
  users: User[];
  onDelete: (id: string) => void;
};

const Table: React.FC<TableProps> = ({ users, onDelete }) => {
  return (
    <table className="min-w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr className="bg-teal-600 text-white">
          <th className="px-4 py-2">Nom</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b border-gray-200">
            <td className="px-4 py-2">{user.firstName} {user.lastName}</td>
            <td className="px-4 py-2">{user.email}</td>
            <td className="px-4 py-2">
              <button
                onClick={() => onDelete(user.id)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
