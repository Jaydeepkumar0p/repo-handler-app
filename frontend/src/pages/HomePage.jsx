import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from '../components/ui/Navbar.jsx';
import Footer from '../components/ui/Footer.jsx';
import HeroSection from '../components/showcase/HeroSection.jsx';
import ShowcaseGrid from '../components/showcase/ShowcaseGrid.jsx';
import api from '../utils/api.js';

export default function HomePage() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    api.get('/websites')
      .then(({ data }) => setWebsites(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Failed to load projects:', err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = websites.filter((w) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      w.name?.toLowerCase().includes(q) ||
      w.description?.toLowerCase().includes(q) ||
      w.techStack?.some((t) => t.toLowerCase().includes(q));
    const matchFilter = activeFilter === 'All' || w.status === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
        style={{ scaleX, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }}
      />

      <Navbar />

      <main>
        <HeroSection
          count={websites.length}
          search={search}
          onSearch={setSearch}
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
        />
        <ShowcaseGrid websites={filtered} loading={loading} />
      </main>

      <Footer />
    </>
  );
}
