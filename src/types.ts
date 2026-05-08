export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  createdAt: string;
  isFeatured?: boolean;
  sellerId?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userEmail?: string | null;
  address: string;
  phone: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sellerId?: string;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  photoURL: string | null;
  role: 'customer' | 'admin' | 'seller';
  sellerId?: string;
  applicationPending?: boolean;
  walletBalance?: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
