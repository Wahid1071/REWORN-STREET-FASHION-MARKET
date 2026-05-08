import { ShoppingBag, User, LogOut, Menu, X, Search, Shirt, Store, Home, Folder, CreditCard, Heart, Settings, MessageCircle, Mail, Phone, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, logout, signIn } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'Journal', path: '/journal' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-neutral-900 text-white p-2 rounded-lg transition-transform group-hover:scale-110">
                <Shirt className="h-6 w-6" />
              </div>
              <span className="text-xl font-display font-bold tracking-tighter text-neutral-900 uppercase">
                REWORN STREET
              </span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-10 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors hover:text-neutral-500",
                  location.pathname === link.path ? "text-neutral-900" : "text-neutral-500"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-5">
            <button className="text-neutral-500 hover:text-neutral-900 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/cart" className="text-neutral-500 hover:text-neutral-900 transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Admin Panel Link - Always checked if user exists */}
            {user && (profile?.role === 'admin' || user?.email === 'wahidrahaman0619@gmail.com' || user?.email === 'rewornstreet@gmail.com') && (
              <Link 
                to="/admin" 
                className="hidden sm:flex items-center text-[10px] font-black uppercase tracking-widest text-white bg-neutral-900 border border-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded transition-all shadow-sm"
              >
                Admin Panel
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/seller" 
                  className="hidden sm:flex items-center text-[10px] font-black uppercase tracking-widest text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-100 px-3 py-1.5 rounded transition-all shadow-sm group"
                >
                  <Store className="w-3 h-3 mr-1.5 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                  {profile?.sellerId ? 'Seller Dashboard' : 'Sell with Us'}
                </Link>
                <div className="flex items-center space-x-3">
                  <Link to="/profile" className="text-right hidden sm:block group">
                    <p className="text-xs font-bold text-neutral-900 leading-none group-hover:text-neutral-500 transition-colors">{profile?.displayName}</p>
                    <p className="text-[8px] text-neutral-400 uppercase tracking-widest mt-1">View Profile</p>
                  </Link>
                  <button onClick={logout} className="text-neutral-500 hover:text-red-500 transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="flex items-center text-[10px] font-black uppercase tracking-[0.15em] text-neutral-900 border border-neutral-900 px-4 py-2.5 rounded-lg hover:bg-neutral-900 hover:text-white transition-all bg-white shadow-sm"
                >
                  <User className="h-3.5 w-3.5 mr-2" />
                  Sign In
                </Link>
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-neutral-500 hover:text-neutral-900"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 md:hidden bg-[#FFF9F3] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-[#7A3E2A]">Menu</h2>
                <button onClick={() => setIsOpen(false)} className="text-neutral-500">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {user && (
                <div className="mb-8 pb-6 border-b border-[#FBE9D7]">
                  <p className="text-[#B95D2C] text-lg">Welcome,</p>
                  <p className="text-[#7A3E2A] text-2xl font-bold">{profile?.displayName || 'Guest'}</p>
                </div>
              )}

              <div className="space-y-6">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-[#7A3E2A] text-lg font-medium group">
                  <span className="text-xl">🏠</span> Home
                </Link>
                <Link to="/shop" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-[#7A3E2A] text-lg font-medium">
                  <span className="text-xl">📁</span> Projects
                </Link>
                <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-[#7A3E2A] text-lg font-medium relative">
                  <span className="text-xl">🛒</span> Cart
                  {totalItems > 0 && (
                    <span className="bg-[#EB6D20] text-white text-[10px] rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>
                
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-[#7A3E2A] text-lg font-medium">
                      <span className="text-xl">👤</span> My Profile
                    </Link>
                    <Link to="/cashback" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-[#7A3E2A] text-lg font-medium">
                      <span className="text-xl">💰</span> Cashback
                    </Link>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-[#7A3E2A] text-lg font-medium">
                      <span className="text-xl">📦</span> My Orders
                    </Link>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-[#7A3E2A] text-lg font-medium">
                      <span className="text-xl">❤️</span> Wishlist
                    </Link>
                    <Link to="/seller" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-[#7A3E2A] text-lg font-medium">
                      <span className="text-xl">💼</span> Seller Dashboard
                    </Link>
                    {(profile?.role === 'admin' || user?.email === 'wahidrahaman0619@gmail.com' || user?.email === 'rewornstreet@gmail.com') && (
                      <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-[#7A3E2A] text-lg font-medium">
                        <span className="text-xl">⚙️</span> Admin Panel
                      </Link>
                    )}
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-[#7A3E2A] text-lg font-medium">
                    <span className="text-xl">🔑</span> Sign In
                  </Link>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-[#FBE9D7]">
                <h3 className="text-[#EB6D20] font-black tracking-widest text-sm uppercase mb-6">SUPPORT</h3>
                <div className="space-y-6">
                  <a href="https://wa.me/918927668457" className="flex items-center gap-4 text-[#7A3E2A] text-lg font-medium">
                    <MessageCircle className="h-6 w-6 text-[#7A3E2A]" /> WhatsApp
                  </a>
                  <a href="mailto:rewornstreet@gmail.com" className="flex items-center gap-4 text-[#7A3E2A] text-lg font-medium">
                    <Mail className="h-6 w-6 text-[#7A3E2A]" /> Email Us
                  </a>
                  <a href="tel:+918927668457" className="flex items-center gap-4 text-[#7A3E2A] text-lg font-medium">
                    <Phone className="h-6 w-6 text-[#7A3E2A]" /> Call Us
                  </a>
                </div>
              </div>

              {user && (
                <div className="mt-12 pb-10">
                  <button 
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }} 
                    className="w-full flex items-center justify-center gap-3 bg-[#FBE9D7] text-[#7A3E2A] font-bold text-lg p-4 rounded-xl"
                  >
                    <LogOut className="h-6 w-6" /> Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
