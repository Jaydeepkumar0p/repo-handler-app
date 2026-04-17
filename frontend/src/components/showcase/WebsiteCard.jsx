import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge.jsx';

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function WebsiteCard({ website }) {
  return (
    <motion.div variants={cardVariants} className="h-full">
      <Tilt
        tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.02}
        transitionSpeed={600} glareEnable glareMaxOpacity={0.04}
        glareColor="#818cf8" glarePosition="all" className="h-full"
      >
        <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col group cursor-pointer hover:border-indigo-500/25 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]">

          {/* Thumbnail */}
          <Link to={`/site/${website._id}`} className="relative block aspect-[16/10] overflow-hidden bg-surface-2 shrink-0">
            {website.images?.[0] ? (
              <img
                src={website.images[0]}
                alt={website.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-black text-white/5 select-none">
                  {website.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Top-left status */}
            <div className="absolute top-3 left-3">
              <StatusBadge status={website.status} animate />
            </div>

            {/* Hover arrow */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0 duration-200">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
                <ArrowUpRight size={13} className="text-white" />
              </div>
            </div>
          </Link>

          {/* Body */}
          <div className="p-4 flex flex-col flex-1">
            <Link to={`/site/${website._id}`}>
              <h3 className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
                {website.name}
              </h3>
            </Link>

            <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed flex-1">
              {website.description || 'No description yet.'}
            </p>

            {/* Tech pills */}
            {website.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {website.techStack.slice(0, 4).map((t) => (
                  <span key={t} className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/15">
                    {t}
                  </span>
                ))}
                {website.techStack.length > 4 && (
                  <span className="px-2 py-0.5 text-[10px] rounded-md bg-white/5 text-gray-500">
                    +{website.techStack.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Links */}
            <div className="flex items-center gap-3 pt-2.5 border-t border-border/60">
              {website.liveUrl && (
                <a href={website.liveUrl} target="_blank" rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-indigo-400 transition-colors">
                  <ExternalLink size={11} /> Live
                </a>
              )}
              {website.githubUrl && (
                <a href={website.githubUrl} target="_blank" rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-white transition-colors">
                  <Github size={11} /> GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
}
