import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const journalEntries = [
  {
    id: 1,
    title: "The Art of Thrifting: How to Find Real Gems",
    excerpt: "Thrifting isn't just about finding cheap clothes; it's a scavenger hunt for history. Learn our top secrets for spotting quality vintage pieces in a sea of fast fashion.",
    date: "May 15, 2024",
    readTime: "5 min read",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Streetwear Evolution: From 90s to Now",
    excerpt: "How did oversized flannels and baggy jeans move from the subculture to the runway? We trace the roots of modern street style back to its vintage origins.",
    date: "May 10, 2024",
    readTime: "8 min read",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Sustainability in Fashion: Why Thrifting Matters",
    excerpt: "The environmental impact of the fashion industry is staggering. Discover how buying one pre-loved shirt saves thousands of gallons of water and reduces CO2.",
    date: "May 05, 2024",
    readTime: "6 min read",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "IPL Fever: The Story Behind the RCB Gold & Red",
    excerpt: "With the tournament in full swing, we dive into the design history of the most iconic jersey in the league. Why 'Play Bold' is more than just a slogan.",
    date: "April 28, 2024",
    readTime: "4 min read",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800"
  }
];

const Journal = () => {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-sm uppercase tracking-widest text-neutral-500 font-medium mb-4 block">The Journal</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 italic">Stories, Culture & Style</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Our curated thoughts on the world of vintage fashion, sustainability, and the streetwear community.
          </p>
        </motion.div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {journalEntries.map((entry, idx) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden rounded-3xl mb-6">
                <img 
                  src={entry.image} 
                  alt={entry.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-neutral-900 border border-white/20 shadow-sm">
                  {entry.category}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-neutral-400 mb-4 font-medium uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {entry.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {entry.readTime}</span>
              </div>

              <h2 className="text-2xl font-bold mb-3 group-hover:text-neutral-600 transition-colors leading-tight">
                {entry.title}
              </h2>
              <p className="text-neutral-600 mb-6 leading-relaxed line-clamp-3">
                {entry.excerpt}
              </p>

              <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-900 group-hover:gap-4 transition-all">
                Read Story <ChevronRight className="w-4 h-4" />
              </button>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="bg-neutral-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <BookOpen className="w-10 h-10 mx-auto mb-6 text-neutral-400" />
            <h2 className="text-3xl font-display italic mb-4">Never miss a drop or a story.</h2>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto">Join our inner circle for early access to vintage drops and exclusive cultural content.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              <button className="bg-white text-neutral-900 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Journal;
