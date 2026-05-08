import { supabase } from './lib/supabase';

const MOCK_PRODUCTS = [
  {
    name: "Vintage 90s Flannel Shirt",
    description: "Authentic oversized flannel shirt from the mid-90s. Soft, heavy cotton with a timeless plaid pattern. Perfect for layering.",
    price: 35,
    category: "shirt",
    image: "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?auto=format&fit=crop&q=80&w=1000",
    stock: 1,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "Classic Denim Carpenter Pants",
    description: "Relaxed fit denim with workwear detailing. Beautiful heavy fading and natural wear marks. A true street staple.",
    price: 55,
    category: "pant",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=1000",
    stock: 1,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "Retro Graphic T-Shirt",
    description: "Single-stitch vintage tee with high-quality screen print. Features a unique 80s concert graphic. Minimal cracking on print.",
    price: 25,
    category: "t-shirt",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000",
    stock: 1,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "RCB IPL Official Jersey",
    description: "Authentic RCB IPL match jersey with the iconic red and gold colors. Breathable mesh fabric, perfect for the streets or the stands. Play Bold.",
    price: 45,
    category: "jersey",
    image: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&q=80&w=1000",
    stock: 5,
    isFeatured: true,
    sellerId: "SELLER_123",
    createdAt: new Date().toISOString()
  },
  {
    name: "Vintage Varsity Jacket",
    description: "Heavyweight wool body with leather sleeves. Classic high-school silhouette with authentic patches.",
    price: 120,
    category: "jacket",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000",
    stock: 1,
    isFeatured: true,
    sellerId: "SELLER_123",
    createdAt: new Date().toISOString()
  },
  {
    name: "Baggy Cargo Pants",
    description: "Multi-pocket olive cargos with adjustable hem. Rugged aesthetic and maximum utility.",
    price: 48,
    category: "pant",
    image: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=1000",
    stock: 1,
    isFeatured: false,
    createdAt: new Date().toISOString()
  },
  {
    name: "Distressed Band Tee",
    description: "Faded black t-shirt with classic rock band graphics. Natural distressing and soft hand-feel.",
    price: 32,
    category: "t-shirt",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000",
    stock: 1,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "Heavy Cotton Oversized Tee",
    description: "Ultra-heavyweight 300gsm cotton t-shirt with a boxy street fit. Premium quality and built to last.",
    price: 30,
    category: "t-shirt",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000",
    stock: 10,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "Vintage College Graphic Tee",
    description: "Authentic 80s university t-shirt with crackled screen print. Soft, worn-in feel.",
    price: 28,
    category: "t-shirt",
    image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=1000",
    stock: 1,
    isFeatured: false,
    createdAt: new Date().toISOString()
  },
  {
    name: "Acid Wash Street Tee",
    description: "Custom acid-washed finish for a unique vintage charcoal look. Single-stitch detailing.",
    price: 34,
    category: "t-shirt",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000",
    stock: 5,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "Vintage Snapback Cap",
    description: "Classic 90s snapback with retro embroidery. Durable cotton twill and adjustable strap for a perfect street fit.",
    price: 22,
    category: "cap",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1000",
    stock: 15,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "Classic Canvas Sneakers",
    description: "Timeless high-top canvas sneakers with a vintage wash. Durable vulcanized rubber sole and comfortable cushioning.",
    price: 65,
    category: "shoe",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000",
    stock: 8,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "RCB Vintage Practice Jersey",
    description: "A rare find! Classic RCB practice jersey from the early IPL seasons. Soft cotton-poly blend with high-quality team embroidery.",
    price: 38,
    category: "jersey",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000",
    stock: 2,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "Classic Football Jersey",
    description: "Vibrant vintage football jersey with authentic team detailing and moisture-wicking fabric. Iconic 90s silhouette.",
    price: 42,
    category: "jersey",
    image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&q=80&w=1000",
    stock: 6,
    isFeatured: true,
    createdAt: new Date().toISOString()
  }
];

export async function seedDatabase() {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  
  const ADMIN_PHONES = ['+918927668457', '+919733910142'];
  const isAdmin = user && (user.email === "rewornstreet@gmail.com" || (user.phone && ADMIN_PHONES.includes(user.phone)));
  
  if (!isAdmin) {
    console.log("Seeding skipped: Not authenticated as admin.");
    return;
  }

  try {
    // Fetch existing products to avoid duplicates
    const { data: existingProducts, error: fetchError } = await supabase
      .from('products')
      .select('name');
    
    if (fetchError) throw fetchError;
    const existingNames = new Set(existingProducts?.map(p => p.name));
    
    console.log("Checking for new products to seed...");
    let addedCount = 0;
    
    const newProducts = MOCK_PRODUCTS.filter(prod => !existingNames.has(prod.name));
    
    if (newProducts.length > 0) {
      const { error: insertError } = await supabase
        .from('products')
        .insert(newProducts);
      
      if (insertError) throw insertError;
      addedCount = newProducts.length;
    }
    
    if (addedCount > 0) {
      console.log(`Seeding complete! Added ${addedCount} new products.`);
    } else {
      console.log("Database is already up to date with mock products.");
    }

    // Seed mock order for seller demo
    const { data: existingOrders, error: orderFetchError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
    
    if (orderFetchError) throw orderFetchError;

    if (!existingOrders || existingOrders.length === 0) {
      const { error: orderInsertError } = await supabase
        .from('orders')
        .insert([{
          userId: "mock-user",
          userEmail: "customer@example.com",
          address: "123 Street, Mumbai",
          phone: "+91 9876543210",
          items: [
            {
              id: "mock-rcb-jersey",
              name: "RCB IPL Official Jersey",
              price: 45,
              quantity: 2,
              sellerId: "SELLER_123"
            }
          ],
          total: 90,
          status: "delivered",
          createdAt: new Date().toISOString()
        }]);
      
      if (orderInsertError) throw orderInsertError;
      console.log("Mock order seeded for seller demo.");
    }
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}
