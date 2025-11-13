import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Trash2, DollarSign, Edit, Eye, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { API } from '../../App';
import { toast } from 'sonner';

const AdminUsers = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    password: ''
  });
  
  const [balanceUpdate, setBalanceUpdate] = useState({
    amount: '',
    operation: 'add'
  });
  
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API}/admin/users`, { headers });
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.full_name || !newUser.email || !newUser.password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post(`${API}/admin/users/create`, newUser, { headers });
      toast.success('User created successfully!');
      setCreateDialogOpen(false);
      setNewUser({ full_name: '', email: '', password: '' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to delete user ${userEmail}? This will delete all their data permanently.`)) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`${API}/admin/users/${userId}`, { headers });
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleUpdateBalance = async () => {
    if (!balanceUpdate.amount || isNaN(balanceUpdate.amount)) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(
        `${API}/admin/users/${selectedUser.id}/balance`,
        { amount: parseFloat(balanceUpdate.amount), operation: balanceUpdate.operation },
        { headers }
      );
      toast.success('Balance updated successfully!');
      setBalanceDialogOpen(false);
      setBalanceUpdate({ amount: '', operation: 'add' });
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update balance');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(
        `${API}/admin/users/${selectedUser.id}/reset-password`,
        null,
        { headers, params: { new_password: newPassword } }
      );
      toast.success('Password reset successfully!');
      setPasswordDialogOpen(false);
      setNewPassword('');
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserDetails = async (user) => {
    setSelectedUser(user);
    setDetailsDialogOpen(true);
    setLoadingDetails(true);
    
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API}/admin/users/${user.id}/details`, { headers });
      setUserDetails(response.data);
    } catch (error) {
      toast.error('Failed to load user details');
      setDetailsDialogOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.referral_code.toLowerCase().includes(search.toLowerCase())
  );

  const getLevelName = (level) => {
    if (level === 1) return 'Level 1';
    if (level === 2) return 'Level 2';
    return 'Level 3';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNavbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">User Management</h1>
          <p className="text-slate-400">View and manage all platform users</p>
        </div>

        {/* Search */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6 mb-6">
          <Input
            data-testid="admin-search-users-input"
            type="text"
            placeholder="Search by email or referral code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800/50 border-slate-700 text-white"
          />
        </Card>

        {/* Users List */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Users ({filteredUsers.length})</h2>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  data-testid="create-user-btn"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="full_name" className="text-slate-300">Full Name</Label>
                    <Input
                      data-testid="create-user-name-input"
                      id="full_name"
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                      className="bg-slate-800/50 border-slate-700 text-white mt-2"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-slate-300">Email</Label>
                    <Input
                      data-testid="create-user-email-input"
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="bg-slate-800/50 border-slate-700 text-white mt-2"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-slate-300">Password</Label>
                    <Input
                      data-testid="create-user-password-input"
                      id="password"
                      type="text"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="bg-slate-800/50 border-slate-700 text-white mt-2"
                      placeholder="Enter password"
                    />
                  </div>
                  <Button
                    data-testid="confirm-create-user-btn"
                    onClick={handleCreateUser}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    {loading ? 'Creating...' : 'Create User'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Referral Code</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Wallet Balance</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Referrals</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Level</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Joined</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <code className="text-amber-400 text-sm">{user.referral_code}</code>
                      </td>
                      <td className="py-3 px-4 font-semibold text-green-400">${user.wallet_balance?.toFixed(2)}</td>
                      <td className="py-3 px-4">{user.confirmed_referrals}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                          {getLevelName(user.level)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            data-testid={`view-details-${user.id}-btn`}
                            onClick={() => handleViewUserDetails(user)}
                            size="sm"
                            className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-0"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            data-testid={`update-balance-${user.id}-btn`}
                            onClick={() => {
                              setSelectedUser(user);
                              setBalanceDialogOpen(true);
                            }}
                            size="sm"
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0"
                            title="Update Balance"
                          >
                            <DollarSign className="w-4 h-4" />
                          </Button>
                          <Button
                            data-testid={`reset-password-${user.id}-btn`}
                            onClick={() => {
                              setSelectedUser(user);
                              setPasswordDialogOpen(true);
                            }}
                            size="sm"
                            className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-0"
                            title="Reset Password"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            data-testid={`delete-user-${user.id}-btn`}
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            size="sm"
                            variant="outline"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Balance Update Dialog */}
        <Dialog open={balanceDialogOpen} onOpenChange={setBalanceDialogOpen}>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-2xl">Update User Balance</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4 py-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">User</div>
                  <div className="font-semibold">{selectedUser.email}</div>
                  <div className="text-sm text-slate-400 mt-2">Current Balance</div>
                  <div className="text-2xl font-bold text-green-400">${selectedUser.wallet_balance?.toFixed(2)}</div>
                </div>
                
                <div>
                  <Label htmlFor="operation" className="text-slate-300">Operation</Label>
                  <Select value={balanceUpdate.operation} onValueChange={(val) => setBalanceUpdate({...balanceUpdate, operation: val})}>
                    <SelectTrigger data-testid="balance-operation-select" className="bg-slate-800/50 border-slate-700 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="add" className="text-white">Add to Balance</SelectItem>
                      <SelectItem value="set" className="text-white">Set Balance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount" className="text-slate-300">Amount (US Dollar Tether)</Label>
                  <Input
                    data-testid="balance-amount-input"
                    id="amount"
                    type="number"
                    value={balanceUpdate.amount}
                    onChange={(e) => setBalanceUpdate({...balanceUpdate, amount: e.target.value})}
                    className="bg-slate-800/50 border-slate-700 text-white mt-2"
                    placeholder="Enter amount"
                  />
                  {balanceUpdate.operation === 'add' && balanceUpdate.amount && (
                    <div className="text-sm text-slate-400 mt-2">
                      New balance will be: ${(selectedUser.wallet_balance + parseFloat(balanceUpdate.amount || 0)).toFixed(2)}
                    </div>
                  )}
                </div>

                <Button
                  data-testid="confirm-update-balance-btn"
                  onClick={handleUpdateBalance}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                >
                  {loading ? 'Updating...' : 'Update Balance'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Password Reset Dialog */}
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-2xl">Reset User Password</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4 py-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">User</div>
                  <div className="font-semibold">{selectedUser.email}</div>
                </div>
                
                <div>
                  <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                  <Input
                    data-testid="admin-new-password-input"
                    id="newPassword"
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white mt-2"
                    placeholder="Enter new password (min 6 characters)"
                  />
                  <div className="text-xs text-slate-500 mt-2">
                    User will be able to login with this new password immediately
                  </div>
                </div>

                <Button
                  data-testid="confirm-reset-password-btn"
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#c9a961] to-[#a08144] hover:from-[#d4b76a] hover:to-[#b89254] text-[#0a0f0a] font-semibold"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* User Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">User Details</DialogTitle>
            </DialogHeader>
            {loadingDetails ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-slate-400">Loading user details...</div>
              </div>
            ) : userDetails && selectedUser && (
              <div className="space-y-6 py-4">
                {/* User Info Card */}
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-400">Full Name</div>
                      <div className="text-lg font-semibold">{userDetails.user.full_name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Email</div>
                      <div className="text-lg font-semibold">{userDetails.user.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Referral Code</div>
                      <div className="text-lg font-semibold text-amber-400">{userDetails.user.referral_code}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Wallet Balance</div>
                      <div className="text-lg font-semibold text-green-400">${userDetails.user.wallet_balance?.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Level</div>
                      <div className="text-lg font-semibold">{getLevelName(userDetails.user.level)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Confirmed Referrals</div>
                      <div className="text-lg font-semibold">{userDetails.user.confirmed_referrals}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Referred By</div>
                      <div className="text-lg font-semibold">{userDetails.user.referred_by || 'None'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Joined</div>
                      <div className="text-lg font-semibold">{new Date(userDetails.user.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </Card>

                {/* Tabs for different sections */}
                <Tabs defaultValue="deposits" className="w-full">
                  <TabsList className="bg-slate-800/50 border border-slate-700">
                    <TabsTrigger value="deposits" className="data-[state=active]:bg-slate-700">
                      Deposits ({userDetails.deposits.length})
                    </TabsTrigger>
                    <TabsTrigger value="withdrawals" className="data-[state=active]:bg-slate-700">
                      Withdrawals ({userDetails.withdrawals.length})
                    </TabsTrigger>
                    <TabsTrigger value="investments" className="data-[state=active]:bg-slate-700">
                      Investments ({userDetails.investments.length})
                    </TabsTrigger>
                    <TabsTrigger value="referrals" className="data-[state=active]:bg-slate-700">
                      Referrals ({userDetails.referrals.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Deposits Tab */}
                  <TabsContent value="deposits" className="mt-4">
                    <Card className="bg-slate-800/50 border-slate-700 p-4">
                      <h4 className="text-lg font-semibold mb-4">Deposit History</h4>
                      {userDetails.deposits.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">No deposits found</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="text-left py-2 px-3 text-slate-400">Date</th>
                                <th className="text-left py-2 px-3 text-slate-400">Amount</th>
                                <th className="text-left py-2 px-3 text-slate-400">Status</th>
                                <th className="text-left py-2 px-3 text-slate-400">Transaction Hash</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userDetails.deposits.map((deposit) => (
                                <tr key={deposit.id} className="border-b border-slate-700/50">
                                  <td className="py-2 px-3 text-sm">{new Date(deposit.created_at).toLocaleString()}</td>
                                  <td className="py-2 px-3 text-sm font-semibold text-green-400">${deposit.amount?.toFixed(2)}</td>
                                  <td className="py-2 px-3">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      deposit.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                      deposit.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-red-500/20 text-red-400'
                                    }`}>
                                      {deposit.status}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 text-sm text-slate-400 font-mono">{deposit.transaction_hash || 'N/A'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card>
                  </TabsContent>

                  {/* Withdrawals Tab */}
                  <TabsContent value="withdrawals" className="mt-4">
                    <Card className="bg-slate-800/50 border-slate-700 p-4">
                      <h4 className="text-lg font-semibold mb-4">Withdrawal History</h4>
                      {userDetails.withdrawals.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">No withdrawals found</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="text-left py-2 px-3 text-slate-400">Date</th>
                                <th className="text-left py-2 px-3 text-slate-400">Amount</th>
                                <th className="text-left py-2 px-3 text-slate-400">Status</th>
                                <th className="text-left py-2 px-3 text-slate-400">Wallet Address</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userDetails.withdrawals.map((withdrawal) => (
                                <tr key={withdrawal.id} className="border-b border-slate-700/50">
                                  <td className="py-2 px-3 text-sm">{new Date(withdrawal.created_at).toLocaleString()}</td>
                                  <td className="py-2 px-3 text-sm font-semibold text-amber-400">${withdrawal.amount?.toFixed(2)}</td>
                                  <td className="py-2 px-3">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      withdrawal.status === 'approved' || withdrawal.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                      withdrawal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-red-500/20 text-red-400'
                                    }`}>
                                      {withdrawal.status}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 text-sm text-slate-400 font-mono">{withdrawal.wallet_address || 'N/A'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card>
                  </TabsContent>

                  {/* Investments Tab */}
                  <TabsContent value="investments" className="mt-4">
                    <Card className="bg-slate-800/50 border-slate-700 p-4">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Investment History
                      </h4>
                      {userDetails.investments.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">No investments found</p>
                      ) : (
                        <div className="space-y-3">
                          {userDetails.investments.map((investment) => (
                            <div key={investment.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="font-semibold text-lg">{investment.plan_name}</div>
                                  <div className="text-sm text-slate-400">{investment.daily_roi_percentage}% daily ROI</div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  investment.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                  investment.status === 'matured' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-slate-500/20 text-slate-400'
                                }`}>
                                  {investment.status}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                <div>
                                  <div className="text-xs text-slate-400">Principal</div>
                                  <div className="font-semibold text-amber-400">${investment.principal?.toFixed(2)}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-slate-400">Profit Earned</div>
                                  <div className="font-semibold text-green-400">${investment.total_profit_earned?.toFixed(2)}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-slate-400">Start Date</div>
                                  <div className="text-sm">{new Date(investment.start_date).toLocaleDateString()}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-slate-400">Maturity Date</div>
                                  <div className="text-sm">{new Date(investment.maturity_date).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </TabsContent>

                  {/* Referrals Tab */}
                  <TabsContent value="referrals" className="mt-4">
                    <Card className="bg-slate-800/50 border-slate-700 p-4">
                      <h4 className="text-lg font-semibold mb-4">Direct Referrals</h4>
                      {userDetails.referrals.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">No referrals found</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="text-left py-2 px-3 text-slate-400">Name</th>
                                <th className="text-left py-2 px-3 text-slate-400">Email</th>
                                <th className="text-left py-2 px-3 text-slate-400">Balance</th>
                                <th className="text-left py-2 px-3 text-slate-400">Joined</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userDetails.referrals.map((referral) => (
                                <tr key={referral.email} className="border-b border-slate-700/50">
                                  <td className="py-2 px-3">{referral.full_name}</td>
                                  <td className="py-2 px-3 text-sm">{referral.email}</td>
                                  <td className="py-2 px-3 font-semibold text-green-400">${referral.wallet_balance?.toFixed(2)}</td>
                                  <td className="py-2 px-3 text-sm text-slate-400">{new Date(referral.created_at).toLocaleDateString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      setBalanceDialogOpen(true);
                    }}
                    className="flex-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/50"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Update Balance
                  </Button>
                  <Button
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      setPasswordDialogOpen(true);
                    }}
                    className="flex-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Reset Password
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminUsers;