import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, DollarSign, Users, TrendingUp, RefreshCw, Power, PowerOff } from 'lucide-react';
import axios from 'axios';
import { API } from '../../App';
import { toast } from 'sonner';

const AdminAutomation = ({ onLogout }) => {
  const [loading, setLoading] = useState({});
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    fetchAutomationStatus();
  }, []);

  const fetchAutomationStatus = async () => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API}/admin/automation/status`, { headers });
      setAutomationEnabled(response.data.automation_enabled);
    } catch (error) {
      console.error('Failed to fetch automation status');
    }
  };

  const toggleAutomation = async () => {
    setToggleLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.put(`${API}/admin/automation/toggle`, {}, { headers });
      setAutomationEnabled(response.data.automation_enabled);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to toggle automation');
    } finally {
      setToggleLoading(false);
    }
  };

  const runAutomation = async (type, endpoint) => {
    setLoading({ ...loading, [type]: true });
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.post(`${API}${endpoint}`, {}, { headers });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.detail || `Failed to run ${type}`);
    } finally {
      setLoading({ ...loading, [type]: false });
    }
  };

  const automations = [
    {
      id: 'daily-roi',
      name: 'Daily ROI Calculation',
      description: 'Calculate and credit daily profits to all active investments',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      endpoint: '/admin/automation/run-daily-roi'
    },
    {
      id: 'referral-bonuses',
      name: 'Referral Bonuses',
      description: 'Distribute referral bonuses based on downline profits',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      endpoint: '/admin/automation/run-referral-bonuses'
    },
    {
      id: 'process-maturities',
      name: 'Process Maturities',
      description: 'Return principal to wallet for matured investments',
      icon: TrendingUp,
      color: 'from-amber-500 to-yellow-600',
      endpoint: '/admin/automation/process-maturities'
    },
    {
      id: 'reset-eligibility',
      name: 'Reset Withdrawal Eligibility',
      description: 'Reset weekly withdrawal eligibility for all users',
      icon: RefreshCw,
      color: 'from-blue-500 to-cyan-600',
      endpoint: '/admin/automation/reset-withdrawal-eligibility'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNavbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Automation Management</h1>
            <p className="text-slate-400">Control and manually trigger automated processes</p>
          </div>
          <Button
            onClick={toggleAutomation}
            disabled={toggleLoading}
            className={`${
              automationEnabled 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            } text-white px-6 py-6 text-lg`}
          >
            {automationEnabled ? (
              <>
                <PowerOff className="w-5 h-5 mr-2" />
                Stop Automation
              </>
            ) : (
              <>
                <Power className="w-5 h-5 mr-2" />
                Start Automation
              </>
            )}
          </Button>
        </div>

        {/* Status Card */}
        <Card className={`${
          automationEnabled 
            ? 'bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20' 
            : 'bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20'
        } p-6 mb-8`}>
          <div className="flex items-start gap-3">
            <div className={`text-2xl ${automationEnabled ? 'text-green-400' : 'text-red-400'}`}>
              {automationEnabled ? '✅' : '⛔'}
            </div>
            <div>
              <div className={`font-semibold mb-1 ${automationEnabled ? 'text-green-400' : 'text-red-400'}`}>
                Automation Status: {automationEnabled ? 'RUNNING' : 'STOPPED'}
              </div>
              <div className="text-sm text-slate-400">
                {automationEnabled ? (
                  <p>All automated cron jobs are currently running. Daily ROI, referral bonuses, and maturities are being processed automatically.</p>
                ) : (
                  <p>All automated cron jobs are currently stopped. You can manually trigger processes below or restart automation using the button above.</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-600/10 border border-amber-500/20 p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-amber-400 text-2xl">⚠️</div>
            <div>
              <div className="font-semibold text-amber-400 mb-1">Important Information</div>
              <div className="text-sm text-slate-400 space-y-1">
                <p>• These processes normally run automatically on schedule</p>
                <p>• Use manual triggers for testing or when automation is disabled</p>
                <p>• Daily ROI should be run before Referral Bonuses</p>
                <p>• Reset Withdrawal Eligibility should be run weekly (e.g., every Monday)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Automation Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {automations.map((auto) => {
            const Icon = auto.icon;
            return (
              <Card key={auto.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${auto.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{auto.name}</h3>
                    <p className="text-sm text-slate-400">{auto.description}</p>
                  </div>
                </div>
                <Button
                  data-testid={`run-${auto.id}-btn`}
                  onClick={() => runAutomation(auto.id, auto.endpoint)}
                  disabled={loading[auto.id]}
                  className={`w-full bg-gradient-to-r ${auto.color} hover:opacity-90 text-white`}
                >
                  {loading[auto.id] ? (
                    'Processing...'
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Now
                    </>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Schedule Info */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Automated Schedule</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
              <div>
                <div className="font-semibold">Daily ROI Calculation</div>
                <div className="text-sm text-slate-400">Runs every day at 12:00 AM UTC</div>
              </div>
              <div className="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Active</div>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
              <div>
                <div className="font-semibold">Referral Bonuses</div>
                <div className="text-sm text-slate-400">Runs every day at 12:30 AM UTC</div>
              </div>
              <div className="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Active</div>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
              <div>
                <div className="font-semibold">Process Maturities</div>
                <div className="text-sm text-slate-400">Runs every day at 1:00 AM UTC</div>
              </div>
              <div className="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Active</div>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <div className="font-semibold">Reset Withdrawal Eligibility</div>
                <div className="text-sm text-slate-400">Runs every Monday at 12:00 AM UTC</div>
              </div>
              <div className="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Active</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAutomation;