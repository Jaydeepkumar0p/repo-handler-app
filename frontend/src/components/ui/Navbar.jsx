import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Settings } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg/80 backdrop-blur-xl border-b border-border' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:border-indigo-500/70 transition-colors">
            <Layers size={15} className="text-indigo-400" />
          </div>
          <span className="font-bold text-sm tracking-tight">
            folio<span className="text-indigo-400">.</span>
          </span>
        </Link>

        <Link
          to="/admin/login"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-colors"
        >
          <Settings size={13} />
          Admin
        </Link>
      </div>
    </motion.header>
  );
}
