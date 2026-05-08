import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Product, Order, UserProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Package, 
  DollarSign, 
  Percent, 
  ShoppingBag, 
  TrendingUp,
  User as UserIcon,
  Store,
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SellerDashboard() {
  const { profile, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'none' | 'pending' | 'rejected'>('none');

  const COMMISSION_RATE = 0.25;

  useEffect(() => {
    if (profile?.sellerId) {
      fetchSellerData();
    } else if (user) {
      checkApplicationStatus();
    } else {
      setLoading(false);
    }
  }, [profile, user]);

  const checkApplicationStatus = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seller_applications')
        .select('*')
        .eq('userId', user.id);
      
      if (error) throw error;
      if (data && data.length > 0) {
        setApplicationStatus(data[0].status);
      }
    } catch (error) {
      console.error("Error checking application status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForSeller = async () => {
    if (!user || !profile) return;
    setIsApplying(true);
    try {
      // Update user application status
      await supabase
        .from('users')
        .update({ applicationPending: true })
        .eq('uid', user.id);

      // Check for existing application
      const { data: existingApps } = await supabase
        .from('seller_applications')
        .select('*')
        .eq('userId', user.id);

      if (!existingApps || existingApps.length === 0) {
        // Create new application
        const { error } = await supabase
          .from('seller_applications')
          .insert([{
            userId: user.id || user.uid,
            userEmail: user.email,
            displayName: profile.displayName,
            status: 'pending',
            createdAt: new Date().toISOString()
          }]);
        
        if (error) throw error;
      }
      setApplicationStatus('pending');
    } catch (error) {
      console.error("Error applying for seller:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const fetchSellerData = async () => {
    if (!profile?.sellerId) return;
    setLoading(true);
    try {
      // Fetch seller's products
      const { data: sellerProducts, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('sellerId', profile.sellerId);
      
      if (prodError) throw prodError;
      setProducts(sellerProducts as Product[]);

      // Fetch recent orders
      const { data: allOrders, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (orderError) throw orderError;
      
      const filteredOrders = (allOrders as Order[]).filter(order => 
        order.items.some(item => item.sellerId === profile.sellerId)
      );
      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching seller data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile || (!profile.sellerId && profile.role !== 'admin')) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-neutral-50 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 italic">Partner with REWORN</h1>
            <p className="text-neutral-600 text-lg max-w-xl mx-auto">
              Got vintage heat in your closet? Start selling on REWORN and earn a <span className="font-bold text-neutral-900 underline decoration-neutral-300">25% commission</span> on every sale.
            </p>
          </div>

          {applicationStatus === 'pending' ? (
            <div className="bg-white p-12 rounded-[2.5rem] border border-neutral-100 shadow-xl text-center">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-500 animate-pulse">
                <Clock className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Application Pending</h2>
              <p className="text-neutral-500 max-w-md mx-auto leading-relaxed mb-8">
                Our team is currently reviewing your profile to ensure it aligns with our vintage quality standards. You'll be notified once your Seller ID is active.
              </p>
              <Link to="/" className="inline-block bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all">
                Return to Shop
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {[
                  { title: "List for Free", desc: "No upfront costs. List as many vintage items as you want.", icon: <Store /> },
                  { title: "25% Commission", desc: "We handle the platform, marketing, and checkout. You get 25%.", icon: <Percent /> },
                  { title: "Easy Payouts", desc: "Track earnings in real-time and get paid monthly.", icon: <DollarSign /> },
                  { title: "Vetted Community", desc: "Your items reach thousands of verified vintage lovers.", icon: <CheckCircle2 /> },
                ].map((feature, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex gap-6">
                    <div className="bg-neutral-900 text-white p-3 rounded-2xl h-fit">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">{feature.title}</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rules & Regulations */}
              <div className="bg-neutral-900 text-white p-10 md:p-16 rounded-[2.5rem] shadow-2xl mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-display italic mb-10 flex items-center gap-4">
                    <CheckCircle2 className="text-neutral-400" /> Rules & Regulations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Authenticity First</h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">All items must be 100% authentic. Counterfeits will result in an immediate permanent ban without payout.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Condition Grading</h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">Sellers must provide accurate condition reports. Any undisclosed flaws will result in free returns at seller cost.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">25% Commission</h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">REWORN STREET retains 25% of the final sale price as a service fee for platform maintenance and marketing.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Payout Schedule</h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">Payouts are processed 14 days after the customer receives the item to account for any returns or disputes.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Shipping SLA</h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">Items must be shipped within 48 hours of purchase using our approved courier partners.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Admin Control</h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">Admin has full authority to remove listings, adjust pricing if erroneous, and suspend accounts for rule violations.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={handleApplyForSeller}
                  disabled={isApplying}
                  className="bg-neutral-900 text-white px-12 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-neutral-800 transition-all flex items-center gap-3 mx-auto disabled:opacity-50"
                >
                  {isApplying ? 'Submitting Application...' : 'Apply to Join as Seller'} <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-neutral-400 mt-6 uppercase tracking-widest leading-relaxed">
                  By clicking apply, you agree to follow all the rules mentioned above. <br />
                  Our admins will contact you via email after reviewing your profile.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // Calculate earnings
  const sellerEarnings = orders.reduce((total, order) => {
    const sellerItemsTotal = order.items
      .filter(item => item.sellerId === profile.sellerId)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return total + (sellerItemsTotal * COMMISSION_RATE);
  }, 0);

  const totalSalesVolume = orders.reduce((total, order) => {
    return total + order.items
      .filter(item => item.sellerId === profile.sellerId)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, 0);

  const stats = [
    { label: 'My Products', value: products.length, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Related Orders', value: orders.length, icon: ShoppingBag, color: 'bg-purple-50 text-purple-600' },
    { label: 'Commission Rate', value: '25%', icon: Percent, color: 'bg-orange-50 text-orange-600' },
    { label: 'Total Earnings', value: `₹${sellerEarnings.toFixed(2)}`, icon: DollarSign, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Seller Panel</span>
              <span className="text-neutral-400 font-mono text-[10px] tracking-widest uppercase">ID: {profile.sellerId}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold">Welcome, {profile.displayName?.split(' ')[0]}</h1>
            <p className="text-neutral-500 mt-3">Track your sales, products, and 25% commissions here.</p>
          </div>
          <Link 
            to="/admin/products/new" 
            className="bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" /> List New Item
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm"
            >
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-6`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-neutral-900">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Table Area */}
          <div className="lg:col-span-2 space-y-10">
            {/* Products Table */}
            <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <Package className="w-5 h-5 text-neutral-400" /> My Inventory
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Product</th>
                      <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Category</th>
                      <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Price</th>
                      <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {loading ? (
                      [...Array(3)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan={4} className="px-8 py-6 h-16 bg-neutral-50/30"></td>
                        </tr>
                      ))
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-neutral-400 italic">No products listed yet.</td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-4">
                              <img src={product.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                              <span className="font-medium text-sm">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-4 uppercase text-[10px] font-bold tracking-widest text-neutral-500">
                            {product.category}
                          </td>
                          <td className="px-8 py-4 font-bold text-sm">₹{product.price}</td>
                          <td className="px-8 py-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {product.stock > 0 ? `${product.stock} IN STOCK` : 'OUT OF STOCK'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar / Sales summary */}
          <div className="space-y-8">
            <div className="bg-neutral-900 rounded-[2rem] p-8 text-white">
              <h3 className="text-xl font-display font-medium italic mb-6">Earnings Insight</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-neutral-400 text-sm">Total Sales Volume</span>
                  <span className="font-bold tracking-tight">₹{totalSalesVolume.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-neutral-400 text-sm">Commission (25%)</span>
                  <span className="font-bold tracking-tight text-accent-400">+₹{sellerEarnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                  <span className="text-white font-medium">Net Profit</span>
                  <span className="text-2xl font-bold">₹{sellerEarnings.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-3 text-xs text-neutral-500 italic bg-white/5 p-3 rounded-xl border border-white/5">
                <TrendingUp className="w-4 h-4" /> Earnings are calculated based on completed orders.
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-neutral-400" /> Recent Activity
              </h3>
              <div className="space-y-4">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between text-xs py-2 border-b border-neutral-50 last:border-0">
                    <div>
                      <p className="font-bold">{order.userEmail?.split('@')[0]}</p>
                      <p className="text-neutral-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent-600">₹{(order.items.filter(i => i.sellerId === profile.sellerId).reduce((s,i) => s + i.price, 0) * 0.25).toFixed(2)}</p>
                      <p className="text-[10px] text-neutral-400 uppercase">Comm.</p>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-center py-6 text-neutral-400 text-sm italic">No sales activity yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
