import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserForm } from './components/UserForm';
import { UserTable } from './components/UserTable';
import { Shield, Users } from 'lucide-react';

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

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [refresh, setRefresh] = useState(0);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Government Header */}
      <header className="gov-header text-white py-5 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">MPOnline</h1>
              <p className="text-sm opacity-90">Madhya Pradesh Government Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-white/20 px-4 py-1.5 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Secure Connection
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-semibold text-gray-800">Citizen Management System</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <UserForm onSuccess={() => setRefresh(prev => prev + 1)} />
          </div>

          {/* Table Section */}
          <div className="lg:col-span-2">
            <UserTable 
              users={users} 
              onRefresh={() => setRefresh(prev => prev + 1)} 
            />
          </div>
        </div>
      </div>

      <footer className="text-center py-6 text-gray-500 text-sm border-t">
        © 2026 MPOnline - All Rights Reserved | Secure Government Portal
      </footer>
    </div>
  );
}

export default App;