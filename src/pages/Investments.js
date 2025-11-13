import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrendingUp } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';

const Investments = ({ onLogout }) => {
  const [plans, setPlans] = useState([]);
  const [myInvestments, setMyInvestments] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [plansRes, investmentsRes, walletRes] = await Promise.all([
        axios.get(`${API}/plans`, { headers }),
        axios.get(`${API}/investments/my-investments`, { headers }),
        axios.get(`${API}/user/wallet`, { headers })
      ]);

      setPlans(plansRes.data);
      setMyInvestments(investmentsRes.data);
      setWallet(walletRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleInvest = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post(
        `${API}/investments/create`,
        { plan_id: selectedPlan.id, amount: parseFloat(amount) },
        { headers }
      );
      toast.success('Investment created successfully!');
      setDialogOpen(false);
      setAmount('');
      setSelectedPlan(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create investment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Investment Plans</h1>
          <p className="text-slate-400">Choose a plan and start earning daily returns</p>
        </div>

        {/* Wallet Balance */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-slate-400 text-sm mb-1">Available Balance</div>
              <div data-testid="wallet-balance" className="text-3xl font-bold text-amber-400">${wallet?.wallet_balance?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-sm mb-1">Total Invested</div>
              <div className="text-2xl font-bold">${wallet?.total_invested?.toFixed(2) || '0.00'}</div>
            </div>
          </div>
        </Card>

        {/* Investment Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 hover:border-amber-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                    {plan.duration_months} months
                  </span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Daily ROI</span>
                    <span className="font-bold text-amber-400">{plan.daily_roi_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Returns</span>
                    <span className="font-bold text-green-400">
                      {(plan.daily_roi_percentage * plan.duration_months * 30).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Dialog open={dialogOpen && selectedPlan?.id === plan.id} onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) setSelectedPlan(null);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      data-testid={`invest-plan-${plan.id}-btn`}
                      onClick={() => setSelectedPlan(plan)}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white"
                    >
                      Invest Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Invest in {plan.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Daily ROI</span>
                          <span className="font-bold text-amber-400">{plan.daily_roi_percentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Duration</span>
                          <span className="font-bold">{plan.duration_months} months</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Available Balance</span>
                          <span className="font-bold text-green-400">${wallet?.wallet_balance?.toFixed(2)}</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="amount" className="text-slate-300">Investment Amount (US Dollar Tether)</Label>
                        <Input
                          data-testid="investment-amount-input"
                          id="amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="bg-slate-800/50 border-slate-700 text-white mt-2"
                        />
                      </div>
                      <Button
                        data-testid="confirm-investment-btn"
                        onClick={handleInvest}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white"
                      >
                        {loading ? 'Processing...' : 'Confirm Investment'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
            ))}
          </div>
        </div>

        {/* My Investments */}
        <div>
          <h2 className="text-2xl font-bold mb-6">My Investments</h2>
          {myInvestments.length === 0 ? (
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-12 text-center">
              <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No investments yet. Start investing to earn daily returns!</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {myInvestments.map((inv) => (
                <Card key={inv.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{inv.plan_name}</h3>
                      <div className="text-sm text-slate-400">{inv.daily_roi_percentage}% daily ROI</div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      inv.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Principal</span>
                      <span className="font-bold">${inv.principal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Daily Profit</span>
                      <span className="font-bold text-amber-400">${inv.daily_profit?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Earned</span>
                      <span className="font-bold text-green-400">${inv.total_profit_earned?.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Start Date</span>
                        <span>{new Date(inv.start_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-slate-400">Maturity Date</span>
                        <span>{new Date(inv.maturity_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Investments;