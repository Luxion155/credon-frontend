import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, DollarSign, TrendingDown, Gift } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';

const Transactions = ({ onLogout }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filter, searchTerm]);

  const fetchTransactions = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API}/transactions/history`, { headers });
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to load transactions');
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(tx => tx.type === filter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.tx_hash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.amount.toString().includes(searchTerm)
      );
    }

    setFilteredTransactions(filtered);
  };

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    const headers = ['Date', 'Type', 'Amount', 'Status', 'Transaction Hash'];
    const csvData = filteredTransactions.map(tx => [
      new Date(tx.created_at).toLocaleString(),
      tx.type,
      tx.amount,
      tx.status,
      tx.tx_hash || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `credon_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast.success('Transactions exported successfully');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <DollarSign className="w-5 h-5" />;
      case 'withdrawal':
        return <TrendingDown className="w-5 h-5" />;
      case 'referral':
        return <Gift className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Transaction History</h1>
          <p className="text-slate-400">Complete record of all your transactions</p>
        </div>

        {/* Filters */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Input
                data-testid="transaction-search-input"
                type="text"
                placeholder="Search by hash or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger data-testid="transaction-type-filter" className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Transactions</SelectItem>
                  <SelectItem value="deposit" className="text-white">Deposits Only</SelectItem>
                  <SelectItem value="withdrawal" className="text-white">Withdrawals Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                data-testid="export-csv-btn"
                onClick={exportToCSV}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* Transaction List */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Transactions ({filteredTransactions.length})</h2>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        tx.type === 'deposit' ? 'bg-green-500/20 text-green-400' :
                        tx.type === 'withdrawal' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {getIcon(tx.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold capitalize">{tx.type}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                        </div>
                        <div className="text-sm text-slate-400">
                          {new Date(tx.created_at).toLocaleString()}
                        </div>
                        {tx.tx_hash && (
                          <div className="text-xs text-slate-500 mt-1 break-all">
                            TX: {tx.tx_hash}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${
                        tx.type === 'deposit' ? 'text-green-400' : 'text-amber-400'
                      }`}>
                        {tx.type === 'deposit' ? '+' : '-'}${tx.amount?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  {tx.admin_notes && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50 text-sm text-slate-400">
                      <span className="font-semibold">Note:</span> {tx.admin_notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Transactions;
