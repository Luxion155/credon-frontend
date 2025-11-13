import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Wallet, Save } from 'lucide-react';
import axios from 'axios';
import { API } from '../../App';
import { toast } from 'sonner';

const AdminSettings = ({ onLogout }) => {
  const [settings, setSettings] = useState(null);
  const [depositAddress, setDepositAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API}/admin/settings`, { headers });
      setSettings(response.data);
      setDepositAddress(response.data.deposit_address || '');
    } catch (error) {
      toast.error('Failed to load settings');
    }
  };

  const handleUpdateAddress = async () => {
    if (!depositAddress || depositAddress.length < 10) {
      toast.error('Please enter a valid deposit address');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(
        `${API}/admin/settings`,
        { deposit_address: depositAddress },
        { headers }
      );
      toast.success('Deposit address updated successfully!');
      fetchSettings();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNavbar onLogout={onLogout} />
      
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Platform Settings</h1>
          <p className="text-slate-400">Manage platform configuration</p>
        </div>

        {/* Deposit Address Settings */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">US Dollar Tether Deposit Address</h2>
              <p className="text-sm text-slate-400">BEP-20 wallet address for user deposits</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="depositAddress" className="text-slate-300">Deposit Address (BEP-20)</Label>
              <Input
                data-testid="admin-deposit-address-input"
                id="depositAddress"
                type="text"
                value={depositAddress}
                onChange={(e) => setDepositAddress(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white mt-2 font-mono"
                placeholder="0x..."
              />
              <div className="text-xs text-slate-500 mt-2">
                This address will be shown to users when they deposit US Dollar Tether
              </div>
            </div>

            {settings?.updated_at && (
              <div className="text-sm text-slate-400">
                Last updated: {new Date(settings.updated_at).toLocaleString()}
                {settings.updated_by && ` by ${settings.updated_by}`}
              </div>
            )}

            <Button
              data-testid="update-deposit-address-btn"
              onClick={handleUpdateAddress}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>

        {/* Information Card */}
        <Card className="bg-blue-500/5 border-blue-500/20 p-6">
          <div className="flex items-start gap-3">
            <Settings className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">Important Information</h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>• Changes to the deposit address take effect immediately</li>
                <li>• All new users will see the updated address on the deposit page</li>
                <li>• Make sure the address is correct before saving</li>
                <li>• Only use BEP-20 (Binance Smart Chain) compatible addresses</li>
                <li>• Keep a backup of the old address for reference</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
