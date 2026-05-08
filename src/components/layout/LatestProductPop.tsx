import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { ShoppingBag, CheckCircle } from 'lucide-react';

const fakeBuyers = ["Arjun from Mumbai", "Priya from Delhi", "Rahul from Bangalore", "Sanjay from Kolkata", "Deepa from Pune", "Anjali from Hyderabad"];

export default function LatestProductPop() {
  const [latestProduct, setLatestProduct] = useState<Product | null>(null);
  const [notificationType, setNotificationType] = useState<'arrival' | 'order'>('arrival');
  const [currentBuyer, setCurrentBuyer] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('createdAt', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        if (data && data.length > 0) {
          setLatestProduct(data[0] as Product);
        }
      } catch (err) {
        console.error("Error fetching latest product:", err);
      }
    };

    fetchLatest();

    // Show every 12 seconds
    const interval = setInterval(() => {
      // Toggle between news and fake orders
      const type = Math.random() > 0.5 ? 'arrival' : 'order';
      setNotificationType(type);
      if (type === 'order') {
        setCurrentBuyer(fakeBuyers[Math.floor(Math.random() * fakeBuyers.length)]);
      }
      
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  if (!latestProduct) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed bottom-8 right-8 z-50 max-w-sm bg-white rounded-2xl shadow-2xl border border-neutral-100 p-4 transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0 relative">
              <img src={latestProduct.image} alt="" className="h-full w-full object-cover" />
              {notificationType === 'order' && (
                <div className="absolute inset-0 bg-neutral-900/40 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1 leading-none">
                {notificationType === 'arrival' ? 'New Arrival' : 'Recent Purchase'}
              </p>
              <h4 className="text-sm font-bold text-neutral-900 line-clamp-1">
                {notificationType === 'arrival' ? latestProduct.name : `${currentBuyer} just bought!`}
              </h4>
              <p className="text-xs text-neutral-500 mt-1 font-mono">
                {notificationType === 'arrival' ? `₹${latestProduct.price}` : 'Just now'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
