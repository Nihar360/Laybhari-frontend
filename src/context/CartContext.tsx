import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CartResponse, Product } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

interface GuestCartItem {
  id: number;
  productVariantId: number;
  productName: string;
  weightLabel: string;
  unitPrice: number;
  productImageUrl?: string;
  quantity: number;
  lineTotal: number;
}

interface CartContextType {
  cartItems: CartItem[];
  grandTotal: number;
  totalItems: number;
  isLoading: boolean;
  errorMsg: string | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  fetchCart: () => Promise<void>;
  addToCart: (variantId: number, quantity?: number, productDetails?: { name: string; imageUrl?: string; price: number; weightLabel: string }) => Promise<void>;
  buyNow: (variantId: number, quantity?: number, productDetails?: { name: string; imageUrl?: string; price: number; weightLabel: string }) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  mergeGuestCart: () => Promise<void>;
  addDefaultProductToCart: (product: Product) => Promise<void>;
}

const GUEST_CART_KEY = 'laybhari_guest_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const applyCartResponse = (res: CartResponse) => {
    setCartItems(res.items || []);
    setGrandTotal(res.grandTotal || 0);
    setTotalItems(res.totalItems || 0);
  };

  const loadGuestCart = (): GuestCartItem[] => {
    try {
      const saved = localStorage.getItem(GUEST_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const saveGuestCart = (items: GuestCartItem[]) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    const totals = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartItems(items as unknown as CartItem[]);
    setGrandTotal(totals);
    setTotalItems(count);
  };

  const fetchCart = async () => {
    if (!token) {
      const guestItems = loadGuestCart();
      const totals = guestItems.reduce((sum, item) => sum + item.lineTotal, 0);
      const count = guestItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartItems(guestItems as unknown as CartItem[]);
      setGrandTotal(totals);
      setTotalItems(count);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await cartService.getCart();
      applyCartResponse(res);
    } catch (err: any) {
      console.error('Error fetching backend cart:', err);
      setErrorMsg(err.message || 'Failed to fetch cart from server.');
    } finally {
      setIsLoading(false);
    }
  };

  const mergeGuestCart = async () => {
    const guestItems = loadGuestCart();
    if (guestItems.length === 0) return;

    setIsLoading(true);
    try {
      for (const item of guestItems) {
        await cartService.addToCart({ productVariantId: item.productVariantId, quantity: item.quantity });
      }
      localStorage.removeItem(GUEST_CART_KEY);
      const res = await cartService.getCart();
      applyCartResponse(res);
    } catch (err: any) {
      console.error('Failed to merge guest cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      mergeGuestCart().then(() => fetchCart());
    } else {
      fetchCart();
    }
  }, [token]);

  const addToCart = async (
    variantId: number,
    quantity = 1,
    productDetails?: { name: string; imageUrl?: string; price: number; weightLabel: string }
  ) => {
    if (!token) {
      // Guest Cart LocalStorage Handling
      const guestItems = loadGuestCart();
      const existingIdx = guestItems.findIndex(i => i.productVariantId === variantId);

      let updated: GuestCartItem[];
      if (existingIdx > -1) {
        updated = [...guestItems];
        updated[existingIdx].quantity += quantity;
        updated[existingIdx].lineTotal = updated[existingIdx].quantity * updated[existingIdx].unitPrice;
      } else {
        const newItem: GuestCartItem = {
          id: Date.now(),
          productVariantId: variantId,
          productName: productDetails?.name || 'Laybhari Product',
          weightLabel: productDetails?.weightLabel || 'Standard Pack',
          unitPrice: productDetails?.price || 199,
          productImageUrl: productDetails?.imageUrl,
          quantity,
          lineTotal: (productDetails?.price || 199) * quantity,
        };
        updated = [...guestItems, newItem];
      }
      saveGuestCart(updated);
      setIsCartOpen(true);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await cartService.addToCart({ productVariantId: variantId, quantity });
      applyCartResponse(res);
      setIsCartOpen(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add item to cart.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!token) {
      const guestItems = loadGuestCart();
      if (quantity <= 0) {
        const updated = guestItems.filter(i => i.id !== cartItemId && i.productVariantId !== cartItemId);
        saveGuestCart(updated);
      } else {
        const updated = guestItems.map(i => {
          if (i.id === cartItemId || i.productVariantId === cartItemId) {
            return { ...i, quantity, lineTotal: quantity * i.unitPrice };
          }
          return i;
        });
        saveGuestCart(updated);
      }
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await cartService.updateCartItem(cartItemId, { quantity });
      applyCartResponse(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update item quantity.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    if (!token) {
      const guestItems = loadGuestCart();
      const updated = guestItems.filter(i => i.id !== cartItemId && i.productVariantId !== cartItemId);
      saveGuestCart(updated);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await cartService.removeCartItem(cartItemId);
      applyCartResponse(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to remove item from cart.');
    } finally {
      setIsLoading(false);
    }
  };

  const buyNow = async (
    variantId: number,
    quantity = 1,
    productDetails?: { name: string; imageUrl?: string; price: number; weightLabel: string }
  ) => {
    if (!token) {
      const singleItem: GuestCartItem = {
        id: Date.now(),
        productVariantId: variantId,
        productName: productDetails?.name || 'Laybhari Product',
        weightLabel: productDetails?.weightLabel || 'Standard Pack',
        unitPrice: productDetails?.price || 199,
        productImageUrl: productDetails?.imageUrl,
        quantity,
        lineTotal: (productDetails?.price || 199) * quantity,
      };
      saveGuestCart([singleItem]);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const currentCart = await cartService.getCart();
      if (currentCart && currentCart.items && currentCart.items.length > 0) {
        for (const item of currentCart.items) {
          await cartService.removeCartItem(item.id);
        }
      }
      const res = await cartService.addToCart({ productVariantId: variantId, quantity });
      applyCartResponse(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process Buy Now.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addDefaultProductToCart = async (product: Product) => {
    if (!product.variants || product.variants.length === 0) {
      throw new Error('No weight variant available for this product.');
    }
    const firstVariant = product.variants[0];
    await addToCart(firstVariant.id, 1, {
      name: product.name,
      imageUrl: product.imageUrl || undefined,
      price: firstVariant.price,
      weightLabel: firstVariant.weightLabel,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        grandTotal,
        totalItems,
        isLoading,
        errorMsg,
        isCartOpen,
        setIsCartOpen,
        fetchCart,
        addToCart,
        buyNow,
        updateQuantity,
        removeFromCart,
        mergeGuestCart,
        addDefaultProductToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
