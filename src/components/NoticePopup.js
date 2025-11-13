import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';

const NoticePopup = () => {
  const [notices, setNotices] = useState([]);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchActiveNotices();
  }, []);

  const fetchActiveNotices = async () => {
    try {
      const response = await axios.get(`${API}/notices/active`);
      const activeNotices = response.data;
      
      // Filter out dismissed notices
      const dismissedNotices = JSON.parse(localStorage.getItem('dismissedNotices') || '[]');
      const unreadNotices = activeNotices.filter(
        notice => !dismissedNotices.includes(notice.id)
      );
      
      if (unreadNotices.length > 0) {
        setNotices(unreadNotices);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    }
  };

  const handleDismiss = () => {
    if (notices.length > 0) {
      const currentNotice = notices[currentNoticeIndex];
      
      // Save dismissed notice
      const dismissedNotices = JSON.parse(localStorage.getItem('dismissedNotices') || '[]');
      dismissedNotices.push(currentNotice.id);
      localStorage.setItem('dismissedNotices', JSON.stringify(dismissedNotices));
      
      // Show next notice or close
      if (currentNoticeIndex < notices.length - 1) {
        setCurrentNoticeIndex(currentNoticeIndex + 1);
      } else {
        setIsOpen(false);
      }
    }
  };

  const handleDismissAll = () => {
    // Dismiss all current notices
    const dismissedNotices = JSON.parse(localStorage.getItem('dismissedNotices') || '[]');
    notices.forEach(notice => {
      if (!dismissedNotices.includes(notice.id)) {
        dismissedNotices.push(notice.id);
      }
    });
    localStorage.setItem('dismissedNotices', JSON.stringify(dismissedNotices));
    setIsOpen(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'info':
        return <Info className="w-8 h-8 text-blue-400" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-400" />;
      default:
        return <Info className="w-8 h-8 text-blue-400" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info':
        return 'border-blue-500/30';
      case 'warning':
        return 'border-yellow-500/30';
      case 'success':
        return 'border-green-500/30';
      case 'error':
        return 'border-red-500/30';
      default:
        return 'border-slate-500/30';
    }
  };

  if (notices.length === 0) return null;

  const currentNotice = notices[currentNoticeIndex];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={`bg-slate-900 border-2 ${getTypeColor(currentNotice.type)} max-w-2xl`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            {getIcon(currentNotice.type)}
            {currentNotice.title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-slate-300 whitespace-pre-wrap text-lg leading-relaxed">
            {currentNotice.message}
          </p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <div className="text-sm text-slate-500">
            {notices.length > 1 && `${currentNoticeIndex + 1} of ${notices.length} notices`}
          </div>
          <div className="flex gap-3">
            {notices.length > 1 && (
              <Button
                onClick={handleDismissAll}
                variant="outline"
                className="border-slate-700 text-slate-400 hover:bg-slate-800"
              >
                Dismiss All
              </Button>
            )}
            <Button
              onClick={handleDismiss}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white"
            >
              {currentNoticeIndex < notices.length - 1 ? 'Next' : 'Got it'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoticePopup;
