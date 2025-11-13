import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '../App';

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referral_code: refCode || ''
  });
  const [loading, setLoading] = useState(false);
  const [referralStatus, setReferralStatus] = useState(null);
  const [checkingReferral, setCheckingReferral] = useState(false);

  useEffect(() => {
    if (formData.referral_code && formData.referral_code.length >= 6) {
      validateReferralCode(formData.referral_code);
    } else {
      setReferralStatus(null);
    }
  }, [formData.referral_code]);

  const validateReferralCode = async (code) => {
    setCheckingReferral(true);
    try {
      const response = await axios.get(`${API}/auth/validate-referral/${code}`);
      setReferralStatus(response.data);
    } catch (error) {
      setReferralStatus({ valid: false });
    } finally {
      setCheckingReferral(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/auth/register`, {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        referral_code: formData.referral_code || null
      });
      toast.success('Registration successful!');
      onLogin(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a961] to-[#a08144] flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-[#0a0f0a]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-[#f5f5f0]">Create Account</h1>
          <p className="text-[#c4c9c4]">Start your investment journey with Credon</p>
        </div>

        {/* Critical Password Warning */}
        <div className="mb-6 bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-400 mb-2 text-sm">⚠️ CRITICAL: Password Cannot Be Changed</h3>
              <div className="text-xs text-red-300 space-y-1">
                <p className="font-semibold">• You will NOT be able to change your password later</p>
                <p className="font-semibold">• Write down your password in a safe place NOW</p>
                <p className="font-semibold">• Lost passwords mean PERMANENT account loss</p>
                <p className="font-semibold">• No password recovery option available</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
            <Input
              data-testid="register-full-name-input"
              id="fullName"
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-white mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <Input
              data-testid="register-email-input"
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
              data-testid="register-password-input"
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-white mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
            <Input
              data-testid="register-confirm-password-input"
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="bg-slate-800/50 border-slate-700 text-white mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="referralCode" className="text-slate-300">Referral Code (Optional)</Label>
            <div className="relative">
              <Input
                data-testid="register-referral-code-input"
                id="referralCode"
                type="text"
                value={formData.referral_code}
                onChange={(e) => setFormData({ ...formData, referral_code: e.target.value.toUpperCase() })}
                className="bg-slate-800/50 border-slate-700 text-white mt-2 pr-10"
                placeholder="Enter referral code if you have one"
              />
              {formData.referral_code && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-1">
                  {checkingReferral ? (
                    <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  ) : referralStatus?.valid ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              )}
            </div>
            {referralStatus?.valid && (
              <div className="text-sm text-green-400 mt-1">
                ✓ Valid code from {referralStatus.referrer_name}
              </div>
            )}
            {referralStatus !== null && !referralStatus.valid && formData.referral_code && (
              <div className="text-sm text-red-400 mt-1">
                ✗ Invalid referral code
              </div>
            )}
          </div>

          <Button
            data-testid="register-submit-btn"
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300">
              Login here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;