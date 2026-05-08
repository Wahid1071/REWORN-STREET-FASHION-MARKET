import { motion } from 'motion/react';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="text-6xl font-display font-bold leading-tight mb-8">Get in touch.</h1>
          <p className="text-lg text-neutral-500 max-w-md mb-12">
            Have questions about our collections or an order? We're here to help you curate your space.
          </p>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="p-3 bg-neutral-100 rounded-lg mr-4">
                <Mail className="h-5 w-5 text-neutral-900" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Email</h4>
                <p className="text-neutral-500">support@luminarystore.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-3 bg-neutral-100 rounded-lg mr-4">
                <MapPin className="h-5 w-5 text-neutral-900" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Studio</h4>
                <p className="text-neutral-500">Malda, West Bengal, India</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-3 bg-neutral-100 rounded-lg mr-4">
                <Phone className="h-5 w-5 text-neutral-900" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Phone</h4>
                <p className="text-neutral-500">+91 8927668457</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-3xl shadow-xl shadow-neutral-200/50"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">First Name</label>
                <input type="text" className="w-full px-5 py-4 bg-neutral-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/5 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Last Name</label>
                <input type="text" className="w-full px-5 py-4 bg-neutral-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/5 transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Email Address</label>
              <input type="email" className="w-full px-5 py-4 bg-neutral-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/5 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Message</label>
              <textarea rows={4} className="w-full px-5 py-4 bg-neutral-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/5 transition-all resize-none"></textarea>
            </div>
            <button className="w-full bg-neutral-900 text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center">
              <MessageSquare className="h-5 w-5 mr-3" />
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
