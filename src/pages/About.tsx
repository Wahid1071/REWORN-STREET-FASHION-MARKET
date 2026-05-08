import React from 'react';
import { motion } from 'motion/react';
import { Recycle, ShieldCheck, Heart, Users } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Items Saved', value: '5,000+' },
    { label: 'Happy Thrifters', value: '2,500+' },
    { label: 'Vintage Finds', value: '1,200+' },
    { label: 'Carbon Offset', value: '15 Tons' },
  ];

  const values = [
    {
      icon: <Recycle className="w-6 h-6" />,
      title: 'Sustainability First',
      description: 'The fashion industry is one of the world\'s largest polluters. By thrifting, we give high-quality garments a second life and reduce textile waste.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Curated Quality',
      description: 'Every piece in our shop is hand-picked for its authenticity, quality, and unique streetwear aesthetic. No fast fashion—only real vintage gems.'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Wear with Soul',
      description: 'Vintage clothes have a story. We believe in wearing clothes that have character and history, standing out from the cookie-cutter mass production.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Driven',
      description: 'REWORN STREET is more than a shop; it\'s a hub for people who value style and the planet equally.'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm uppercase tracking-widest text-neutral-500 font-medium mb-4 block">Our Story</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">
            Curated Thrift, <br />
            <span className="italic text-neutral-400 font-normal">Sustainable Soul.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-neutral-600 leading-relaxed">
            REWORN STREET was born out of a love for 90s streetwear culture and a frustration with the environmental impact of modern fast fashion. We bridge the gap between high-end style and ethical consumption.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-neutral-900 py-16 mb-24 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full w-full">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border-r border-white/20 h-full" />
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-neutral-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {values.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-6 p-8 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-neutral-900 text-white p-3 rounded-xl h-fit">
                {value.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing Quote */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative p-12 glass rounded-3xl"
        >
          <p className="text-2xl font-display italic text-neutral-800 leading-relaxed mb-6">
            "The most sustainable garment is the one that already exists. Join us in rewriting the narrative of streetwear, one vintage find at a time."
          </p>
          <div className="text-sm font-bold uppercase tracking-widest">— Team REWORN</div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
