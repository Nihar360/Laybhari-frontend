import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User as UserIcon, ShoppingBag, LogOut, Package, MapPin, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuthModal }) => {
  const { user, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="main-header" style={{ backgroundColor: '#000000ff', borderBottom: '1px solid #D9820B', position: 'relative', zIndex: 100, boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
      <div className="container header-container">

        {/* Left Side: Mobile Menu 3-Lines Button + Logo */}
        <div className="left-brand-nav">
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={22} color="#FFFFFF" /> : <Menu size={22} color="#FFFFFF" />}
          </button>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="/logo-badge.jpg"
              alt="Laybhari Vlogs Logo"
              className="header-badge-logo"
            />
          </Link>

          <nav className="nav-group">
            <Link to="/" className="nav-link">HOME</Link>
            <Link to="/shop" className="nav-link">PRODUCTS</Link>
            <Link to="/about" className="nav-link">ABOUT US</Link>
            <Link to="/contact" className="nav-link">CONTACT</Link>
          </nav>
        </div>

        {/* Far-Right Action Icons: Search, Account, Cart */}
        <div className="header-actions">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}
            title="Search"
          >
            <Search size={20} />
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/orders" title="My Orders" style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '12px', fontWeight: 700 }}>
                <Package size={18} color="#FFFFFF" /> <span className="action-text">Orders</span>
              </Link>
              <Link to="/addresses" title="My Addresses" style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '12px', fontWeight: 700 }}>
                <MapPin size={18} color="#FFFFFF" /> <span className="action-text">Addresses</span>
              </Link>
              <button onClick={logout} title="Logout" style={{ color: '#FFFFFF', display: 'flex', padding: '6px', opacity: 0.9 }}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuthModal} title="Login / Account" style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
              <UserIcon size={20} />
            </button>
          )}

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            title="Shopping Cart"
            style={{
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#26160C',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 900,
                  borderRadius: '50%',
                  minWidth: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                  border: '2px solid #000000ff'
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">HOME</Link>
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">PRODUCTS</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">ABOUT US</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">CONTACT</Link>
        </div>
      )}

      {/* Search Bar Dropdown */}
      {isSearchOpen && (
        <div style={{ backgroundColor: '#26160C', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 0' }}>
          <div className="container">
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '600px', margin: '0 auto' }}>
              <input
                type="text"
                placeholder="Search Laybhari spices, Goda masala, Besan pith..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: '1px solid #000000ff',
                  outline: 'none',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#291E14'
                }}
                autoFocus
              />
              <button type="submit" className="btn-primary" style={{ backgroundColor: '#000000ff', color: '#FFFFFF' }}>Search</button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
