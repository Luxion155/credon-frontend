import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, LayoutDashboard, Users, DollarSign, TrendingDown, TrendingUp, Settings, LogOut, Bell, HelpCircle, FileText } from 'lucide-react';

const AdminNavbar = ({ onLogout }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/deposits', label: 'Deposits', icon: DollarSign },
    { path: '/admin/withdrawals', label: 'Withdrawals', icon: TrendingDown },
    { path: '/admin/investments', label: 'Investments', icon: TrendingUp },
    { path: '/admin/notices', label: 'Notices', icon: Bell },
    { path: '/admin/support', label: 'Support', icon: HelpCircle },
    { path: '/admin/content', label: 'Content', icon: FileText },
    { path: '/admin/automation', label: 'Automation', icon: Settings },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent">Admin Panel</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    data-testid={`admin-nav-${item.label.toLowerCase()}-btn`}
                    variant="ghost"
                    className={`text-slate-300 hover:text-white hover:bg-slate-800/50 ${
                      isActive ? 'bg-slate-800/50 text-white' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
          
          <Button
            data-testid="admin-logout-btn"
            onClick={onLogout}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;