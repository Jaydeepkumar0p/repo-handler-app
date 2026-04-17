import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import api from '../../utils/api.js';
import { getAdminToken } from '../../context/AuthContext.jsx';

const STATUSES = ['Live', 'Beta', 'Archived'];

export default function WebsiteFormModal({ website, onClose, onSave }) {
  const [form, setForm] = useState({
    name:            website?.name            || '',
    description:     website?.description     || '',
    longDescription: website?.longDescription || '',
    images:          website?.images          || [],
    techStack:       website?.techStack       || [],
    liveUrl:         website?.liveUrl         || '',
    githubUrl:       website?.githubUrl       || '',
    status:          website?.status          || 'Live',
    featured:        website?.featured        || false,
  });
  const [techInput, setTechInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving]    = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  function addTech() {
    const t = techInput.trim();
    if (t && !form.techStack.includes(t)) set('techStack', [...form.techStack, t]);
    setTechInput('');
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return;
    setUploading(true);

    try {
      const urls = [];
      for (const file of acceptedFiles) {
        const fd = new FormData();
        fd.append('file', file);

        // IMPORTANT: Do NOT set Content-Type manually for multipart/form-data.
        // The browser must set it automatically so it includes the boundary.
        // We also send the admin token via X-Admin-Token header instead of
        // relying solely on the httpOnly cookie (which can be blocked cross-port).
        const baseURL = api.defaults.baseURL || '/api';
        const res = await fetch(`${baseURL}/upload`, {
          method: 'POST',
          credentials: 'include',           // send cookie
          headers: {
            'X-Admin-Token': getAdminToken(), // fallback token for auth
          },
          body: fd,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: `Upload failed (${res.status})` }));
          throw new Error(err.error || `Upload failed (${res.status})`);
        }

        const data = await res.json();
        urls.push(data.url);
      }

      set('images', [...form.images, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [form.images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 5,
    maxSize: 4 * 1024 * 1024,
    onDropRejected: (files) => {
      toast.error(files[0]?.errors[0]?.message || 'Invalid file');
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  const inputCls   = 'w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition-all text-gray-100 placeholder:text-gray-600';
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e35' };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 18 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl scrollbar-thin"
          style={{ background: '#0f0f1a', border: '1px solid #1e1e35' }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
            style={{ background: '#0f0f1a', borderBottom: '1px solid #1e1e35' }}>
            <h2 className="text-sm font-semibold">{website ? 'Edit Project' : 'Add Project'}</h2>
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <X size={14} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4" noValidate>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Name *</label>
              <input
                type="text" value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="My Awesome App"
                className={inputCls} style={inputStyle}
              />
            </div>

            {/* Short description */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Short Description</label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="2–3 sentence overview shown on the card…"
                rows={3} className={`${inputCls} resize-none`} style={inputStyle}
              />
            </div>

            {/* Full description */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Description</label>
              <textarea
                value={form.longDescription}
                onChange={(e) => set('longDescription', e.target.value)}
                placeholder="Detailed description shown on the project detail page…"
                rows={3} className={`${inputCls} resize-none`} style={inputStyle}
              />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Live URL</label>
                <input
                  type="url" value={form.liveUrl}
                  onChange={(e) => set('liveUrl', e.target.value)}
                  placeholder="https://…" className={inputCls} style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">GitHub URL</label>
                <input
                  type="url" value={form.githubUrl}
                  onChange={(e) => set('githubUrl', e.target.value)}
                  placeholder="https://github.com/…" className={inputCls} style={inputStyle}
                />
              </div>
            </div>

            {/* Status + Featured */}
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
                <div className="flex gap-1.5">
                  {STATUSES.map((s) => (
                    <button key={s} type="button" onClick={() => set('status', s)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: form.status === s ? '#6366f1' : 'rgba(255,255,255,0.04)',
                        color: form.status === s ? '#fff' : '#6b7280',
                        border: '1px solid #1e1e35',
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pb-0.5">
                <button
                  type="button"
                  onClick={() => set('featured', !form.featured)}
                  className="w-9 h-5 rounded-full relative transition-colors"
                  style={{ background: form.featured ? '#6366f1' : '#1e1e35' }}
                  role="switch" aria-checked={form.featured}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.featured ? 'left-4' : 'left-0.5'}`} />
                </button>
                <span className="text-xs text-gray-500">Featured</span>
              </label>
            </div>

            {/* Tech stack */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Tech Stack</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text" value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                  placeholder="React, Node.js… press Enter to add"
                  className={`flex-1 ${inputCls}`} style={inputStyle}
                />
                <button type="button" onClick={addTech}
                  className="px-3 rounded-xl"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <Plus size={14} className="text-indigo-400" />
                </button>
              </div>
              {form.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.techStack.map((t) => (
                    <span key={t}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-indigo-300"
                      style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                      {t}
                      <button type="button"
                        onClick={() => set('techStack', form.techStack.filter((x) => x !== t))}
                        className="hover:text-red-400 transition-colors ml-0.5">
                        <X size={9} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Images */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Images</label>
              <div
                {...getRootProps()}
                className="rounded-xl p-5 text-center cursor-pointer transition-all"
                style={{
                  border: `2px dashed ${isDragActive ? 'rgba(99,102,241,0.5)' : '#1e1e35'}`,
                  background: isDragActive ? 'rgba(99,102,241,0.05)' : 'transparent',
                }}
              >
                <input {...getInputProps()} />
                {uploading ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Loader2 size={15} className="animate-spin" /> Uploading…
                  </div>
                ) : (
                  <>
                    <Upload size={18} className="mx-auto mb-1.5 text-gray-600" />
                    <p className="text-xs text-gray-500">
                      {isDragActive ? 'Drop here' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-[10px] text-gray-700 mt-1">
                      PNG · JPG · WEBP · Max 4 MB · Up to 5 files
                    </p>
                  </>
                )}
              </div>

              {form.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {form.images.map((url, i) => (
                    <div key={url}
                      className="relative aspect-video rounded-lg overflow-hidden group border border-border">
                      <img src={url} alt={`preview-${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => set('images', form.images.filter((x) => x !== url))}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(0,0,0,0.6)' }}>
                        <Trash2 size={13} className="text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2.5 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e35' }}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !form.name.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
                style={{ background: '#6366f1' }}>
                {saving && <Loader2 size={13} className="animate-spin" />}
                {saving ? 'Saving…' : website ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
