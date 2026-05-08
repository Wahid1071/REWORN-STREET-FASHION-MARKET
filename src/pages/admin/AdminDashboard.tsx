import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Product, Order } from '../../types';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, LayoutDashboard, ShoppingBag, Clock, Users, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';

type Tab = 'products' | 'orders' | 'seller-requests';

interface SellerApplication {
  id: string;
  userId: string;
  userEmail: string;
  displayName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sellerRequests, setSellerRequests] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const { profile, user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: prods } = await supabase.from('products').select('*');
      setProducts((prods || []) as Product[]);

      const { data: ords } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
      setOrders((ords || []) as Order[]);

      const { data: apps } = await supabase.from('seller_applications').select('*').eq('status', 'pending');
      setSellerRequests((apps || []) as SellerApplication[]);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSeller = async (request: SellerApplication) => {
    const sellerId = `SELLER_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    try {
      // Update User
      await supabase
        .from('users')
        .update({
          role: 'seller',
          sellerId: sellerId,
          applicationPending: false
        })
        .eq('uid', request.userId);

      // Update Application
      await supabase
        .from('seller_applications')
        .update({
          status: 'approved',
          sellerId: sellerId
        })
        .eq('id', request.id);

      setSellerRequests(prev => prev.filter(r => r.id !== request.id));
      alert(`Seller ${request.userEmail} approved with ID: ${sellerId}`);
    } catch (err) {
      console.error("Error approving seller:", err);
    }
  };

  const handleRejectSeller = async (requestId: string, userId: string) => {
    try {
      await supabase
        .from('seller_applications')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      await supabase
        .from('users')
        .update({ applicationPending: false })
        .eq('uid', userId);

      setSellerRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      console.error("Error rejecting seller:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error('Delete error:', err);
      alert('Error: ' + err.message);
    }
  };

  const ADMIN_EMAILS = ['rewornstreet@gmail.com', 'wahidrahaman0619@gmail.com'];
  if (profile?.role !== 'admin' && !ADMIN_EMAILS.includes(profile?.email || '') && !ADMIN_EMAILS.includes(user?.email || '')) {
    return <div className="p-20 text-center">Access Denied.</div>;
  }

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-green-500' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Revenue', value: `₹${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`, icon: LayoutDashboard, color: 'text-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold">Admin Panel</h1>
          <p className="text-neutral-500 mt-2">Manage your inventory and orders.</p>
        </div>
        <Link 
          to="/admin/products/new" 
          className="bg-neutral-900 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest flex items-center justify-center hover:bg-neutral-800 transition-all"
        >
          <Plus className="h-5 w-5 mr-2" /> Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label} 
            className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="h-6 w-6 text-neutral-400" />
              <span className={`text-xs font-bold uppercase ${stat.color}`}>Real-time</span>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-neutral-500 uppercase tracking-widest mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex border-b border-neutral-100 mb-8 space-x-8">
        {(['products', 'orders', 'seller-requests'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab ? 'text-neutral-900' : 'text-neutral-400'
            }`}
          >
            {tab.replace('-', ' ')}
            {activeTab === tab && (
              <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
            )}
            {tab === 'seller-requests' && sellerRequests.length > 0 && (
              <span className="absolute -top-1 -right-4 bg-accent-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">
                {sellerRequests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {activeTab === 'products' ? (
          /* ... existing products table ... */
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Product</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Price</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8 h-12 bg-neutral-50/50"></td>
                  </tr>
                ))
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded bg-neutral-100 overflow-hidden mr-4">
                          <img src={product.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <span className="font-medium text-neutral-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{product.category}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="font-medium">₹{product.price}</span>
                    </td>
                    <td className="px-6 py-6 text-right space-x-3">
                      <Link 
                        to={`/admin/products/edit/${product.id}`}
                        className="inline-flex p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : activeTab === 'orders' ? (
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Order/Customer</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Total</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8 h-12 bg-neutral-50/50"></td>
                  </tr>
                ))
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono font-bold text-neutral-400">#{order.id.slice(0, 8)}</span>
                        <span className="text-sm font-bold text-neutral-900 mt-1">{order.userEmail}</span>
                        <span className="text-[10px] text-neutral-500 font-medium">{order.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-neutral-700">{order.items.length} items</span>
                        <span className="text-[10px] text-neutral-500 mt-1 italic line-clamp-1">{order.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold">
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-6 text-neutral-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-400 italic">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Applicant</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Email</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Date Applied</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                [1,2].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8 h-12 bg-neutral-50/50"></td>
                  </tr>
                ))
              ) : (
                sellerRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                          <Users className="w-4 h-4 text-neutral-400" />
                        </div>
                        <span className="font-medium text-neutral-900">{request.displayName || 'Guest User'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm text-neutral-600">{request.userEmail}</td>
                    <td className="px-6 py-6 text-xs text-neutral-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-6 text-right space-x-2">
                      <button 
                        onClick={() => handleApproveSeller(request)}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleRejectSeller(request.id, request.userId)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {!loading && sellerRequests.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-400 italic">No pending seller applications.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
