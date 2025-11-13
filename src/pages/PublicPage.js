import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, FileText, Download, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';

const PublicPage = ({ pageType, backLink = '/' }) => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageContent();
  }, [pageType]);

  const fetchPageContent = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/pages/${pageType}`);
      setPageContent(response.data);
    } catch (error) {
      toast.error('Failed to load page content');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = (document) => {
    const link = window.document.createElement('a');
    link.href = document.data;
    link.download = document.name;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <nav className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/90 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#c9a961] to-[#a08144] flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-[#0a0f0a]" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#c9a961] to-[#d4b76a] bg-clip-text text-transparent tracking-tight">
                CREDON
              </span>
            </Link>
            <Link to={backLink}>
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-slate-400">Loading...</div>
          </div>
        ) : pageContent ? (
          <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#c9a961] to-[#d4b76a] bg-clip-text text-transparent">
              {pageContent.title}
            </h1>
            <div className="text-sm text-slate-500 mb-8">
              Last updated: {new Date(pageContent.updated_at).toLocaleDateString()}
            </div>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-8 mb-8">
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {pageContent.content}
                </div>
              </div>
            </Card>

            {/* Documents Section */}
            {pageContent.documents && pageContent.documents.length > 0 && (
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-amber-400" />
                  Documents & Certificates
                </h2>
                <div className="space-y-3">
                  {pageContent.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 flex items-center justify-between hover:border-amber-500/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <div>
                          <div className="font-semibold">{doc.name}</div>
                          <div className="text-xs text-slate-500">
                            Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownloadDocument(doc)}
                        size="sm"
                        className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-0"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-slate-400">Page content not available</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPage;
