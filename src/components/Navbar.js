import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, LayoutDashboard, TrendingDown, DollarSign, LogOut, Users, FileText, User, HelpCircle, Bell, Info, Scale } from 'lucide-react';
import SupportForm from './SupportForm';

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/investments', label: 'Investments', icon: TrendingUp },
    { path: '/deposit', label: 'Deposit', icon: DollarSign },
    { path: '/withdraw', label: 'Withdraw', icon: TrendingDown },
    { path: '/referrals', label: 'Referrals', icon: Users },
    { path: '/transactions', label: 'Transactions', icon: FileText },
    { path: '/my-tickets', label: 'My Tickets', icon: HelpCircle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="border-b border-[#006039]/30 backdrop-blur-sm bg-[#0a0f0a]/90 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#c9a961] to-[#a08144] flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-[#0a0f0a]" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#c9a961] to-[#d4b76a] bg-clip-text text-transparent tracking-tight">CREDON</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    data-testid={`nav-${item.label.toLowerCase()}-btn`}
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
            
            {/* Info Pages Dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-800/50"
              >
                <Info className="w-4 h-4 mr-2" />
                Info
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/announcements" className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-t-lg">
                  <Bell className="w-4 h-4 inline mr-2" />
                  Announcements
                </Link>
                <Link to="/about" className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                  <Info className="w-4 h-4 inline mr-2" />
                  About Us
                </Link>
                <Link to="/legal" className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-b-lg">
                  <Scale className="w-4 h-4 inline mr-2" />
                  Legal & Terms
                </Link>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setSupportOpen(true)}
              variant="outline"
              size="sm"
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Support</span>
            </Button>
            <Button
              data-testid="nav-logout-btn"
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50"
            >
              <LogOut className="w-4 h-4 lg:mr-2" />
              <span className="hidden lg:inline">Logout</span>
            </Button>
            
            <Button
              data-testid="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    data-testid={`mobile-nav-${item.label.toLowerCase()}-btn`}
                    variant="ghost"
                    className={`w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/50 ${
                      isActive ? 'bg-slate-800/50 text-white' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            
            {/* Info Pages Section */}
            <div className="pt-4 mt-4 border-t border-slate-700">
              <div className="text-xs text-slate-500 uppercase font-semibold mb-2 px-3">Information</div>
              <Link to="/announcements" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/50"
                >
                  <Bell className="w-4 h-4 mr-3" />
                  Announcements
                </Button>
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/50"
                >
                  <Info className="w-4 h-4 mr-3" />
                  About Us
                </Button>
              </Link>
              <Link to="/legal" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/50"
                >
                  <Scale className="w-4 h-4 mr-3" />
                  Legal & Terms
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <SupportForm 
        isOpen={supportOpen} 
        onClose={() => setSupportOpen(false)}
        userEmail={user.email || ''}
        userName={user.full_name || ''}
      />
    </nav>
  );
};

export default Navbar;