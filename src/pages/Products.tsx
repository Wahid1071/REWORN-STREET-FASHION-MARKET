import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import ProductCard from '../components/product/ProductCard';
import { useSearchParams } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');
        if (category) {
          query = query.eq('category', category);
        }
        const { data, error } = await query;
        if (error) throw error;
        setProducts(data as Product[]);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-display font-bold">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}
        </h1>
        <p className="mt-2 text-neutral-500">Showing {products.length} items</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-[4/5] bg-neutral-200 rounded-lg" />
              <div className="h-4 bg-neutral-200 w-3/4 rounded" />
              <div className="h-4 bg-neutral-200 w-1/4 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-neutral-500">No products found in this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
