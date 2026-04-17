import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Layers size={12} className="text-indigo-400" />
          </div>
          <span className="text-sm font-semibold">folio<span className="text-indigo-400">.</span></span>
        </Link>
        <p className="text-xs text-gray-600">Built with React + Node.js + MongoDB</p>
      </div>
    </footer>
  );
}
