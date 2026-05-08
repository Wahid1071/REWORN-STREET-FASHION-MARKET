import { Link } from 'react-router-dom';
import { Shirt } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { profile } = useAuth();
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-white text-neutral-900 p-2 rounded-lg transition-transform group-hover:scale-110">
                <Shirt className="h-6 w-6" />
              </div>
              <span className="text-xl font-display font-bold tracking-tighter text-white uppercase">
                REWORN STREET
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Curated thrift essentials for the street-style enthusiast. Sustainable fashion, timeless vintage pieces.
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-6">Shop</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/categories/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/categories/best-sellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/categories/sale" className="hover:text-white transition-colors">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/journal" className="hover:text-white transition-colors">Journal</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/stores" className="hover:text-white transition-colors">Our Stores</Link></li>
              {(profile?.role === 'admin' || profile?.email === 'rewornstreet@gmail.com') && (
                <li><Link to="/admin" className="text-neutral-900 hover:bg-white transition-all bg-white font-black px-3 py-1.5 rounded inline-block text-[10px] uppercase shadow-lg">Admin Panel</Link></li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs">
            © 2026 REWORN STREET. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs">
            <button className="hover:text-white transition-colors">Instagram</button>
            <button className="hover:text-white transition-colors">Twitter</button>
            <button className="hover:text-white transition-colors">Pinterest</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
