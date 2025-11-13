import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingDown, CheckCircle, Clock, XCircle } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';

const Withdraw = ({ onLogout }) => {
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [walletRes, transactionsRes] = await Promise.all([
        axios.get(`${API}/user/wallet`, { headers }),
        axios.get(`${API}/transactions/history`, { headers })
      ]);

      setWallet(walletRes.data);
      setTransactions(transactionsRes.data.filter(tx => tx.type === 'withdrawal'));
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!walletAddress || walletAddress.length < 10) {
      toast.error('Please enter a valid wallet address');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post(
        `${API}/withdrawals/request`,
        { amount: parseFloat(amount), wallet_address: walletAddress },
        { headers }
      );
      toast.success('Withdrawal request submitted!');
      setAmount('');
      setWalletAddress('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Withdraw Funds</h1>
          <p className="text-slate-400">Request withdrawal of your profits (weekly limit)</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Withdrawal Form */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <h2 className="text-2xl font-bold mb-6">Request Withdrawal</h2>
            
            {/* Wallet Balance */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-4 mb-6">
              <div className="text-sm text-slate-400 mb-2">Available Balance</div>
              <div data-testid="available-balance" className="text-4xl font-bold text-green-400">${wallet?.wallet_balance?.toFixed(2) || '0.00'}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="amount" className="text-slate-300">Withdrawal Amount (US Dollar Tether)</Label>
                <Input
                  data-testid="withdraw-amount-input"
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-slate-800/50 border-slate-700 text-white mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="walletAddress" className="text-slate-300">Your Wallet Address (BEP-20)</Label>
                <Input
                  data-testid="withdraw-wallet-address-input"
                  id="walletAddress"
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x..."
                  className="bg-slate-800/50 border-slate-700 text-white mt-2 font-mono text-sm"
                  required
                />
                <div className="text-xs text-slate-500 mt-1">
                  Enter your BEP-20 compatible wallet address to receive US Dollar Tether
                </div>
              </div>

              <Button
                data-testid="submit-withdrawal-btn"
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#006039] to-[#004d2e] hover:from-[#007a47] hover:to-[#006039] text-[#f5f5f0] shadow-lg border border-[#c9a961]/20"
              >
                {loading ? 'Submitting...' : 'Request Withdrawal'}
              </Button>
            </form>

            <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="text-sm text-amber-400 font-semibold mb-2">⚠️ Important Information</div>
              <div className="text-sm text-slate-400 space-y-1">
                <p>• Withdrawals are processed once per week</p>
                <p>• Only profit earnings can be withdrawn</p>
                <p>• Principal remains locked until investment maturity</p>
                <p>• Admin verification required (usually 24-48 hours)</p>
              </div>
            </div>
          </Card>

          {/* Withdrawal History */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <h2 className="text-2xl font-bold mb-6">Withdrawal History</h2>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingDown className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No withdrawals yet</p>
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-lg">${tx.amount?.toFixed(2)}</div>
                        <div className="text-sm text-slate-400">
                          {new Date(tx.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {tx.status === 'completed' && (
                          <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </div>
                        )}
                        {tx.status === 'pending' && (
                          <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                            <Clock className="w-4 h-4" />
                            Pending
                          </div>
                        )}
                        {tx.status === 'rejected' && (
                          <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                            <XCircle className="w-4 h-4" />
                            Rejected
                          </div>
                        )}
                      </div>
                    </div>
                    {tx.wallet_address && (
                      <div className="text-xs text-slate-500 break-all mt-2">
                        <span className="text-slate-400">Your Wallet:</span> {tx.wallet_address}
                      </div>
                    )}
                    {tx.tx_hash && tx.status === 'completed' && (
                      <div className="text-xs text-slate-500 break-all mt-2">
                        <span className="text-slate-400">TX:</span> {tx.tx_hash}
                      </div>
                    )}
                    {tx.admin_notes && (
                      <div className="text-sm text-slate-400 mt-2 italic">
                        Note: {tx.admin_notes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;