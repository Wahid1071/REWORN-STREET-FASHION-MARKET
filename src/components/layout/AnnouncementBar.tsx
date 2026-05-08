import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

const messages = [
  "LATEST DROP: Vintage 90s Flannels now live",
  "FREE SHIPPING on orders over ₹500",
  "EXCLUSIVE: Retro Graphic T-Shirts just added",
  "SUSATINABLE THRIFT: Curated for the streets"
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-neutral-900 text-white h-10 flex items-center justify-center overflow-hidden relative z-[60]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex items-center space-x-2 px-4"
        >
          <Sparkles className="h-3 w-3 text-yellow-400" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
            {messages[index]}
          </span>
          <Sparkles className="h-3 w-3 text-yellow-400" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
