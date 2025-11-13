import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SupportForm from '../components/SupportForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HelpCircle, Plus, Eye, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';

const MyTickets = ({ onLogout }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [supportFormOpen, setSupportFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API}/support/my-tickets`, { headers });
      setTickets(response.data);
    } catch (error) {
      toast.error('Failed to load your tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-5 h-5 text-blue-400" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'closed':
        return <XCircle className="w-5 h-5 text-slate-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-slate-400';
    }
  };

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f0a] via-[#0f140f] to-[#0a0f0a]">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Support Tickets</h1>
            <p className="text-slate-400">View and track your support requests</p>
          </div>
          <Button
            onClick={() => setSupportFormOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <div className="text-3xl font-bold text-blue-400 mb-1">{openCount}</div>
            <div className="text-slate-400 text-sm">Open</div>
          </Card>
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <div className="text-3xl font-bold text-yellow-400 mb-1">{inProgressCount}</div>
            <div className="text-slate-400 text-sm">In Progress</div>
          </Card>
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <div className="text-3xl font-bold text-green-400 mb-1">{resolvedCount}</div>
            <div className="text-slate-400 text-sm">Resolved</div>
          </Card>
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <div className="text-3xl font-bold text-slate-300 mb-1">{tickets.length}</div>
            <div className="text-slate-400 text-sm">Total Tickets</div>
          </Card>
        </div>

        {/* Tickets List */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6" />
            Your Tickets
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-slate-400">Loading tickets...</div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">You haven't submitted any support tickets yet</p>
              <Button
                onClick={() => setSupportFormOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Ticket
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50 hover:border-amber-500/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(ticket.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <span className={`text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <p className="text-slate-300 mb-3 line-clamp-2">{ticket.message}</p>
                        <div className="flex gap-4 text-xs text-slate-500">
                          <div>Created: <span className="text-slate-400">{new Date(ticket.created_at).toLocaleString()}</span></div>
                          <div>Updated: <span className="text-slate-400">{new Date(ticket.updated_at).toLocaleString()}</span></div>
                          {ticket.resolved_at && (
                            <div>Resolved: <span className="text-green-400">{new Date(ticket.resolved_at).toLocaleString()}</span></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewTicket(ticket)}
                    size="sm"
                    className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Ticket Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-amber-400" />
                Ticket Details
              </DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-6 py-4">
                {/* Status Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(selectedTicket.status)}
                    <span className={`text-sm px-4 py-2 rounded-full border font-semibold ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`text-sm font-bold ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>

                {/* Ticket Info */}
                <Card className="bg-slate-800/50 border-slate-700 p-4">
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-400">Ticket ID:</span>
                      <span className="ml-2 text-white font-mono">{selectedTicket.id.substring(0, 8)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Created:</span>
                      <span className="ml-2 text-white">{new Date(selectedTicket.created_at).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Last Updated:</span>
                      <span className="ml-2 text-white">{new Date(selectedTicket.updated_at).toLocaleString()}</span>
                    </div>
                    {selectedTicket.resolved_at && (
                      <div>
                        <span className="text-slate-400">Resolved:</span>
                        <span className="ml-2 text-green-400">{new Date(selectedTicket.resolved_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Subject */}
                <div>
                  <h4 className="font-semibold mb-2 text-slate-300">Subject</h4>
                  <p className="text-white bg-slate-800/50 p-4 rounded-lg border border-slate-700">{selectedTicket.subject}</p>
                </div>

                {/* Your Message */}
                <div>
                  <h4 className="font-semibold mb-2 text-slate-300">Your Message</h4>
                  <p className="text-white bg-slate-800/50 p-4 rounded-lg whitespace-pre-wrap border border-slate-700">{selectedTicket.message}</p>
                </div>

                {/* Admin Response */}
                {selectedTicket.admin_notes && (
                  <div className="bg-gradient-to-br from-amber-500/10 to-yellow-600/10 border border-amber-500/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-400">
                      <CheckCircle className="w-5 h-5" />
                      Admin Response
                    </h4>
                    <p className="text-slate-200 whitespace-pre-wrap">{selectedTicket.admin_notes}</p>
                  </div>
                )}

                {/* Status Message */}
                {selectedTicket.status === 'resolved' && (
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">This ticket has been resolved</span>
                    </div>
                    <p className="text-slate-300 text-sm mt-2">
                      If you still need assistance, please create a new support ticket.
                    </p>
                  </div>
                )}

                {selectedTicket.status === 'in_progress' && (
                  <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">Our team is working on your ticket</span>
                    </div>
                    <p className="text-slate-300 text-sm mt-2">
                      We'll update you as soon as we have more information.
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Support Form */}
        <SupportForm 
          isOpen={supportFormOpen} 
          onClose={() => {
            setSupportFormOpen(false);
            fetchMyTickets(); // Refresh tickets after creating new one
          }}
          userEmail={user.email || ''}
          userName={user.full_name || ''}
        />
      </div>
    </div>
  );
};

export default MyTickets;
