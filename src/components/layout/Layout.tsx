import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import LatestProductPop from './LatestProductPop';
import AIChat from '../chat/AIChat';
import { motion } from 'motion/react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBar />
        <Navbar />
      </div>
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow pt-30"
      >
        {children}
      </motion.main>
      <LatestProductPop />
      <AIChat />
      <Footer />
    </div>
  );
}
