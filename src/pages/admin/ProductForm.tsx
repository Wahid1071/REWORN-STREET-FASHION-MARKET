import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['shirt', 'pant', 't-shirt', 'jersey', 'jacket'];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'shirt',
    image: '',
    stock: 1,
    isFeatured: false,
    createdAt: new Date().toISOString()
  });

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          if (data) {
            setFormData(data as Product);
          }
        } catch (err: any) {
          console.error("Error fetching product:", err);
        } finally {
          setInitialLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (id) {
        const { error } = await supabase
          .from('products')
          .update({
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock)
          })
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            createdAt: new Date().toISOString()
          }]);
        
        if (error) throw error;
      }
      navigate('/admin');
    } catch (err: any) {
      console.error('Error saving product:', err);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-20 text-center">Loading product...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/admin" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Link>

      <h1 className="text-4xl font-display font-bold mb-12">
        {id ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-2xl border border-neutral-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Product Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-neutral-900/5 transition-all"
              placeholder="e.g. Vintage 90s Shirt"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-5 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-neutral-900/5 transition-all"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-5 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-neutral-900/5 transition-all resize-none"
            placeholder="Tell the story of this piece..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Price ($)</label>
            <input
              required
              type="number"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-5 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-neutral-900/5 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Initial Stock</label>
            <input
              required
              type="number"
              value={formData.stock}
              onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
              className="w-full px-5 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-neutral-900/5 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Image URL</label>
          <input
            required
            type="url"
            value={formData.image}
            onChange={e => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-5 py-3 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-neutral-900/5 transition-all"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isFeatured"
            checked={formData.isFeatured}
            onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
          />
          <label htmlFor="isFeatured" className="text-sm font-medium text-neutral-900">Featured Product (Shown on Home Page)</label>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-neutral-900 text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
          {id ? 'Update Product' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}
