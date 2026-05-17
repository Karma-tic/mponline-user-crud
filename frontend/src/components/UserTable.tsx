import { useState } from 'react';
import axios from 'axios';
import { Edit2, Trash2, RefreshCw } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  phone_number: string;
  created_at?: string;
}

interface UserTableProps {
  users: User[];
  onRefresh: () => void;
}

export function UserTable({ users, onRefresh }: UserTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`);
      onRefresh();
    } catch (error) {
      alert("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="px-8 py-5 border-b flex items-center justify-between bg-gray-50">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Registered Citizens</h3>
          <p className="text-sm text-gray-500">{users.length} Records Found</p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-8 py-4 font-medium text-gray-600">ID</th>
              <th className="px-8 py-4 font-medium text-gray-600">Full Name</th>
              <th className="px-8 py-4 font-medium text-gray-600">Email</th>
              <th className="px-8 py-4 font-medium text-gray-600">Gender</th>
              <th className="px-8 py-4 font-medium text-gray-600">Phone Number</th>
              <th className="px-8 py-4 font-medium text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-gray-500">
                  No citizens registered yet
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-8 py-5 font-mono text-gray-500">#{user.id}</td>
                  <td className="px-8 py-5 font-medium">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-8 py-5 text-gray-600">{user.email}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                      ${user.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 
                        user.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 
                        'bg-purple-100 text-purple-700'}`}>
                      {user.gender}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-medium text-gray-700">{user.phone_number}</td>
                  <td className="px-8 py-5 text-center">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}