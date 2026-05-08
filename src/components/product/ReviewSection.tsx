import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Review } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Trash2, Send, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('productId', productId)
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      setReviews(data as Review[]);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    if (!newReview.comment.trim()) return;

    setSubmitting(true);
    try {
      const reviewData = {
        productId,
        userId: user.id || user.uid,
        userName: profile.displayName || 'Anonymous User',
        userPhoto: profile.photoURL || '',
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from('reviews')
        .insert([reviewData]);
      
      if (error) throw error;
      
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error: any) {
      console.error('Error adding review:', error);
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) throw error;
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (error: any) {
      console.error('Error deleting review:', error);
      alert('Error: ' + error.message);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-20 border-t border-neutral-100 pt-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold italic mb-2">Customer Feedback</h2>
          <div className="flex items-center gap-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Number(averageRating) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-sm font-bold text-neutral-900">{averageRating} / 5.0</span>
            <span className="text-sm text-neutral-400">({reviews.length} reviews)</span>
          </div>
        </div>

        {user && (
          <button 
            onClick={() => {
              const el = document.getElementById('review-form');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold uppercase tracking-widest bg-neutral-900 text-white px-6 py-3 rounded-xl hover:bg-neutral-800 transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Reviews List */}
        <div className="space-y-8">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-neutral-50 h-32 rounded-2xl"></div>
            ))
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 bg-neutral-50 rounded-[2rem] border border-dashed border-neutral-200">
              <MessageSquare className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-400 italic">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm relative group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {review.userPhoto ? (
                      <img src={review.userPhoto} className="w-10 h-10 rounded-full object-cover" alt="" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">{review.userName}</h4>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed">{review.comment}</p>
                
                {(user?.uid === review.userId || profile?.role === 'admin') && (
                  <button 
                    onClick={() => handleDelete(review.id)}
                    className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Review Form */}
        {user ? (
          <div id="review-form" className="lg:sticky lg:top-32 h-fit bg-neutral-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-display italic mb-8">Drop your feedback</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-3 block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className={`p-2 transition-all ${newReview.rating >= star ? 'text-accent-400' : 'text-neutral-700 hover:text-neutral-500'}`}
                      >
                        <Star className={`w-8 h-8 ${newReview.rating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-3 block">Your Comment</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-accent-400 transition-all min-h-[150px] placeholder:text-neutral-600"
                    placeholder="Tell us what you think about this vintage piece..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-white text-neutral-900 font-bold uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-neutral-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {submitting ? 'Sharing...' : 'Publish Review'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-100 p-12 rounded-[2.5rem] border border-neutral-200 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
            <Star className="w-12 h-12 text-neutral-300 mb-6" />
            <h3 className="text-xl font-bold mb-4">Want to leave a review?</h3>
            <p className="text-neutral-500 text-sm max-w-xs mx-auto mb-8">
              Sign in to your account to share your experience with the community.
            </p>
            <Link to="/login" className="bg-neutral-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
