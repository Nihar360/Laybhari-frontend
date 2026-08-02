import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    grandTotal,
    isLoading,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart
  } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleGoToCartPage = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 200,
        display: 'flex',
        justifyContent: 'flex-end',
        backdropFilter: 'blur(2px)'
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FFFFFF',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #E8DFD5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAF5EF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="#D97706" />
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012' }}>Your Shopping Cart</h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} style={{ color: '#786C62', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🛒</span>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#382012' }}>Your cart is empty</p>
              <p style={{ fontSize: '13px', color: '#786C62', marginTop: '4px' }}>Add authentic Laybhari spices to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #E8DFD5',
                    backgroundColor: '#FAF5EF',
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  <div style={{ width: '60px', height: '60px', backgroundColor: '#FFFFFF', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.productImageUrl ? (
                      <img src={item.productImageUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '24px' }}>🌶️</span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#291E14', marginBottom: '2px' }}>{item.productName}</h4>
                    <p style={{ fontSize: '11px', color: '#B45309', fontWeight: 700, marginBottom: '4px' }}>Net Weight: {item.weightLabel}</p>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#C2410C' }}>₹{Number(item.lineTotal).toFixed(0)}</div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading}
                        style={{ border: '1px solid #D97706', width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                      >
                        <Minus size={12} color="#D97706" />
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: 800 }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        style={{ border: '1px solid #D97706', width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                      >
                        <Plus size={12} color="#D97706" />
                      </button>
                    </div>
                  </div>

                  <button onClick={() => removeFromCart(item.id)} disabled={isLoading} style={{ color: '#DC2626', alignSelf: 'flex-start', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid #E8DFD5', backgroundColor: '#FAF5EF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 900, color: '#382012', marginBottom: '16px' }}>
              <span>Total Amount:</span>
              <span style={{ color: '#C2410C' }}>₹{grandTotal.toFixed(0)}</span>
            </div>
            <button
              onClick={handleGoToCartPage}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', backgroundColor: '#C2410C' }}
            >
              VIEW FULL CART PAGE <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
