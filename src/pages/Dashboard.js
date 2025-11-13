import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import NoticePopup from '../components/NoticePopup';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, DollarSign, Users, ArrowUpCircle, ArrowDownCircle, PlusCircle } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [referrals, setReferrals] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
    
    // Refresh data every 30 seconds to catch admin updates
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' };

    try {
      const [profileRes, walletRes, referralsRes, investmentsRes, transactionsRes] = await Promise.all([
        axios.get(`${API}/user/profile`, { headers }),
        axios.get(`${API}/user/wallet`, { headers }),
        axios.get(`${API}/referrals/my-referrals`, { headers }),
        axios.get(`${API}/investments/my-investments`, { headers }),
        axios.get(`${API}/transactions/history`, { headers })
      ]);

      setProfile(profileRes.data);
      setWallet(walletRes.data);
      setReferrals(referralsRes.data);
      setInvestments(investmentsRes.data);
      setTransactions(transactionsRes.data.slice(0, 5));
    } catch (error) {
      // Silent fail on auto-refresh
      if (error.response?.status !== 401) {
        console.error('Failed to refresh data');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f0a] via-[#0f140f] to-[#0a0f0a]">
      <Navbar onLogout={onLogout} />
      <NoticePopup />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-[#f5f5f0]">Dashboard</h1>
            <p className="text-[#c4c9c4] text-lg">Welcome back, {profile?.full_name || profile?.email}</p>
          </div>
          <Button
            data-testid="refresh-dashboard-btn"
            onClick={fetchData}
            variant="outline"
            size="sm"
            className="border-[#006039]/50 text-[#c9a961] hover:bg-[#006039]/20"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Button
            data-testid="quick-deposit-btn"
            onClick={() => navigate('/deposit')}
            className="h-14 sm:h-16 bg-gradient-to-r from-[#006039] to-[#004d2e] hover:from-[#007a47] hover:to-[#006039] text-[#f5f5f0] text-base sm:text-lg shadow-lg border border-[#c9a961]/20"
          >
            <ArrowUpCircle className="w-5 h-5 mr-2" />
            Deposit US Dollar Tether
          </Button>
          <Button
            data-testid="quick-invest-btn"
            onClick={() => navigate('/investments')}
            className="h-14 sm:h-16 bg-gradient-to-r from-[#c9a961] to-[#a08144] hover:from-[#d4b76a] hover:to-[#b89254] text-[#0a0f0a] text-base sm:text-lg shadow-lg font-semibold"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Invest Now
          </Button>
          <Button
            data-testid="quick-withdraw-btn"
            onClick={() => navigate('/withdraw')}
            className="h-14 sm:h-16 bg-gradient-to-r from-[#1a4d3a] to-[#0f3d2a] hover:from-[#1f5d45] hover:to-[#1a4d3a] text-[#c9a961] text-base sm:text-lg shadow-lg border border-[#c9a961]/30"
          >
            <ArrowDownCircle className="w-5 h-5 mr-2" />
            Withdraw Profits
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            data-testid="wallet-card"
            onClick={() => navigate('/deposit')}
            className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 cursor-pointer hover:border-amber-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <ArrowUpCircle className="w-5 h-5 text-slate-500" />
            </div>
            <div data-testid="wallet-balance" className="text-3xl font-bold mb-1">${wallet?.wallet_balance?.toFixed(2) || '0.00'}</div>
            <div className="text-slate-400 text-sm">Wallet Balance</div>
            <div className="text-xs text-amber-400 mt-2">Click to deposit</div>
          </Card>

          <Card 
            data-testid="invested-card"
            onClick={() => navigate('/investments')}
            className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 cursor-pointer hover:border-blue-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <PlusCircle className="w-5 h-5 text-slate-500" />
            </div>
            <div data-testid="total-invested" className="text-3xl font-bold mb-1">${wallet?.total_invested?.toFixed(2) || '0.00'}</div>
            <div className="text-slate-400 text-sm">Total Invested</div>
            <div className="text-xs text-blue-400 mt-2">Click to invest</div>
          </Card>

          <Card 
            data-testid="profit-card"
            onClick={() => navigate('/withdraw')}
            className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 cursor-pointer hover:border-green-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <ArrowDownCircle className="w-5 h-5 text-slate-500" />
            </div>
            <div data-testid="total-profit" className="text-3xl font-bold mb-1">${wallet?.total_profit_earned?.toFixed(2) || '0.00'}</div>
            <div className="text-slate-400 text-sm">Total Profit Earned</div>
            <div className="text-xs text-green-400 mt-2">Click to withdraw</div>
          </Card>

          <Card 
            data-testid="referral-card"
            onClick={() => navigate('/referrals')}
            className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 cursor-pointer hover:border-purple-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <Users className="w-5 h-5 text-slate-500" />
            </div>
            <div data-testid="referral-income" className="text-3xl font-bold mb-1 text-purple-400">${referrals?.total_bonus_earned?.toFixed(2) || '0.00'}</div>
            <div className="text-slate-400 text-sm">Referral Income Earned</div>
            <div className="text-xs text-slate-500 mt-1">{referrals?.direct_referrals || 0} direct referrals</div>
            <div className="text-xs text-purple-400 mt-1">Click to view details</div>
          </Card>
        </div>

        {/* Active Investments */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <h2 className="text-2xl font-bold mb-4">Active Investments</h2>
            <div className="space-y-3">
              {investments.filter(inv => inv.status === 'active').length === 0 ? (
                <p className="text-slate-400">No active investments</p>
              ) : (
                investments.filter(inv => inv.status === 'active').slice(0, 3).map((inv) => (
                  <div key={inv.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">{inv.plan_name}</div>
                        <div className="text-sm text-slate-400">{inv.daily_roi_percentage}% daily ROI</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-amber-400">${inv.principal?.toFixed(2)}</div>
                        <div className="text-xs text-slate-400">Principal</div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Profit Earned</span>
                      <span className="text-green-400 font-semibold">${inv.total_profit_earned?.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-slate-400">No transactions yet</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold capitalize">{tx.type}</div>
                        <div className="text-sm text-slate-400">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          tx.type === 'deposit' ? 'text-green-400' : 'text-amber-400'
                        }`}>
                          {tx.type === 'deposit' ? '+' : '-'}${tx.amount?.toFixed(2)}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                          tx.status === 'approved' || tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {tx.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Referral Info */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
          <h2 className="text-2xl font-bold mb-4">Referral Summary</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-1">Your Referral Code</div>
              <div className="text-2xl font-bold text-amber-400">{profile?.referral_code}</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-1">Direct Referrals</div>
              <div className="text-2xl font-bold">{referrals?.direct_referrals || 0}</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-1">Bonus Earned</div>
              <div className="text-2xl font-bold text-green-400">${referrals?.total_bonus_earned?.toFixed(2) || '0.00'}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;