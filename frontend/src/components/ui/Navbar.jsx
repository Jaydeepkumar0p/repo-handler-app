import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layers, Settings } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // 🔥 Animation Variants
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const text = "folio.";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-xl border-b border-border shadow-sm"
          : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* 🔥 PREMIUM LOGO */}
        <Link to="/" className="flex items-center gap-2.5 group">
          
          {/* Icon */}
          <div className="relative w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center overflow-hidden">
            
            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 blur-md transition duration-300" />

            <Layers
              size={16}
              className="text-indigo-400 relative z-10 group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* 🔥 Animated Text */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col leading-tight"
          >
            <div className="flex">
              {text.split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={letter}
                  className={`font-semibold text-sm tracking-tight ${
                    char === "." ? "text-indigo-400" : "text-white"
                  }`}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <span className="text-[10px] text-gray-500 tracking-wide hidden sm:block">
              developer portfolio
            </span>
          </motion.div>
        </Link>

        {/* Admin Button */}
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white border border-border hover:border-indigo-500/40 transition"
        >
          <Settings size={13} />
          Admin
        </Link>
      </div>
    </motion.header>
  );
}
