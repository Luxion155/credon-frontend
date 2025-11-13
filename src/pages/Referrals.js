import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Users, DollarSign, Share2 } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';

const Referrals = ({ onLogout }) => {
  const [referrals, setReferrals] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [referralsRes, profileRes] = await Promise.all([
        axios.get(`${API}/referrals/my-referrals`, { headers }),
        axios.get(`${API}/user/profile`, { headers })
      ]);

      setReferrals(referralsRes.data);
      setProfile(profileRes.data);
    } catch (error) {
      toast.error('Failed to load referral data');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referrals?.referral_code || '');
    toast.success('Referral code copied!');
  };

  const getLevelName = (level) => {
    if (level === 1) return 'Level 1 (Elite)';
    if (level === 2) return 'Level 2 (Advanced)';
    return 'Level 3 (Starter)';
  };

  const getLevelRequirement = (level) => {
    if (level === 1) return '30+ confirmed referrals';
    if (level === 2) return '15-29 confirmed referrals';
    return '0-14 confirmed referrals';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Referral Program</h1>
          <p className="text-slate-400">Invite friends and earn up to 20% bonus from their profits</p>
        </div>

        {/* Referral Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div data-testid="direct-referrals-count" className="text-3xl font-bold mb-1">{referrals?.direct_referrals || 0}</div>
            <div className="text-slate-400 text-sm">Direct Referrals</div>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div data-testid="total-bonus-earned" className="text-3xl font-bold mb-1 text-green-400">${referrals?.total_bonus_earned?.toFixed(2) || '0.00'}</div>
            <div className="text-slate-400 text-sm">Total Bonus Earned</div>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{getLevelName(profile?.level || 3)}</div>
            <div className="text-slate-400 text-sm">{getLevelRequirement(profile?.level || 3)}</div>
          </Card>
        </div>

        {/* Referral Code */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Referral Code</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-slate-400 mb-2">Share this code with your friends</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <code data-testid="referral-code" className="text-2xl font-bold text-amber-400">{referrals?.referral_code}</code>
                </div>
                <Button
                  data-testid="copy-referral-code-btn"
                  onClick={handleCopyCode}
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Your friends need to enter this code during registration to be linked to your account
              </div>
            </div>
          </div>
        </Card>

        {/* Referral Structure */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Referral Commission Structure</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-xl p-6">
              <div className="text-4xl font-bold text-purple-400 mb-2">20%</div>
              <div className="text-lg font-semibold mb-1">Level 1</div>
              <div className="text-sm text-slate-400">Direct referrals - earn 20% of their daily profits</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-500/20 rounded-xl p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">15%</div>
              <div className="text-lg font-semibold mb-1">Level 2</div>
              <div className="text-sm text-slate-400">Second level - earn 15% of their daily profits</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-6">
              <div className="text-4xl font-bold text-green-400 mb-2">10%</div>
              <div className="text-lg font-semibold mb-1">Level 3</div>
              <div className="text-sm text-slate-400">Third level - earn 10% of their daily profits</div>
            </div>
          </div>
        </Card>

        {/* Referral List */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
          <h2 className="text-2xl font-bold mb-6">My Referrals</h2>
          {referrals?.referrals?.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No referrals yet. Start sharing your code!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals?.referrals?.map((ref, idx) => (
                <div key={idx} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{ref.email}</div>
                      <div className="text-sm text-slate-400">
                        Joined: {new Date(ref.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Confirmed Referrals</div>
                      <div className="text-lg font-bold">{ref.confirmed_referrals || 0}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Referrals;