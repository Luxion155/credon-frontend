import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TrendingDown, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { API } from '../../App';
import { toast } from 'sonner';

const AdminWithdrawals = ({ onLogout }) => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API}/admin/withdrawals/pending`, { headers });
      setWithdrawals(response.data);
    } catch (error) {
      toast.error('Failed to load withdrawals');
    }
  };

  const handleApprove = async () => {
    if (!selectedWithdrawal || !txHash) {
      toast.error('Please enter transaction hash');
      return;
    }
    
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(
        `${API}/admin/withdrawals/${selectedWithdrawal.id}/approve`,
        { tx_hash: txHash, notes },
        { headers }
      );
      toast.success('Withdrawal approved successfully!');
      setDialogOpen(false);
      setSelectedWithdrawal(null);
      setTxHash('');
      setNotes('');
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to approve withdrawal');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (withdrawalId) => {
    if (!window.confirm('Are you sure you want to reject this withdrawal?')) return;
    
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(
        `${API}/admin/withdrawals/${withdrawalId}/reject`,
        null,
        { headers, params: { notes: 'Rejected by admin' } }
      );
      toast.success('Withdrawal rejected');
      fetchWithdrawals();
    } catch (error) {
      toast.error('Failed to reject withdrawal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNavbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Withdrawal Management</h1>
          <p className="text-slate-400">Review and approve pending withdrawals</p>
        </div>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Pending Withdrawals ({withdrawals.length})</h2>
          </div>
          
          {withdrawals.length === 0 ? (
            <div className="text-center py-12">
              <TrendingDown className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No pending withdrawals</p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl font-bold text-amber-400">${withdrawal.amount?.toFixed(2)}</div>
                        <div className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                          Pending
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-slate-400">User:</span> <span className="font-semibold">{withdrawal.user_email}</span></div>
                        <div><span className="text-slate-400">Date:</span> {new Date(withdrawal.created_at).toLocaleString()}</div>
                        {withdrawal.wallet_address && (
                          <div className="mt-2">
                            <span className="text-slate-400">Wallet Address:</span>
                            <code className="block mt-1 text-xs bg-slate-900/50 p-2 rounded break-all text-amber-400">
                              {withdrawal.wallet_address}
                            </code>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        data-testid={`approve-withdrawal-${withdrawal.id}-btn`}
                        onClick={() => {
                          setSelectedWithdrawal(withdrawal);
                          setDialogOpen(true);
                        }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        data-testid={`reject-withdrawal-${withdrawal.id}-btn`}
                        onClick={() => handleReject(withdrawal.id)}
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Approval Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-2xl">Approve Withdrawal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Amount</span>
                <span className="font-bold text-amber-400">${selectedWithdrawal?.amount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">User</span>
                <span className="font-bold">{selectedWithdrawal?.user_email}</span>
              </div>
              {selectedWithdrawal?.wallet_address && (
                <div>
                  <div className="text-slate-400 text-sm mb-2">User's Wallet Address:</div>
                  <code className="block text-xs bg-slate-900/50 p-3 rounded break-all text-amber-400 border border-amber-500/20">
                    {selectedWithdrawal.wallet_address}
                  </code>
                  <div className="text-xs text-slate-500 mt-1">Send US Dollar Tether to this address</div>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="txHash" className="text-slate-300">Transaction Hash *</Label>
              <Input
                data-testid="withdrawal-tx-hash-input"
                id="txHash"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Enter outgoing transaction hash"
                className="bg-slate-800/50 border-slate-700 text-white mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="notes" className="text-slate-300">Admin Notes (Optional)</Label>
              <Textarea
                data-testid="withdrawal-notes-input"
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes..."
                className="bg-slate-800/50 border-slate-700 text-white mt-2"
                rows={3}
              />
            </div>
            <Button
              data-testid="confirm-withdrawal-approve-btn"
              onClick={handleApprove}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              {loading ? 'Processing...' : 'Confirm Approval'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWithdrawals;