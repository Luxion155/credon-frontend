import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, CheckCircle, Clock, AlertCircle, Trash2, Eye } from 'lucide-react';
import axios from 'axios';
import { API } from '../../App';
import { toast } from 'sonner';

const AdminSupport = ({ onLogout }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const [ticketUpdate, setTicketUpdate] = useState({
    status: '',
    priority: '',
    admin_notes: ''
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async (status = null) => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const url = status ? `${API}/admin/support/tickets?status=${status}` : `${API}/admin/support/tickets`;
      const response = await axios.get(url, { headers });
      setTickets(response.data);
    } catch (error) {
      toast.error('Failed to load tickets');
    }
  };

  const handleViewTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setTicketUpdate({
      status: ticket.status,
      priority: ticket.priority,
      admin_notes: ticket.admin_notes || ''
    });
    setDetailsOpen(true);
  };

  const handleUpdateTicket = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(`${API}/admin/support/tickets/${selectedTicket.id}`, ticketUpdate, { headers });
      toast.success('Ticket updated successfully');
      setDetailsOpen(false);
      fetchTickets();
    } catch (error) {
      toast.error('Failed to update ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`${API}/admin/support/tickets/${ticketId}`, { headers });
      toast.success('Ticket deleted successfully');
      fetchTickets();
    } catch (error) {
      toast.error('Failed to delete ticket');
    }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-5 h-5 text-blue-400" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const filterTickets = () => {
    if (filter === 'all') return tickets;
    return tickets.filter(ticket => ticket.status === filter);
  };

  const filteredTickets = filterTickets();
  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNavbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Support Tickets</h1>
          <p className="text-slate-400">Manage and respond to user support requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
            <div className="text-3xl font-bold text-blue-400 mb-1">{openCount}</div>
            <div className="text-slate-400 text-sm">Open Tickets</div>
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
            <div className="text-3xl font-bold text-slate-400 mb-1">{tickets.length}</div>
            <div className="text-slate-400 text-sm">Total Tickets</div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">
              All ({tickets.length})
            </TabsTrigger>
            <TabsTrigger value="open" className="data-[state=active]:bg-slate-700">
              Open ({openCount})
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="data-[state=active]:bg-slate-700">
              In Progress ({inProgressCount})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="data-[state=active]:bg-slate-700">
              Resolved ({resolvedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Tickets List */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No support tickets found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(ticket.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <span className={`text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <p className="text-slate-300 mb-3">{ticket.message.substring(0, 150)}...</p>
                        <div className="flex gap-4 text-xs text-slate-500">
                          <div>From: <span className="text-slate-400 font-semibold">{ticket.user_name}</span></div>
                          <div>Email: <span className="text-slate-400">{ticket.user_email}</span></div>
                          <div>Created: <span className="text-slate-400">{new Date(ticket.created_at).toLocaleString()}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewTicket(ticket)}
                      size="sm"
                      className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View & Respond
                    </Button>
                    <Button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
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
                Support Ticket Details
              </DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-6 py-4">
                {/* User Info */}
                <Card className="bg-slate-800/50 border-slate-700 p-4">
                  <h4 className="font-semibold mb-3">User Information</h4>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-400">Name:</span>
                      <span className="ml-2 text-white font-semibold">{selectedTicket.user_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Email:</span>
                      <span className="ml-2 text-white">{selectedTicket.user_email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Created:</span>
                      <span className="ml-2 text-white">{new Date(selectedTicket.created_at).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Last Updated:</span>
                      <span className="ml-2 text-white">{new Date(selectedTicket.updated_at).toLocaleString()}</span>
                    </div>
                  </div>
                </Card>

                {/* Ticket Content */}
                <div>
                  <h4 className="font-semibold mb-2">Subject</h4>
                  <p className="text-slate-300 bg-slate-800/50 p-3 rounded-lg">{selectedTicket.subject}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Message</h4>
                  <p className="text-slate-300 bg-slate-800/50 p-4 rounded-lg whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>

                {/* Update Form */}
                <div className="space-y-4 border-t border-slate-700 pt-6">
                  <h4 className="font-semibold">Update Ticket</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Status</Label>
                      <Select value={ticketUpdate.status} onValueChange={(val) => setTicketUpdate({...ticketUpdate, status: val})}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="open" className="text-white">Open</SelectItem>
                          <SelectItem value="in_progress" className="text-white">In Progress</SelectItem>
                          <SelectItem value="resolved" className="text-white">Resolved</SelectItem>
                          <SelectItem value="closed" className="text-white">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300">Priority</Label>
                      <Select value={ticketUpdate.priority} onValueChange={(val) => setTicketUpdate({...ticketUpdate, priority: val})}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="low" className="text-white">Low</SelectItem>
                          <SelectItem value="medium" className="text-white">Medium</SelectItem>
                          <SelectItem value="high" className="text-white">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">Admin Notes (Internal)</Label>
                    <Textarea
                      value={ticketUpdate.admin_notes}
                      onChange={(e) => setTicketUpdate({...ticketUpdate, admin_notes: e.target.value})}
                      className="bg-slate-800/50 border-slate-700 text-white mt-2 min-h-[100px]"
                      placeholder="Add internal notes about this ticket..."
                    />
                  </div>

                  <Button
                    onClick={handleUpdateTicket}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    {loading ? 'Updating...' : 'Update Ticket'}
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

export default AdminSupport;
