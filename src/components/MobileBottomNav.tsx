import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  onOpenAuthModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenAuthModal }) => {
  const location = useLocation();
  const { totalItems } = useCart();
  const { token } = useAuth();

  // Hide bottom nav on ProductDetailPage if sticky add-to-cart bar is active to avoid overlap clutter
  const isProductDetailPage = location.pathname.startsWith('/product/');

  if (isProductDetailPage) {
    return null;
  }

  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={20} /> },
    { label: 'Shop', path: '/shop', icon: <ShoppingBag size={20} /> },
    {
      label: 'Cart',
      path: '/cart',
      icon: (
        <div style={{ position: 'relative', display: 'flex' }}>
          <ShoppingCart size={20} />
          {totalItems > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-10px',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 900,
                borderRadius: '10px',
                padding: '2px 5px',
                lineHeight: 1,
                minWidth: '16px',
                textAlign: 'center'
              }}
            >
              {totalItems}
            </span>
          )}
        </div>
      )
    },
    {
      label: 'Account',
      path: token ? '/orders' : '#',
      icon: <User size={20} />,
      onClick: !token ? (e: React.MouseEvent) => { e.preventDefault(); onOpenAuthModal(); } : undefined
    }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.label}
            to={item.path}
            onClick={item.onClick}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon">{item.icon}</div>
            <span className="mobile-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
