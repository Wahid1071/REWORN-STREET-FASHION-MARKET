import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { Minus, Plus, ShoppingBag, ArrowLeft, Star } from 'lucide-react';
import ReviewSection from '../components/product/ReviewSection';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        if (data) {
          setProduct(data as Product);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/shop" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">{product.category}</span>
            <h1 className="text-5xl font-display font-bold leading-tight">{product.name}</h1>
            <p className="text-3xl font-medium mt-4">₹{product.price}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest">Description</h3>
            <p className="text-neutral-600 leading-relaxed max-w-lg">
              {product.description || "Our signature piece, designed for both form and function. Crafted with meticulous attention to detail using high-quality materials that stand the test of time."}
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t border-neutral-100">
            <div className="flex items-center space-x-6">
              <h3 className="text-sm font-bold uppercase tracking-widest">Quantity</h3>
              <div className="flex items-center border border-neutral-200 rounded-full px-2 py-1">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button 
              onClick={() => addToCart({ ...product })}
              className="w-full sm:w-auto bg-neutral-900 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest flex items-center justify-center hover:bg-neutral-800 transition-all group"
            >
              <ShoppingBag className="h-5 w-5 mr-3 group-hover:-translate-y-1 transition-transform" />
              Add to Bag
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 py-8 text-xs font-bold uppercase tracking-tighter text-neutral-500 border-t border-neutral-100">
            <div>Ships within 24-48 hours</div>
            <div>Free standard delivery</div>
            <div>Sustainable packaging</div>
            <div>30-day return policy</div>
          </div>
        </motion.div>
      </div>

      {/* Review Section */}
      <ReviewSection productId={product.id} />
    </div>
  );
}
