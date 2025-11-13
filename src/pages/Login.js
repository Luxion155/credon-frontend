import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import SupportForm from '../components/SupportForm';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '../App';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      toast.success('Login successful!');
      onLogin(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-slate-400">Login to your Credon account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <Input
              data-testid="login-email-input"
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
              data-testid="login-password-input"
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-white mt-2"
              required
            />
          </div>

          <Button
            data-testid="login-submit-btn"
            type="submit"
            className="w-full bg-gradient-to-r from-[#006039] to-[#004d2e] hover:from-[#007a47] hover:to-[#006039] text-[#f5f5f0] shadow-lg border border-[#c9a961]/20"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-[#c4c9c4]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#c9a961] hover:text-[#d4b76a]">
              Register here
            </Link>
          </p>
          <div className="pt-3 border-t border-slate-700">
            <button 
              onClick={() => setSupportOpen(true)}
              className="text-amber-400 hover:text-amber-300 text-sm"
            >
              Need help? Contact Support
            </button>
          </div>
        </div>
      </Card>
      
      <SupportForm 
        isOpen={supportOpen} 
        onClose={() => setSupportOpen(false)}
        userEmail=""
        userName=""
      />
    </div>
  );
};

export default Login;