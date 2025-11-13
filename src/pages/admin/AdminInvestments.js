import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TrendingUp } from 'lucide-react';
import axios from 'axios';
import { API } from '../../App';
import { toast } from 'sonner';

const AdminInvestments = ({ onLogout }) => {
  const [investments, setInvestments] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API}/admin/investments`, { headers });
      setInvestments(response.data);
    } catch (error) {
      toast.error('Failed to load investments');
    }
  };

  const filteredInvestments = investments.filter(inv => 
    inv.user_email.toLowerCase().includes(search.toLowerCase()) ||
    inv.plan_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNavbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Investment Management</h1>
          <p className="text-slate-400">View all platform investments</p>
        </div>

        {/* Search */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 mb-6">
          <Input
            data-testid="search-investments-input"
            type="text"
            placeholder="Search by user email or plan name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800/50 border-slate-700 text-white"
          />
        </Card>

        {/* Investments List */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Investments ({filteredInvestments.length})</h2>
          </div>
          
          {filteredInvestments.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No investments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">User</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Plan</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Principal</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Daily Profit</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Total Earned</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Maturity</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvestments.map((inv) => (
                    <tr key={inv.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-3 px-4">{inv.user_email}</td>
                      <td className="py-3 px-4">{inv.plan_name}</td>
                      <td className="py-3 px-4 font-semibold">${inv.principal?.toFixed(2)}</td>
                      <td className="py-3 px-4 text-amber-400 font-semibold">${inv.daily_profit?.toFixed(2)}</td>
                      <td className="py-3 px-4 text-green-400 font-semibold">${inv.total_profit_earned?.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          inv.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-sm">
                        {new Date(inv.maturity_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminInvestments;