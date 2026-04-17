import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Eye, Calendar, Star } from 'lucide-react';
import Navbar from '../components/ui/Navbar.jsx';
import ImageCarousel from '../components/showcase/ImageCarousel.jsx';
import { StatusBadge } from '../components/ui/StatusBadge.jsx';
import api from '../utils/api.js';

const up = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d },
});

export default function SiteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/websites/${id}`)
      .then(({ data }) => setWebsite(data))
      .catch(() => navigate('/', { replace: true }))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-7 h-7 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!website) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Back */}
          <motion.div {...up(0)} className="mb-8">
            <Link to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Gallery
            </Link>
          </motion.div>

          {/* Hero image */}
          {website.images?.[0] && (
            <motion.div {...up(0.05)}
              className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-border">
              <img src={website.images[0]} alt={website.name}
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent" />
            </motion.div>
          )}

          {/* Header */}
          <motion.div {...up(0.1)}
            className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <StatusBadge status={website.status} animate />
                {website.featured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Star size={9} fill="currentColor" /> Featured
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <Eye size={11} /> {website.visitors || 0} views
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-3">
                {website.name}
              </h1>
              <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
                {website.longDescription || website.description || 'No description available.'}
              </p>
            </div>

            {/* CTA */}
            <div className="flex gap-2.5 shrink-0">
              {website.liveUrl && (
                <a href={website.liveUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors">
                  <ExternalLink size={14} /> Visit Site
                </a>
              )}
              {website.githubUrl && (
                <a href={website.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 glass hover:border-indigo-500/30 text-sm font-medium rounded-xl transition-all">
                  <Github size={14} /> Source
                </a>
              )}
            </div>
          </motion.div>

          {/* Tech stack */}
          {website.techStack?.length > 0 && (
            <motion.div {...up(0.15)} className="mb-8">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-widest mb-3">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {website.techStack.map((t) => (
                  <span key={t}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-indigo-300 border border-indigo-500/20"
                    style={{ background: 'rgba(99,102,241,0.08)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Gallery */}
          {website.images?.length > 1 && (
            <motion.div {...up(0.2)} className="mb-8">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                Screenshots
              </p>
              <ImageCarousel images={website.images} name={website.name} />
            </motion.div>
          )}

          {/* Date */}
          <motion.div {...up(0.25)} className="flex items-center gap-1.5 text-xs text-gray-700">
            <Calendar size={11} />
            Added {new Date(website.createdAt).toLocaleDateString('en-US',
              { month: 'long', day: 'numeric', year: 'numeric' })}
          </motion.div>
        </div>
      </main>
    </>
  );
}
