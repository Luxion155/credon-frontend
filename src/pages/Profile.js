import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';

const Profile = ({ onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API}/user/profile`, { headers });
      setProfile(response.data);
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Note: This endpoint would need to be implemented in the backend
      toast.info('Password change feature coming soon');
      setDialogOpen(false);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getLevelName = (level) => {
    if (level === 1) return 'Level 1 (Elite)';
    if (level === 2) return 'Level 2 (Advanced)';
    return 'Level 3 (Starter)';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-slate-400">Manage your account settings</p>
        </div>

        {profile && (
          <>
            {/* Profile Information */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">Account Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400 mb-1">Full Name</div>
                    <div data-testid="profile-full-name" className="text-lg font-semibold">{profile.full_name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400 mb-1">Email Address</div>
                    <div data-testid="profile-email" className="text-lg font-semibold">{profile.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400 mb-1">Referral Level</div>
                    <div data-testid="profile-level" className="text-lg font-semibold">{getLevelName(profile.level)}</div>
                    <div className="text-sm text-slate-500 mt-1">{profile.confirmed_referrals} confirmed referrals</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400 mb-1">Member Since</div>
                    <div data-testid="profile-joined-date" className="text-lg font-semibold">
                      {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Security Section */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">Security</h2>
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div>
                  <div className="font-semibold mb-1">Password</div>
                  <div className="text-sm text-slate-400">Last changed: Never</div>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      data-testid="change-password-btn"
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800/50"
                    >
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="currentPassword" className="text-slate-300">Current Password</Label>
                        <Input
                          data-testid="current-password-input"
                          id="currentPassword"
                          type="password"
                          value={passwords.currentPassword}
                          onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                          className="bg-slate-800/50 border-slate-700 text-white mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                        <Input
                          data-testid="new-password-input"
                          id="newPassword"
                          type="password"
                          value={passwords.newPassword}
                          onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                          className="bg-slate-800/50 border-slate-700 text-white mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
                        <Input
                          data-testid="confirm-new-password-input"
                          id="confirmPassword"
                          type="password"
                          value={passwords.confirmPassword}
                          onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                          className="bg-slate-800/50 border-slate-700 text-white mt-2"
                        />
                      </div>
                      <Button
                        data-testid="confirm-password-change-btn"
                        onClick={handlePasswordChange}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-red-500/5 border-red-500/20 p-6">
              <h2 className="text-2xl font-bold mb-4 text-red-400">Danger Zone</h2>
              <div className="space-y-3">
                <p className="text-sm text-slate-400">
                  Once you logout, you'll need to login again with your credentials.
                </p>
                <Button
                  data-testid="profile-logout-btn"
                  onClick={onLogout}
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                >
                  Logout from Account
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;