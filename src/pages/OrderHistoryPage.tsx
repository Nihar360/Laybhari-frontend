import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Calendar, MapPin, ChevronRight, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

import { authService } from '../services/authService';

export const OrderHistoryPage: React.FC = () => {
  const { user, setAuthData } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Profile Securing Form State
  const [profileEmail, setProfileEmail] = useState<string>(user?.email || '');
  const [profileName, setProfileName] = useState<string>(user?.name || '');
  const [profilePassword, setProfilePassword] = useState<string>('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);

  // Modal for Viewing Full Order Detail
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setError(null);
    setProfileSuccessMsg(null);
    try {
      const res = await authService.updateProfile({
        name: profileName,
        email: profileEmail,
        password: profilePassword,
      });
      setAuthData(res);
      setProfileSuccessMsg('✓ Account details updated! You can now sign in with email & password.');
      setProfilePassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update account credentials');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadOrders();
  }, [user, navigate]);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryPayment = async (ord: Order) => {
    setError(null);
    try {
      const paymentInfo = await orderService.createPayment(ord.id);
      
      const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
          if ((window as any).Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const res = await loadRazorpayScript();
      if (!res) {
        setError('Failed to load Razorpay SDK');
        return;
      }

      const rawPhone = (ord.address?.phone || '').replace(/\D/g, '');
      const validContact = rawPhone.length >= 10 ? rawPhone.slice(-10) : '9999999999';

      const options = {
        key: paymentInfo.keyId,
        amount: paymentInfo.amount,
        currency: paymentInfo.currency,
        name: 'Laybhari Vlogs',
        description: `Order #${ord.id}`,
        order_id: paymentInfo.razorpayOrderId,
        prefill: {
          name: ord.address?.fullName || user?.name || '',
          email: user?.email || '',
          contact: validContact,
        },
        theme: {
          color: '#C2410C',
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI / QR Code',
                instruments: [
                  {
                    method: 'upi',
                    flows: ['qr', 'collect', 'intent'],
                  },
                ],
              },
            },
            sequence: ['block.upi', 'block.banks', 'block.other'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            await orderService.verifyPayment(ord.id, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            await loadOrders();
            navigate(`/order-confirmation/${ord.id}`);
          } catch (verifyErr: any) {
            setError(verifyErr.message || 'Payment verification failed.');
          }
        },
        modal: {
          ondismiss: () => {
            setError(`Payment window closed for Order #${ord.id}. Order remains PENDING.`);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment.');
    }
  };

  return (
    <div className="fade-in" style={{ padding: '32px 0 60px', backgroundColor: '#FAF6F0', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#382012' }}>
            YOUR ORDERS <span style={{ fontSize: '18px', fontWeight: 600, color: '#786C62' }}>({orders.length})</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#786C62', marginTop: '4px' }}>Track & view details of all your past spice purchases</p>
        </div>

        {/* Optional Account Security Card for Phone-only Users */}
        {(!user?.email || !user?.phone) && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #FED7AA', padding: '24px', marginBottom: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#382012', marginBottom: '4px' }}>
              🔒 Secure Your Account (Optional)
            </h3>
            <p style={{ fontSize: '13px', color: '#786C62', marginBottom: '16px' }}>
              Add an email address & password so you can also log in with credentials anytime across web and mobile devices.
            </p>

            {profileSuccessMsg && (
              <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
                {profileSuccessMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Your Name"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Set Password</label>
                <input
                  type="password"
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px' }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', backgroundColor: '#C2410C', opacity: isUpdatingProfile ? 0.6 : 1 }}
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Account Details'}
                </button>
              </div>
            </form>
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, marginBottom: '24px' }}>
            ⚠️ {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#786C62' }}>Loading your order history...</div>
        ) : orders.length === 0 ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '60px 20px', textAlign: 'center', margin: '20px 0' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#D97706' }}>
              <Package size={36} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#382012', marginBottom: '8px' }}>No Past Orders Yet</h2>
            <p style={{ fontSize: '14px', color: '#786C62', marginBottom: '24px' }}>Explore authentic Laybhari spices and place your first order!</p>
            <Link to="/shop" className="btn-primary" style={{ padding: '12px 28px' }}>
              Explore Spices & Products →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((ord) => {
              const formattedDate = new Date(ord.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              const isPaid = ord.paymentStatus === 'PAID';

              return (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E8DFD5',
                    padding: '24px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Top Bar of Card */}
                  <div className="order-card-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #FAF5EF', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 900, color: '#382012' }}>ORDER #{ord.id}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#786C62', fontWeight: 600 }}>
                        <Calendar size={14} color="#D97706" /> {formattedDate}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        backgroundColor: isPaid ? '#DCFCE7' : '#FEF3C7',
                        color: isPaid ? '#15803D' : '#B45309',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        border: isPaid ? '1px solid #86EFAC' : '1px solid #FDE68A'
                      }}>
                        {isPaid ? 'PAID' : 'PAYMENT PENDING'}
                      </span>
                      <span style={{ fontSize: '18px', fontWeight: 900, color: '#C2410C' }}>
                        ₹{ord.totalAmount.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="order-card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#786C62', textTransform: 'uppercase', marginBottom: '8px' }}>ITEMS ({ord.items.length})</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {ord.items.map((item) => (
                          <span
                            key={item.id}
                            style={{
                              backgroundColor: '#FAF5EF',
                              border: '1px solid #E8DFD5',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              color: '#382012',
                              fontWeight: 700
                            }}
                          >
                            {item.productName} ({item.weightLabel}) × {item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <p style={{ fontSize: '12px', color: '#786C62', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} color="#C2410C" /> Deliver to: <strong style={{ color: '#382012' }}>{ord.address.city}</strong>
                      </p>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!isPaid && (
                          <button
                            onClick={() => handleRetryPayment(ord)}
                            className="btn-primary"
                            style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 800, backgroundColor: '#C2410C' }}
                          >
                            💳 PAY NOW
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="btn-outline"
                          style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          View Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="fade-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '640px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E8DFD5', paddingBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#382012' }}>
                    Order Details #{selectedOrder.id}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#786C62' }}>Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</span>
                </div>
                <button onClick={() => setSelectedOrder(null)} style={{ fontSize: '20px', color: '#9CA3AF', cursor: 'pointer' }}>✕</button>
              </div>

              {/* Delivery Address */}
              <div style={{ backgroundColor: '#FAF5EF', borderRadius: '12px', padding: '16px', border: '1px solid #E8DFD5', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 900, color: '#C2410C', textTransform: 'uppercase', marginBottom: '6px' }}>DELIVERY ADDRESS</h4>
                <p style={{ fontSize: '14px', fontWeight: 800, color: '#382012', marginBottom: '2px' }}>{selectedOrder.address.fullName} (📞 {selectedOrder.address.phone})</p>
                <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: '1.4' }}>
                  {selectedOrder.address.line1}{selectedOrder.address.line2 ? `, ${selectedOrder.address.line2}` : ''}, {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}
                </p>
              </div>

              {/* Items List */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 900, color: '#786C62', textTransform: 'uppercase', marginBottom: '10px' }}>ORDER ITEMS</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E8DFD5' }}>
                      <div>
                        <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#291E14', margin: 0 }}>{item.productName}</h5>
                        <span style={{ fontSize: '12px', color: '#B45309' }}>Weight: {item.weightLabel} | Qty: {item.quantity} × ₹{item.price.toFixed(0)}</span>
                      </div>
                      <span style={{ fontSize: '15px', fontWeight: 900, color: '#C2410C' }}>₹{item.lineTotal.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div style={{ borderTop: '1px solid #E8DFD5', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4B5563', marginBottom: '6px' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 800, color: '#382012' }}>₹{selectedOrder.subtotal.toFixed(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4B5563', marginBottom: '12px' }}>
                  <span>Shipping Fee</span>
                  <span style={{ fontWeight: 800, color: selectedOrder.shippingFee === 0 ? '#15803D' : '#382012' }}>
                    {selectedOrder.shippingFee === 0 ? 'FREE' : `₹${selectedOrder.shippingFee.toFixed(0)}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '10px', borderTop: '1px dashed #E8DFD5' }}>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#382012' }}>Total Amount</span>
                  <span style={{ fontSize: '22px', fontWeight: 900, color: '#C2410C' }}>₹{selectedOrder.totalAmount.toFixed(0)}</span>
                </div>
              </div>

              <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <button onClick={() => setSelectedOrder(null)} className="btn-primary" style={{ padding: '10px 24px' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
