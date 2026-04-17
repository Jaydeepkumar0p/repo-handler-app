import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

const up = (d = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: d, ease: [0.16, 1, 0.3, 1] },
});

// 🔥 Word Animation
const wordContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const word = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HeroSection({
  count,
  search,
  onSearch,
  activeFilter,
  onFilter,
}) {
  const filters = ["All", "Live", "Beta", "Archived"];

  const line1 = ["Things", "I've"];
  const line2 = ["Built", "&", "Shipped"];

  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
      
      {/* 🔥 Background Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        
        {/* Badge */}
        <motion.div {...up(0)} className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-medium text-indigo-300 border border-indigo-500/20">
            <Sparkles size={11} />
            {count} Projects Showcased
          </span>
        </motion.div>

        {/* 🔥 Animated Heading */}
        <motion.div
          variants={wordContainer}
          initial="hidden"
          animate="show"
          className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-tight tracking-tight mb-5"
        >
          <div className="flex justify-center gap-2 flex-wrap">
            {line1.map((w, i) => (
              <motion.span key={i} variants={word} className="text-gradient">
                {w}
              </motion.span>
            ))}
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            {line2.map((w, i) => (
              <motion.span
                key={i}
                variants={word}
                className="text-gradient-purple"
              >
                {w}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          {...up(0.2)}
          className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
        >
          A curated collection of real-world projects — from quick experiments
          to scalable production-grade systems.
        </motion.p>

        {/* 🔥 Search Bar */}
        <motion.div
          {...up(0.3)}
          className="relative max-w-sm mx-auto mb-6 group"
        >
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search projects, tech stack…"
            className="w-full pl-10 pr-4 py-2.5 glass rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 border border-border transition-all placeholder:text-gray-600 text-gray-100 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
          />
        </motion.div>

        {/* 🔥 Filters */}
        <motion.div
          {...up(0.4)}
          className="flex items-center justify-center gap-2 flex-wrap"
        >
          {filters.map((f) => {
            const active = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => onFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                    : "glass text-gray-400 hover:text-white border border-border hover:border-indigo-500/40"
                }`}
              >
                {f}
              </button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
