import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, MapPin, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadOrder(Number(id));
    }
  }, [id]);

  const loadOrder = async (orderId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load order confirmation details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', backgroundColor: '#FAF6F0', minHeight: '70vh' }}>
        <p style={{ fontSize: '16px', color: '#786C62', fontWeight: 600 }}>Loading order confirmation details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ padding: '60px 0', backgroundColor: '#FAF6F0', minHeight: '70vh' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
            ⚠️ {error || 'Order not found'}
          </div>
          <Link to="/orders" className="btn-primary" style={{ padding: '12px 24px' }}>
            View Order History
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fade-in" style={{ padding: '40px 0 60px', backgroundColor: '#FAF6F0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        
        {/* Success Card */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E8DFD5', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '3px solid #86EFAC' }}>
            <CheckCircle2 size={44} />
          </div>

          <span style={{ display: 'inline-block', backgroundColor: '#FEF3C7', color: '#B45309', fontSize: '12px', fontWeight: 800, padding: '4px 14px', borderRadius: '20px', marginBottom: '12px', border: '1px solid #FDE68A' }}>
            ORDER #{order.id} PLACED
          </span>

          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#382012', marginBottom: '8px' }}>
            Thank You! Your Order Has Been Placed.
          </h1>
          <p style={{ fontSize: '15px', color: '#786C62', marginBottom: '24px' }}>
            We've received your order and are preparing your fresh Laybhari spices for delivery!
          </p>

          <div className="order-confirm-meta" style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: '#FAF5EF', padding: '12px 20px', borderRadius: '12px', border: '1px solid #E8DFD5', fontSize: '13px', color: '#382012', fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} color="#D97706" /> {formattedDate}
            </span>
            <span className="order-meta-sep">|</span>
            <span style={{ color: '#15803D', fontWeight: 800 }}>Status: {order.status}</span>
            <span className="order-meta-sep">|</span>
            <span>Payment: {order.paymentStatus} (COD)</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="order-confirm-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          
          {/* Delivery Address Box */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#382012', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#C2410C" /> DELIVERY ADDRESS
            </h3>

            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>{order.address.fullName}</h4>
            <p style={{ fontSize: '13px', color: '#C2410C', fontWeight: 700, marginBottom: '10px' }}>📞 {order.address.phone}</p>
            <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: '1.5' }}>
              {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}<br />
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
          </div>

          {/* Payment & Status Summary */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#382012', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} color="#C2410C" /> BILL DETAILS
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>
              <span>Items Subtotal</span>
              <span style={{ fontWeight: 800, color: '#382012' }}>₹{order.subtotal.toFixed(0)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4B5563', marginBottom: '12px' }}>
              <span>Shipping Fee</span>
              <span style={{ fontWeight: 800, color: order.shippingFee === 0 ? '#15803D' : '#382012' }}>
                {order.shippingFee === 0 ? 'FREE (₹0)' : `₹${order.shippingFee.toFixed(0)}`}
              </span>
            </div>

            <hr style={{ borderColor: '#E8DFD5', margin: '12px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '16px', fontWeight: 900, color: '#382012' }}>Grand Total</span>
              <span style={{ fontSize: '22px', fontWeight: 900, color: '#C2410C' }}>₹{order.totalAmount.toFixed(0)}</span>
            </div>
          </div>

        </div>

        {/* Ordered Items Table */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '32px' }}>
          <div style={{ padding: '16px 24px', backgroundColor: '#FAF5EF', borderBottom: '1px solid #E8DFD5', fontSize: '14px', fontWeight: 900, color: '#382012' }}>
            ORDERED ITEMS
          </div>

          <div style={{ padding: '0 24px' }}>
            {order.items.map((item, idx) => (
              <div
                key={item.id}
                className="order-confirm-item-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 1fr 1fr 1fr',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid #E8DFD5'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#291E14', marginBottom: '2px' }}>{item.productName}</h4>
                  <span style={{ fontSize: '12px', color: '#B45309', fontWeight: 700 }}>Weight: {item.weightLabel}</span>
                </div>

                <div style={{ textAlign: 'center', fontSize: '14px', color: '#382012', fontWeight: 700 }}>
                  ₹{item.price.toFixed(0)}
                </div>

                <div style={{ textAlign: 'center', fontSize: '14px', color: '#382012', fontWeight: 700 }}>
                  Qty: {item.quantity}
                </div>

                <div style={{ textAlign: 'right', fontSize: '15px', fontWeight: 900, color: '#C2410C' }}>
                  ₹{item.lineTotal.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="order-confirm-actions" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/orders" className="btn-outline" style={{ padding: '12px 28px', fontWeight: 800 }}>
            View Order History
          </Link>
          <Link to="/shop" className="btn-primary" style={{ padding: '12px 28px' }}>
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};
