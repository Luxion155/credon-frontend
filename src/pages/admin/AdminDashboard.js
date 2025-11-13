import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Card } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import { API } from '../../App';
import { toast } from 'sonner';

const AdminDashboard = ({ onLogout }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API}/admin/dashboard/stats`, { headers });
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNavbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Overview of platform metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div data-testid="total-users" className="text-3xl font-bold mb-1">{stats?.total_users || 0}</div>
            <div className="text-slate-400 text-sm">Total Users</div>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div data-testid="total-deposits" className="text-3xl font-bold mb-1">${stats?.total_deposit_amount?.toFixed(2) || '0.00'}</div>
            <div className="text-slate-400 text-sm">Total Deposits ({stats?.total_deposits || 0})</div>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div data-testid="total-invested" className="text-3xl font-bold mb-1">${stats?.total_invested_amount?.toFixed(2) || '0.00'}</div>
            <div className="text-slate-400 text-sm">Active Investments ({stats?.active_investments || 0})</div>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
            <div data-testid="total-withdrawals" className="text-3xl font-bold mb-1">${stats?.total_withdrawal_amount?.toFixed(2) || '0.00'}</div>
            <div className="text-slate-400 text-sm">Total Withdrawals ({stats?.total_withdrawals || 0})</div>
          </Card>
        </div>

        {/* Platform Health */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
          <h2 className="text-2xl font-bold mb-6">Platform Health</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-1">Net Flow</div>
              <div className="text-2xl font-bold text-green-400">
                ${((stats?.total_deposit_amount || 0) - (stats?.total_withdrawal_amount || 0)).toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Deposits - Withdrawals</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-1">Investment Rate</div>
              <div className="text-2xl font-bold text-amber-400">
                {stats?.total_deposit_amount > 0 
                  ? ((stats?.total_invested_amount / stats?.total_deposit_amount) * 100).toFixed(1)
                  : 0}%
              </div>
              <div className="text-xs text-slate-500 mt-1">Invested / Deposits</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-1">Avg Per User</div>
              <div className="text-2xl font-bold text-blue-400">
                ${stats?.total_users > 0 
                  ? (stats?.total_invested_amount / stats?.total_users).toFixed(2)
                  : '0.00'}
              </div>
              <div className="text-xs text-slate-500 mt-1">Total Invested / Users</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;