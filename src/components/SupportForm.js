import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';

const SupportForm = ({ isOpen, onClose, userEmail = '', userName = '' }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_email: userEmail,
    user_name: userName,
    subject: '',
    message: ''
  });

  const handleSubmit = async () => {
    if (!formData.user_email || !formData.user_name || !formData.subject || !formData.message) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/support/create`, formData);
      toast.success(response.data.message);
      onClose();
      setFormData({
        user_email: userEmail,
        user_name: userName,
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit support ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-400" />
            Contact Support
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="support-name" className="text-slate-300">Your Name</Label>
            <Input
              id="support-name"
              value={formData.user_name}
              onChange={(e) => setFormData({...formData, user_name: e.target.value})}
              className="bg-slate-800/50 border-slate-700 text-white mt-2"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <Label htmlFor="support-email" className="text-slate-300">Email Address</Label>
            <Input
              id="support-email"
              type="email"
              value={formData.user_email}
              onChange={(e) => setFormData({...formData, user_email: e.target.value})}
              className="bg-slate-800/50 border-slate-700 text-white mt-2"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="support-subject" className="text-slate-300">Subject</Label>
            <Input
              id="support-subject"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="bg-slate-800/50 border-slate-700 text-white mt-2"
              placeholder="Brief description of your issue"
            />
          </div>
          <div>
            <Label htmlFor="support-message" className="text-slate-300">Message</Label>
            <Textarea
              id="support-message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="bg-slate-800/50 border-slate-700 text-white mt-2 min-h-[150px]"
              placeholder="Please describe your issue in detail..."
            />
          </div>
          <div className="text-xs text-slate-500">
            We typically respond within 24 hours. Please check your email for updates on your ticket.
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white"
          >
            {loading ? 'Submitting...' : 'Submit Support Ticket'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportForm;
