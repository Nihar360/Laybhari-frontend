import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FloatingCartBar: React.FC = () => {
  const location = useLocation();
  const { totalItems, grandTotal } = useCart();

  // Hide on Cart, Checkout, Order Confirmation, Addresses pages or when cart is empty
  const hiddenPaths = ['/cart', '/checkout', '/addresses', '/orders'];
  const isHiddenPath = hiddenPaths.some(path => location.pathname.startsWith(path));

  if (totalItems === 0 || isHiddenPath) {
    return null;
  }

  // Adjust bottom offset if on Product Detail Page (where sticky add-to-cart bar is at bottom: 0)
  const isProductPage = location.pathname.startsWith('/product/');

  return (
    <div
      className="floating-cart-bar"
      style={{
        position: 'fixed',
        bottom: isProductPage ? '72px' : '68px',
        left: '16px',
        right: '16px',
        zIndex: 998,
        backgroundColor: '#382012',
        color: '#FFFFFF',
        borderRadius: '12px',
        padding: '12px 18px',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        textDecoration: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ShoppingBag size={18} color="#FFFFFF" />
        </div>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'} · ₹{Number(grandTotal).toFixed(0)}
          </span>
          <span style={{ fontSize: '11px', color: '#FED7AA', fontWeight: 500 }}>
            Taxes & charges included
          </span>
        </div>
      </div>

      <Link
        to="/cart"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#FDE68A',
          fontWeight: 900,
          fontSize: '13px',
          textDecoration: 'none'
        }}
      >
        View Cart <ArrowRight size={16} />
      </Link>
    </div>
  );
};
