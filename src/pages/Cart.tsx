import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Loader2, Wallet, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { user, profile, signIn, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'wallet'>('cod');

  useEffect(() => {
    if (profile) {
      setAddress(profile.address || '');
      setPhone(profile.phoneNumber || '');
    }
  }, [profile]);

  const handleCheckout = async () => {
    if (!user) {
      if (window.confirm("You need to sign in to complete your order. Sign in now?")) {
        signIn();
      }
      return;
    }

    if (!address.trim() || !phone.trim()) {
      alert("Please provide your delivery address and phone number.");
      return;
    }

    if (paymentMethod === 'wallet' && (profile?.walletBalance || 0) < totalPrice) {
      alert("Insufficient wallet balance. Please top up your wallet or choose another payment method.");
      return;
    }

    setCheckingOut(true);
    try {
      // Deduct from wallet if applicable
      if (paymentMethod === 'wallet' && profile) {
        const { error: walletError } = await supabase
          .from('users')
          .update({ walletBalance: (profile.walletBalance || 0) - totalPrice })
          .eq('uid', user.id);
        
        if (walletError) throw walletError;
        await refreshProfile();
      }

      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          userId: user.id,
          userEmail: user.email,
          address,
          phone,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          total: totalPrice,
          status: 'pending',
          paymentMethod,
          createdAt: new Date().toISOString()
        }]);
      
      if (orderError) throw orderError;
      
      clearCart();
      alert(`Order placed successfully with ${paymentMethod === 'wallet' ? 'Wallet' : 'Cash on Delivery'}!`);
      navigate('/');
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Checkout failed: ' + err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="mb-8 flex justify-center">
          <div className="p-10 bg-neutral-100 rounded-full">
            <ShoppingBag className="h-16 w-16 text-neutral-400" />
          </div>
        </div>
        <h1 className="text-4xl font-display font-bold mb-4">Your bag is empty.</h1>
        <p className="text-neutral-500 mb-10 max-w-sm mx-auto">Looks like you haven't added any essentials to your bag yet.</p>
        <Link to="/shop" className="inline-block bg-neutral-900 text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors rounded-full">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-display font-bold mb-12">Your Bag ({totalItems})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-8">
          {cart.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center py-6 border-b border-neutral-100"
            >
              <div className="h-32 w-24 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>

              <div className="ml-8 flex-grow flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">{item.name}</h3>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">{item.category}</p>
                  </div>
                  <p className="text-lg font-semibold text-neutral-900">₹{item.price * item.quantity}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center border border-neutral-200 rounded-full px-2 py-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8 p-10 bg-neutral-100 rounded-2xl">
          <h2 className="text-xl font-bold font-display uppercase tracking-widest">Order Summary</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Delivery Address</label>
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address (Street, City, PIN)"
                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all resize-none h-24"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Phone Number</label>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
              />
            </div>
          </div>
          
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span className="text-green-600">Calculated later</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="pt-4 border-t border-neutral-200 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Payment Method</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'cod' ? 'border-neutral-900 bg-white' : 'border-neutral-200 bg-neutral-50 text-neutral-400'}`}
                >
                  <ArrowRight className={`h-5 w-5 mb-2 ${paymentMethod === 'cod' ? 'text-neutral-900' : 'text-neutral-300'}`} />
                  <span className="text-[10px] font-bold uppercase">COD</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('wallet')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'wallet' ? 'border-neutral-900 bg-white' : 'border-neutral-200 bg-neutral-50 text-neutral-400'}`}
                >
                  <Wallet className={`h-5 w-5 mb-2 ${paymentMethod === 'wallet' ? 'text-neutral-900' : 'text-neutral-300'}`} />
                  <span className="text-[10px] font-bold uppercase">Wallet</span>
                  {profile && (
                    <span className="text-[8px] mt-1 opacity-60">₹{profile.walletBalance || 0}</span>
                  )}
                </button>
              </div>
              {paymentMethod === 'wallet' && (profile?.walletBalance || 0) < totalPrice && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest animate-pulse">Low balance! Please top up.</p>
              )}
            </div>

          <button 
            onClick={handleCheckout}
            disabled={checkingOut}
            className="w-full bg-neutral-900 text-white py-5 px-8 font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all rounded-full flex items-center justify-center group disabled:opacity-50"
          >
            {checkingOut ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>Checkout <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
          
          <p className="text-[10px] text-center text-neutral-500 uppercase tracking-widest">
            Taxes and shipping calculated at checkout
          </p>
        </div>
      </div>
    </div>
  );
}
