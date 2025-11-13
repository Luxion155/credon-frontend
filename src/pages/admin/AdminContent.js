import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Trash2, Download, Save } from 'lucide-react';
import axios from 'axios';
import { API } from '../../App';
import { toast } from 'sonner';

const AdminContent = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState({
    announcements: { title: '', content: '', documents: [] },
    about_us: { title: '', content: '', documents: [] },
    legal: { title: '', content: '', documents: [] }
  });

  useEffect(() => {
    fetchAllPages();
  }, []);

  const fetchAllPages = async () => {
    const pageTypes = ['announcements', 'about_us', 'legal'];
    
    for (const pageType of pageTypes) {
      try {
        const response = await axios.get(`${API}/pages/${pageType}`);
        setPages(prev => ({
          ...prev,
          [pageType]: response.data
        }));
      } catch (error) {
        console.error(`Failed to load ${pageType}:`, error);
      }
    }
  };

  const handleSavePage = async (pageType) => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(
        `${API}/admin/pages/${pageType}`,
        {
          title: pages[pageType].title,
          content: pages[pageType].content,
          documents: pages[pageType].documents
        },
        { headers }
      );
      toast.success('Page content saved successfully!');
      fetchAllPages();
    } catch (error) {
      toast.error('Failed to save page content');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (pageType, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const response = await axios.post(
          `${API}/admin/pages/${pageType}/upload-document`,
          null,
          { 
            headers,
            params: {
              file_name: file.name,
              file_data: base64Data
            }
          }
        );
        toast.success('Document uploaded successfully!');
        fetchAllPages();
      } catch (error) {
        toast.error('Failed to upload document');
      } finally {
        setLoading(false);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleDeleteDocument = async (pageType, documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(
        `${API}/admin/pages/${pageType}/documents/${documentId}`,
        { headers }
      );
      toast.success('Document deleted successfully');
      fetchAllPages();
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleDownloadDocument = (document) => {
    // Create a download link
    const link = window.document.createElement('a');
    link.href = document.data;
    link.download = document.name;
    link.click();
  };

  const updatePageContent = (pageType, field, value) => {
    setPages(prev => ({
      ...prev,
      [pageType]: {
        ...prev[pageType],
        [field]: value
      }
    }));
  };

  const renderPageEditor = (pageType, displayName) => {
    const page = pages[pageType];

    return (
      <div className="space-y-6">
        <div>
          <Label htmlFor={`${pageType}-title`} className="text-slate-300">Page Title</Label>
          <Input
            id={`${pageType}-title`}
            value={page.title}
            onChange={(e) => updatePageContent(pageType, 'title', e.target.value)}
            className="bg-slate-800/50 border-slate-700 text-white mt-2"
            placeholder={`Enter ${displayName} title`}
          />
        </div>

        <div>
          <Label htmlFor={`${pageType}-content`} className="text-slate-300">Page Content</Label>
          <Textarea
            id={`${pageType}-content`}
            value={page.content}
            onChange={(e) => updatePageContent(pageType, 'content', e.target.value)}
            className="bg-slate-800/50 border-slate-700 text-white mt-2 min-h-[400px] font-mono text-sm"
            placeholder={`Enter ${displayName} content (supports markdown)`}
          />
          <div className="text-xs text-slate-500 mt-2">
            Tip: Use markdown formatting for better text structure
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-slate-300">Documents & Certificates</Label>
            <div>
              <input
                type="file"
                id={`${pageType}-file`}
                className="hidden"
                onChange={(e) => handleFileUpload(pageType, e)}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Button
                onClick={() => document.getElementById(`${pageType}-file`).click()}
                size="sm"
                className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>

          {page.documents && page.documents.length > 0 ? (
            <div className="space-y-2">
              {page.documents.map((doc) => (
                <div key={doc.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="font-semibold text-sm">{doc.name}</div>
                      <div className="text-xs text-slate-500">
                        Uploaded {new Date(doc.uploaded_at).toLocaleDateString()} by {doc.uploaded_by}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDownloadDocument(doc)}
                      size="sm"
                      className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-0"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteDocument(pageType, doc.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No documents uploaded yet</p>
            </div>
          )}
        </div>

        <Button
          onClick={() => handleSavePage(pageType)}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Page Content'}
        </Button>

        <div className="text-xs text-slate-500 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
          <strong>Note:</strong> Changes will be visible immediately to all users after saving.
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNavbar onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Content Management</h1>
          <p className="text-slate-400">Manage announcements, about us, and legal pages</p>
        </div>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800/50 border border-slate-700 mb-6">
              <TabsTrigger value="announcements" className="data-[state=active]:bg-slate-700">
                Announcements
              </TabsTrigger>
              <TabsTrigger value="about_us" className="data-[state=active]:bg-slate-700">
                About Us
              </TabsTrigger>
              <TabsTrigger value="legal" className="data-[state=active]:bg-slate-700">
                Legal & Terms
              </TabsTrigger>
            </TabsList>

            <TabsContent value="announcements">
              {renderPageEditor('announcements', 'Announcements')}
            </TabsContent>

            <TabsContent value="about_us">
              {renderPageEditor('about_us', 'About Us')}
            </TabsContent>

            <TabsContent value="legal">
              {renderPageEditor('legal', 'Legal & Terms')}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AdminContent;
