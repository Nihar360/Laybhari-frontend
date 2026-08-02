import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  Truck,
  Leaf,
  Heart,
  ShieldCheck,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartPage: React.FC = () => {
  const {
    cartItems,
    grandTotal,
    totalItems,
    isLoading,
    errorMsg,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const freeShippingThreshold = 499;
  const isFreeShipping = grandTotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - grandTotal);
  const shippingProgress = Math.min(100, (grandTotal / freeShippingThreshold) * 100);

  return (
    <div className="fade-in" style={{ padding: '32px 0 60px', backgroundColor: '#FAF6F0' }}>
      <div className="container">
        
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#382012' }}>
              SHOPPING CART <span style={{ fontSize: '18px', fontWeight: 600, color: '#786C62' }}>({totalItems} items)</span>
            </h1>
          </div>

          <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#C2410C', textDecoration: 'none' }}>
            ‹ Continue Shopping
          </Link>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, marginBottom: '20px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '60px 20px', textAlign: 'center', margin: '20px 0' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#D97706' }}>
              <ShoppingBag size={36} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#382012', marginBottom: '8px' }}>Your Shopping Cart is Empty</h2>
            <p style={{ fontSize: '14px', color: '#786C62', marginBottom: '24px' }}>Explore authentic Laybhari spices and add items to your cart!</p>
            <Link to="/shop" className="btn-primary" style={{ padding: '12px 28px' }}>
              Explore Products Catalog →
            </Link>
          </div>
        ) : (
          <div className="cart-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
            
            {/* Left Column: Backend Product Lines Table */}
            <div>
              <div className="cart-items-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
                
                {/* Table Header */}
                <div className="cart-table-header" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1fr 40px', padding: '14px 24px', backgroundColor: '#FAF5EF', borderBottom: '1px solid #E8DFD5', fontSize: '11px', fontWeight: 900, color: '#786C62', letterSpacing: '0.5px' }}>
                  <div>PRODUCT</div>
                  <div style={{ textAlign: 'center' }}>PRICE</div>
                  <div style={{ textAlign: 'center' }}>QUANTITY</div>
                  <div style={{ textAlign: 'right' }}>TOTAL</div>
                  <div></div>
                </div>

                {/* Table Rows (Fetched from Database GET /api/cart) */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="cart-table-row"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1.2fr 1fr 40px',
                        alignItems: 'center',
                        padding: '20px 24px',
                        borderBottom: '1px solid #E8DFD5',
                        opacity: isLoading ? 0.7 : 1
                      }}
                    >
                      {/* Product Column */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '64px', height: '64px', backgroundColor: '#FAF5EF', borderRadius: '8px', border: '1px solid #E8DFD5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', flexShrink: 0 }}>
                          {item.productImageUrl ? (
                            <img src={item.productImageUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          ) : (
                            <span style={{ fontSize: '28px' }}>🌶️</span>
                          )}
                        </div>

                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#291E14', marginBottom: '4px' }}>{item.productName}</h4>
                          <p style={{ fontSize: '12px', color: '#B45309', fontWeight: 700, marginBottom: '2px' }}>Net Weight: {item.weightLabel}</p>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803D' }}>✓ Saved in DB</span>
                        </div>
                      </div>

                      {/* Unit Price Column */}
                      <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: 800, color: '#382012' }}>
                        ₹{Number(item.unitPrice).toFixed(0)}
                      </div>

                      {/* Quantity Counter (Calls PUT /api/cart/{cartItemId}) */}
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E8DFD5', borderRadius: '6px', backgroundColor: '#FFFFFF' }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isLoading}
                            style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#382012', cursor: 'pointer' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ width: '32px', textAlign: 'center', fontSize: '13px', fontWeight: 800 }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isLoading}
                            style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#382012', cursor: 'pointer' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Line Total Column */}
                      <div style={{ textAlign: 'right', fontSize: '16px', fontWeight: 900, color: '#291E14' }}>
                        ₹{Number(item.lineTotal).toFixed(0)}
                      </div>

                      {/* Delete Icon (Calls DELETE /api/cart/{cartItemId}) */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={isLoading}
                          style={{ color: '#9CA3AF', cursor: 'pointer', transition: 'color 0.2s' }}
                          title="Remove from cart"
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#DC2626')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Right Column: ORDER SUMMARY & Free Shipping Progress */}
            <div>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#382012', letterSpacing: '0.5px', marginBottom: '20px', textTransform: 'uppercase' }}>
                  ORDER SUMMARY
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B5563', marginBottom: '12px' }}>
                  <span>Subtotal ({totalItems} Items)</span>
                  <span style={{ fontWeight: 800, color: '#291E14' }}>₹{grandTotal.toFixed(0)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B5563', marginBottom: '6px' }}>
                  <span>Shipping</span>
                  <span style={{ fontWeight: 800, color: isFreeShipping ? '#15803D' : '#382012' }}>
                    {isFreeShipping ? '₹0' : '₹50'}
                  </span>
                </div>

                {isFreeShipping && (
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#15803D', marginBottom: '16px' }}>
                    You are eligible for FREE shipping!
                  </p>
                )}

                <hr style={{ borderColor: '#E8DFD5', margin: '16px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
                  <div>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#382012' }}>Total</span>
                    <p style={{ fontSize: '11px', color: '#786C62' }}>(Inclusive of all taxes)</p>
                  </div>
                  <span style={{ fontSize: '26px', fontWeight: 900, color: '#C2410C' }}>
                    ₹{(grandTotal + (isFreeShipping ? 0 : 50)).toFixed(0)}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '14px', fontWeight: 900, backgroundColor: '#C2410C', marginBottom: '12px' }}
                >
                  PROCEED TO CHECKOUT <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => navigate('/shop')}
                  className="btn-outline"
                  style={{ width: '100%', textAlign: 'center', padding: '12px', borderColor: '#C2410C', color: '#C2410C', fontWeight: 800 }}
                >
                  CONTINUE SHOPPING
                </button>
              </div>

              {/* Free Shipping Progress Box */}
              <div style={{ backgroundColor: '#FAF6F0', borderRadius: '12px', border: '1px solid #E8DFD5', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Truck size={20} color="#D97706" />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#382012' }}>
                    {isFreeShipping ? '🎉 You unlocked FREE shipping!' : `You are ₹${amountNeededForFreeShipping.toFixed(0)} away from FREE shipping!`}
                  </span>
                </div>

                <div style={{ height: '8px', backgroundColor: '#E8DFD5', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${shippingProgress}%`,
                      backgroundColor: '#15803D',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>

                {!isFreeShipping && (
                  <p style={{ fontSize: '11px', color: '#786C62', textAlign: 'right' }}>
                    ₹{amountNeededForFreeShipping.toFixed(0)} more to go
                  </p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Feature Badges Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E8DFD5', marginTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#382012' }}>100% Natural</h4>
              <p style={{ fontSize: '11px', color: '#786C62' }}>No Preservatives</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#382012' }}>Homemade</h4>
              <p style={{ fontSize: '11px', color: '#786C62' }}>Made With Love</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#382012' }}>Free Shipping</h4>
              <p style={{ fontSize: '11px', color: '#786C62' }}>On Orders Above ₹499</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#382012' }}>Secure Payment</h4>
              <p style={{ fontSize: '11px', color: '#786C62' }}>100% Safe & Secure</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
