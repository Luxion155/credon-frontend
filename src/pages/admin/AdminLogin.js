import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '../../App';

const AdminLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/admin/auth/login`, formData);
      toast.success('Admin login successful!');
      onLogin(response.data.token, response.data.admin);
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-slate-400">Access Credon Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-slate-300">Admin Email</Label>
            <Input
              data-testid="admin-login-email-input"
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-white mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-slate-300">Password</Label>
            <Input
              data-testid="admin-login-password-input"
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-white mt-2"
              required
            />
          </div>

          <Button
            data-testid="admin-login-submit-btn"
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Admin Login'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;