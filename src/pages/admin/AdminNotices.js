import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import axios from 'axios';
import { API } from '../../App';
import { toast } from 'sonner';

const AdminNotices = ({ onLogout }) => {
  const [notices, setNotices] = useState([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [newNotice, setNewNotice] = useState({
    title: '',
    message: '',
    type: 'info'
  });
  
  const [editNotice, setEditNotice] = useState({
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get(`${API}/admin/notices`, { headers });
      setNotices(response.data);
    } catch (error) {
      toast.error('Failed to load notices');
    }
  };

  const handleCreateNotice = async () => {
    if (!newNotice.title || !newNotice.message) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post(`${API}/admin/notices`, newNotice, { headers });
      toast.success('Notice created successfully!');
      setCreateDialogOpen(false);
      setNewNotice({ title: '', message: '', type: 'info' });
      fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create notice');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNotice = async () => {
    if (!editNotice.title || !editNotice.message) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(`${API}/admin/notices/${selectedNotice.id}`, editNotice, { headers });
      toast.success('Notice updated successfully!');
      setEditDialogOpen(false);
      setSelectedNotice(null);
      fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update notice');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotice = async (noticeId) => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.put(`${API}/admin/notices/${noticeId}/toggle`, {}, { headers });
      toast.success(`Notice ${response.data.is_active ? 'activated' : 'deactivated'} successfully`);
      fetchNotices();
    } catch (error) {
      toast.error('Failed to toggle notice');
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`${API}/admin/notices/${noticeId}`, { headers });
      toast.success('Notice deleted successfully');
      fetchNotices();
    } catch (error) {
      toast.error('Failed to delete notice');
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNavbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Notice Management</h1>
          <p className="text-slate-400">Create and manage platform announcements for users</p>
        </div>

        {/* Create Notice Button */}
        <div className="mb-6 flex justify-end">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">Create New Notice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title" className="text-slate-300">Title</Label>
                  <Input
                    id="title"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                    className="bg-slate-800/50 border-slate-700 text-white mt-2"
                    placeholder="Enter notice title"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-slate-300">Message</Label>
                  <Textarea
                    id="message"
                    value={newNotice.message}
                    onChange={(e) => setNewNotice({...newNotice, message: e.target.value})}
                    className="bg-slate-800/50 border-slate-700 text-white mt-2 min-h-[120px]"
                    placeholder="Enter notice message"
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-slate-300">Type</Label>
                  <Select value={newNotice.type} onValueChange={(val) => setNewNotice({...newNotice, type: val})}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="info" className="text-white">Info</SelectItem>
                      <SelectItem value="warning" className="text-white">Warning</SelectItem>
                      <SelectItem value="success" className="text-white">Success</SelectItem>
                      <SelectItem value="error" className="text-white">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleCreateNotice}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  {loading ? 'Creating...' : 'Create Notice'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Notices List */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            All Notices ({notices.length})
          </h2>
          
          {notices.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No notices created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div key={notice.id} className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{notice.title}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full border ${getTypeColor(notice.type)}`}>
                          {notice.type}
                        </span>
                        {notice.is_active ? (
                          <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                            Active
                          </span>
                        ) : (
                          <span className="text-xs px-3 py-1 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 whitespace-pre-wrap">{notice.message}</p>
                      <div className="mt-3 text-xs text-slate-500">
                        Created: {new Date(notice.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleToggleNotice(notice.id)}
                      size="sm"
                      className={`${notice.is_active ? 'bg-slate-500/20 text-slate-400 hover:bg-slate-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'} border-0`}
                    >
                      {notice.is_active ? (
                        <>
                          <ToggleRight className="w-4 h-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedNotice(notice);
                        setEditNotice({
                          title: notice.title,
                          message: notice.message,
                          type: notice.type
                        });
                        setEditDialogOpen(true);
                      }}
                      size="sm"
                      className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteNotice(notice.id)}
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

        {/* Edit Notice Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Edit Notice</DialogTitle>
            </DialogHeader>
            {selectedNotice && (
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="edit-title" className="text-slate-300">Title</Label>
                  <Input
                    id="edit-title"
                    value={editNotice.title}
                    onChange={(e) => setEditNotice({...editNotice, title: e.target.value})}
                    className="bg-slate-800/50 border-slate-700 text-white mt-2"
                    placeholder="Enter notice title"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-message" className="text-slate-300">Message</Label>
                  <Textarea
                    id="edit-message"
                    value={editNotice.message}
                    onChange={(e) => setEditNotice({...editNotice, message: e.target.value})}
                    className="bg-slate-800/50 border-slate-700 text-white mt-2 min-h-[120px]"
                    placeholder="Enter notice message"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type" className="text-slate-300">Type</Label>
                  <Select value={editNotice.type} onValueChange={(val) => setEditNotice({...editNotice, type: val})}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="info" className="text-white">Info</SelectItem>
                      <SelectItem value="warning" className="text-white">Warning</SelectItem>
                      <SelectItem value="success" className="text-white">Success</SelectItem>
                      <SelectItem value="error" className="text-white">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleEditNotice}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                >
                  {loading ? 'Updating...' : 'Update Notice'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminNotices;
