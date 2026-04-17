import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageCarousel({ images, name }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div>
      <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={images[idx]}
            alt={`${name} ${idx + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>
        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
          <ChevronRight size={16} />
        </button>
        <div className="absolute bottom-2 right-3 glass px-2 py-0.5 rounded text-[10px] text-gray-300">
          {idx + 1} / {images.length}
        </div>
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {images.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`rounded-full transition-all duration-200 ${i === idx ? 'w-5 h-1.5 bg-indigo-500' : 'w-1.5 h-1.5 bg-gray-700 hover:bg-gray-500'}`} />
        ))}
      </div>
    </div>
  );
}
