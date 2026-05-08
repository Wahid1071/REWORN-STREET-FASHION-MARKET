import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('isFeatured', true)
          .limit(8);
        
        if (error) throw error;
        setFeaturedProducts(data as Product[]);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero background" 
            className="w-full h-full object-cover grayscale-[0.2]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Thrift Culture 2026</span>
            <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.9] mb-8">
              Revive Your Street Style.
            </h1>
            <p className="text-lg text-neutral-200 mb-10 max-w-lg leading-relaxed">
              Discover unique, pre-loved pieces that merge vintage soul with modern street aesthetics. Sustainable, rare, and ready for the pavement.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="bg-white text-neutral-900 px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-colors"
              >
                Shop Collection
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Shirts', slug: 'shirt', image: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?auto=format&fit=crop&q=80&w=800' },
            { name: 'Pants', slug: 'pant', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800' },
            { name: 'T-Shirts', slug: 't-shirt', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800' },
            { name: 'Jerseys', slug: 'jersey', image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&q=80&w=800' },
            { name: 'Caps', slug: 'cap', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800' },
            { name: 'Shoes', slug: 'shoe', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800' },
            { name: 'Jackets', slug: 'jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800' }
          ].map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-96 overflow-hidden rounded-xl"
            >
              <Link to={`/categories/${cat.slug}`} className="block h-full">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-display font-bold">{cat.name}</h3>
                  <div className="mt-2 flex items-center text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop Now <ArrowRight className="ml-2 h-3 w-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2 block">Our Picks</span>
            <h2 className="text-4xl font-display font-bold">Featured Products</h2>
          </div>
          <Link to="/shop" className="text-sm font-bold uppercase tracking-widest flex items-center hover:translate-x-1 transition-transform">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="space-y-4 animate-pulse">
                <div className="aspect-[4/5] bg-neutral-200 rounded-lg" />
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
                <div className="h-4 bg-neutral-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
                featuredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))
            ) : (
                <div className="col-span-full py-20 text-center text-neutral-500">
                    <p>No products found. Seed some data in Supabase.</p>
                </div>
            )}
          </div>
        )}
      </section>

      {/* Thank You Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-20 px-8 rounded-[2.5rem] bg-neutral-900 text-white relative overflow-hidden shadow-2xl"
        >
          {/* Decorative background grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="grid grid-cols-6 h-full border-x border-white/20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-r border-white/20 h-full" />
              ))}
            </div>
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-8 py-1.5 px-4 rounded-full border border-white/20 text-[10px] uppercase tracking-[0.3em] font-bold"
            >
              Gratitude
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
              Thank You for <br />
              <span className="italic text-neutral-400 font-normal">Visiting Us.</span>
            </h2>
            <p className="text-xl text-neutral-400 leading-relaxed mb-10">
              Your visit means the world to us. Together, we're giving fashion a second life and keeping streetwear authentic. Until next time, stay vintage.
            </p>
            <div className="flex justify-center items-center gap-6">
              <div className="h-px w-12 bg-neutral-800" />
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                    className="w-1.5 h-1.5 bg-neutral-500 rounded-full" 
                  />
                ))}
              </div>
              <div className="h-px w-12 bg-neutral-800" />
            </div>
            <p className="mt-8 text-[10px] uppercase tracking-widest text-neutral-600 font-bold">
              EST. 2026 • REWORN STREET
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
