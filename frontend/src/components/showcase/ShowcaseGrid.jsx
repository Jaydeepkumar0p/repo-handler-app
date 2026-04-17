import { motion } from 'framer-motion';
import WebsiteCard from './WebsiteCard.jsx';
import SkeletonCard from './SkeletonCard.jsx';
import { Frown } from 'lucide-react';

export default function ShowcaseGrid({ websites, loading }) {
  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </section>
    );
  }

  if (!websites.length) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 py-20 text-center">
        <Frown size={36} className="text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No projects found.</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {websites.map((w) => <WebsiteCard key={w._id} website={w} />)}
      </motion.div>
    </section>
  );
}
