import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

const up = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] },
});

export default function HeroSection({ count, search, onSearch, activeFilter, onFilter }) {
  const filters = ['All', 'Live', 'Beta', 'Archived'];

  return (
    <section className="pt-32 pb-14 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div {...up(0)} className="mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-medium text-indigo-300 border border-indigo-500/20">
            <Sparkles size={11} />
            {count} Projects Showcased
          </span>
        </motion.div>

        <motion.h1 {...up(0.08)} className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-tight tracking-tight mb-4">
          <span className="text-gradient">Things I've</span>
          <br />
          <span className="text-gradient-purple">Built & Shipped</span>
        </motion.h1>

        <motion.p {...up(0.16)} className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto mb-9 leading-relaxed">
          A live gallery of websites, apps, and tools — from quick experiments to production-grade platforms.
        </motion.p>

        <motion.div {...up(0.22)} className="relative max-w-sm mx-auto mb-5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search projects, tech stack…"
            className="w-full pl-10 pr-4 py-2.5 glass rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 border border-border transition-all placeholder:text-gray-600 text-gray-100"
          />
        </motion.div>

        <motion.div {...up(0.28)} className="flex items-center justify-center gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => onFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === f
                  ? 'bg-indigo-600 text-white'
                  : 'glass text-gray-400 hover:text-white border border-border'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
