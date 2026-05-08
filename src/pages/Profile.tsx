import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Wallet, ArrowRight, Camera, Save, Plus, LogOut, LayoutDashboard, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, profile, refreshProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
    address: '',
    photoURL: ''
  });
  const [saving, setSaving] = useState(false);
  const [addingMoney, setAddingMoney] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(500);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        phoneNumber: profile.phoneNumber || '',
        address: profile.address || '',
        photoURL: profile.photoURL || ''
      });
    }
  }, [profile]);

  if (!user || !profile) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-neutral-400 italic">Please sign in to view your profile.</p>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('uid', user.id);
      
      if (error) throw error;
      await refreshProfile();
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTopUp = async () => {
    setAddingMoney(true);
    try {
      const currentBalance = profile.walletBalance || 0;
      const { error } = await supabase
        .from('users')
        .update({ walletBalance: currentBalance + topUpAmount })
        .eq('uid', user.id);
      
      if (error) throw error;
      await refreshProfile();
      alert(`₹${topUpAmount} added to your wallet!`);
    } catch (error: any) {
      console.error('Error topping up:', error);
      alert('Error: ' + error.message);
    } finally {
      setAddingMoney(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative mb-8 inline-block">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto bg-neutral-100">
                {formData.photoURL ? (
                  <img src={formData.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-full h-full p-8 text-neutral-300" />
                )}
              </div>
              <button className="absolute bottom-1 right-1 bg-neutral-900 text-white p-2 rounded-full shadow-md hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-2xl font-display font-bold italic mb-1">{profile.displayName}</h2>
            <p className="text-xs text-neutral-400 uppercase tracking-widest mb-8">{profile.role}</p>

            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl">
                <Mail className="w-4 h-4 text-neutral-400" />
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400">Email Address</p>
                  <p className="text-xs font-bold text-neutral-900 truncate">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl">
                <Wallet className="w-4 h-4 text-neutral-400" />
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400">Wallet Balance</p>
                    <p className="text-xs font-bold text-neutral-900">₹{profile.walletBalance || 0}</p>
                  </div>
                  <button 
                    onClick={() => setAddingMoney(!addingMoney)}
                    className="p-1.5 bg-neutral-900 text-white rounded-lg hover:scale-110 transition-transform"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {addingMoney && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-neutral-900 text-white rounded-3xl"
              >
                <h4 className="text-sm font-bold mb-4">Add Money</h4>
                <div className="flex gap-2 mb-4">
                  {[100, 500, 1000].map(amount => (
                    <button 
                      key={amount}
                      onClick={() => setTopUpAmount(amount)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${topUpAmount === amount ? 'bg-white text-neutral-900' : 'bg-white/10 text-white hove:bg-white/20'}`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleTopUp}
                  className="w-full bg-white text-neutral-900 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-100"
                >
                  Confirm Top Up
                </button>
              </motion.div>
            )}
            
            <div className="mt-8 pt-6 border-t border-neutral-100 space-y-3">
              {(profile.role === 'admin' || user?.email === 'wahidrahaman0619@gmail.com' || user?.email === 'rewornstreet@gmail.com') && (
                <Link 
                  to="/admin"
                  className="w-full flex items-center justify-center gap-3 bg-neutral-900 text-white font-bold text-xs uppercase tracking-widest p-4 rounded-2xl hover:bg-neutral-800 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" /> Admin Panel
                </Link>
              )}

              {(profile.role === 'seller' || profile.role === 'admin') && (
                <Link 
                  to="/seller"
                  className="w-full flex items-center justify-center gap-3 bg-neutral-100 text-neutral-900 font-bold text-xs uppercase tracking-widest p-4 rounded-2xl hover:bg-neutral-200 transition-all"
                >
                  <Store className="w-4 h-4" /> Seller Dashboard
                </Link>
              )}

              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-3 text-red-500 hover:text-red-600 font-bold text-xs uppercase tracking-widest p-4 rounded-2xl hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-neutral-100 shadow-sm relative overflow-hidden">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-12 italic">Account settings</h1>

            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full bg-neutral-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-neutral-900 transition-all font-medium"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full bg-neutral-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-neutral-900 transition-all font-medium"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 block">Shipping Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-neutral-300" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-neutral-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-neutral-900 transition-all font-medium min-h-[120px]"
                    placeholder="Enter your street address, city, state and zip code..."
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 block">Profile Picture URL</label>
                <div className="relative">
                  <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                  <input
                    type="url"
                    value={formData.photoURL}
                    onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                    className="w-full bg-neutral-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-neutral-900 transition-all font-medium"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-2 italic">Paste an image URL to update your avatar.</p>
              </div>

              <div className="md:col-span-2 flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-neutral-900 text-white px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {saving ? 'Saving changes...' : 'Save Profile'} <Save className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
