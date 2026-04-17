import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LogOut, LayoutGrid, Globe, Eye, ArrowLeft, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import SortableWebsiteList from '../components/admin/SortableWebsiteList.jsx';
import WebsiteFormModal from '../components/admin/WebsiteFormModal.jsx';
import api from '../utils/api.js';

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { fetchWebsites(); }, []);

  async function fetchWebsites() {
    try {
      const { data } = await api.get('/websites');
      setWebsites(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(formData) {
    try {
      if (editing) {
        const { data } = await api.put(`/websites/${editing._id}`, formData);
        setWebsites((prev) => prev.map((w) => w._id === data._id ? data : w));
        toast.success('Project updated!');
      } else {
        const { data } = await api.post('/websites', formData);
        setWebsites((prev) => [...prev, data]);
        toast.success('Project created!');
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(err.message || 'Save failed');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    try {
      await api.delete(`/websites/${id}`);
      setWebsites((prev) => prev.filter((w) => w._id !== id));
      toast.success('Project deleted');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  }

  function handleEdit(website) {
    setEditing(website);
    setModalOpen(true);
  }

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  async function handleReorder(reordered) {
    setWebsites(reordered);   // optimistic update
    try {
      await api.put('/websites/reorder', { orderedIds: reordered.map((w) => w._id) });
    } catch {
      toast.error('Reorder failed — refresh to reset');
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/admin/login', { replace: true });
  }

  const stats = [
    { label: 'Total', value: websites.length, icon: LayoutGrid, color: 'text-indigo-400' },
    { label: 'Live', value: websites.filter((w) => w.status === 'Live').length, icon: Globe, color: 'text-emerald-400' },
    { label: 'Views', value: websites.reduce((a, w) => a + (w.visitors || 0), 0), icon: Eye, color: 'text-violet-400' },
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* Top bar */}
      <div
        className="sticky top-0 z-40 border-b border-border"
        style={{ background: 'rgba(8,8,16,0.9)', backdropFilter: 'blur(14px)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Layers size={13} className="text-indigo-400" />
            </div>
            <span className="font-semibold text-sm text-white">Admin</span>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 glass rounded-lg text-xs text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={12} /> View Site
            </Link>
            <button onClick={openCreate}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors">
              <Plus size={13} /> Add Project
            </button>
            <button onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 glass rounded-lg text-xs text-gray-400 hover:text-red-400 transition-colors">
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-7">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-7">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-xl p-4 border border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">{s.label}</span>
                <s.icon size={14} className={s.color} />
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* List */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-600">All Projects — drag to reorder</p>
          <span className="text-xs text-gray-700">{websites.length} total</span>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card rounded-xl h-14 animate-pulse border border-border" />
            ))}
          </div>
        ) : websites.length === 0 ? (
          <div className="text-center py-16 text-gray-600 text-sm">
            No projects yet.{' '}
            <button onClick={openCreate} className="text-indigo-400 hover:text-indigo-300 transition-colors underline">
              Add your first one →
            </button>
          </div>
        ) : (
          <SortableWebsiteList
            websites={websites}
            onReorder={handleReorder}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {modalOpen && (
        <WebsiteFormModal
          website={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
