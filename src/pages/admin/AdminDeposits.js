import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DollarSign, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { API } from '../../App';
import { toast } from 'sonner';

const AdminDeposits = ({ onLogout }) => {
  const [deposits, setDeposits] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API}/admin/deposits/pending`, { headers });
      setDeposits(response.data);
    } catch (error) {
      toast.error('Failed to load deposits');
    }
  };

  const handleApprove = async () => {
    if (!selectedDeposit) return;
    
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(
        `${API}/admin/deposits/${selectedDeposit.id}/approve`,
        { tx_hash: selectedDeposit.tx_hash, notes },
        { headers }
      );
      toast.success('Deposit approved successfully!');
      setDialogOpen(false);
      setSelectedDeposit(null);
      setNotes('');
      fetchDeposits();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to approve deposit');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (depositId) => {
    if (!window.confirm('Are you sure you want to reject this deposit?')) return;
    
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(
        `${API}/admin/deposits/${depositId}/reject`,
        null,
        { headers, params: { notes: 'Rejected by admin' } }
      );
      toast.success('Deposit rejected');
      fetchDeposits();
    } catch (error) {
      toast.error('Failed to reject deposit');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNavbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Deposit Management</h1>
          <p className="text-slate-400">Review and approve pending deposits</p>
        </div>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Pending Deposits ({deposits.length})</h2>
          </div>
          
          {deposits.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No pending deposits</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deposits.map((deposit) => (
                <div key={deposit.id} className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl font-bold text-green-400">${deposit.amount?.toFixed(2)}</div>
                        <div className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                          Pending
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-slate-400">User:</span> <span className="font-semibold">{deposit.user_email}</span></div>
                        <div><span className="text-slate-400">Date:</span> {new Date(deposit.created_at).toLocaleString()}</div>
                        {deposit.tx_hash && (
                          <div className="mt-2">
                            <span className="text-slate-400">TX Hash:</span>
                            <code className="block mt-1 text-xs bg-slate-900/50 p-2 rounded break-all">{deposit.tx_hash}</code>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        data-testid={`approve-deposit-${deposit.id}-btn`}
                        onClick={() => {
                          setSelectedDeposit(deposit);
                          setDialogOpen(true);
                        }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        data-testid={`reject-deposit-${deposit.id}-btn`}
                        onClick={() => handleReject(deposit.id)}
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
            <DialogTitle className="text-2xl">Approve Deposit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Amount</span>
                <span className="font-bold text-green-400">${selectedDeposit?.amount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">User</span>
                <span className="font-bold">{selectedDeposit?.user_email}</span>
              </div>
            </div>
            <div>
              <Label htmlFor="notes" className="text-slate-300">Admin Notes (Optional)</Label>
              <Textarea
                data-testid="admin-notes-input"
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes..."
                className="bg-slate-800/50 border-slate-700 text-white mt-2"
                rows={3}
              />
            </div>
            <Button
              data-testid="confirm-approve-btn"
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

export default AdminDeposits;