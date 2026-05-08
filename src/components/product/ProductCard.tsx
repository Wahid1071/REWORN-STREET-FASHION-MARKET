import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { motion } from 'motion/react';
import { useCart } from '../../context/CartContext';
import { Plus } from 'lucide-react';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="group relative"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-100 rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="mt-4 flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-neutral-900 group-hover:underline">
              {product.name}
            </h3>
            <p className="mt-1 text-xs text-neutral-500 uppercase tracking-widest">{product.category}</p>
          </div>
          <p className="text-sm font-medium text-neutral-900">₹{product.price}</p>
        </div>
      </Link>
      <button 
        onClick={() => addToCart(product)}
        className="absolute bottom-16 right-4 p-3 bg-white text-neutral-900 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-900 hover:text-white"
        aria-label="Add to cart"
      >
        <Plus className="h-5 w-5" />
      </button>
    </motion.div>
  );
};

export default ProductCard;
