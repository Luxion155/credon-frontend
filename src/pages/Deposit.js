import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, Copy, CheckCircle, Clock, XCircle } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';

const Deposit = ({ onLogout }) => {
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    fetchTransactions();
    fetchDepositAddress();
  }, []);

  const fetchDepositAddress = async () => {
    try {
      const response = await axios.get(`${API}/settings/deposit-address`);
      setWalletAddress(response.data.deposit_address);
    } catch (error) {
      console.error('Failed to load deposit address');
      // Fallback to default
      setWalletAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
    }
  };

  const fetchTransactions = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API}/transactions/history`, { headers });
      setTransactions(response.data.filter(tx => tx.type === 'deposit'));
    } catch (error) {
      toast.error('Failed to load transactions');
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Wallet address copied!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!txHash) {
      toast.error('Please enter transaction hash');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post(
        `${API}/deposits/submit`,
        { amount: parseFloat(amount), tx_hash: txHash },
        { headers }
      );
      toast.success('Deposit submitted for verification!');
      setAmount('');
      setTxHash('');
      fetchTransactions();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Deposit US Dollar Tether</h1>
          <p className="text-slate-400">Fund your wallet to start investing</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Deposit Form */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <h2 className="text-2xl font-bold mb-6">Submit Deposit</h2>
            
            {/* Wallet Address */}
            <div className="bg-gradient-to-br from-amber-500/10 to-yellow-600/10 border border-amber-500/20 rounded-xl p-4 mb-6">
              <div className="text-sm text-slate-400 mb-2">Send US Dollar Tether (BEP-20) to:</div>
              <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
                <code className="text-amber-400 text-sm break-all mr-2">{walletAddress}</code>
                <Button
                  data-testid="copy-address-btn"
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyAddress}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-slate-500 mt-2">⚠️ Only send US Dollar Tether on BEP-20 network</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="amount" className="text-slate-300">Amount (US Dollar Tether)</Label>
                <Input
                  data-testid="deposit-amount-input"
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
                <Label htmlFor="txHash" className="text-slate-300">Transaction Hash</Label>
                <Textarea
                  data-testid="deposit-tx-hash-input"
                  id="txHash"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Paste your transaction hash here"
                  className="bg-slate-800/50 border-slate-700 text-white mt-2"
                  rows={3}
                  required
                />
              </div>

              <Button
                data-testid="submit-deposit-btn"
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white"
              >
                {loading ? 'Submitting...' : 'Submit Deposit'}
              </Button>
            </form>

            <div className="mt-6 text-sm text-slate-400 space-y-1">
              <p>• Your deposit will be reviewed by our team</p>
              <p>• Verification usually takes 5-30 minutes</p>
              <p>• Funds will be credited to your wallet after approval</p>
            </div>
          </Card>

          {/* Deposit History */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <h2 className="text-2xl font-bold mb-6">Deposit History</h2>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No deposits yet</p>
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
                        {tx.status === 'approved' && (
                          <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Approved
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
                    {tx.tx_hash && (
                      <div className="text-xs text-slate-500 break-all mt-2">
                        TX: {tx.tx_hash}
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

export default Deposit;