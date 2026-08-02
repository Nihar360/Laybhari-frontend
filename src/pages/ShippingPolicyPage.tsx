import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="fade-in" style={{ padding: '32px 0 60px', backgroundColor: '#FAF6F0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <Truck size={28} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#382012' }}>SHIPPING & DELIVERY POLICY</h1>
          <p style={{ fontSize: '13px', color: '#786C62', marginTop: '4px' }}>Fast Pan-India Delivery · Laybhari Vlogs Spices</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', lineHeight: '1.7', color: '#4B5563', fontSize: '14px' }}>
          
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>1. Shipping Timelines</h2>
          <p style={{ marginBottom: '20px' }}>
            All spice orders are freshly packed and dispatched from our warehouse in Pune within <strong>24 to 48 hours</strong> of order placement.
          </p>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>2. Estimated Delivery Time</h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li><strong>Maharashtra & Goa:</strong> 2 to 3 business days.</li>
            <li><strong>Rest of India (Metro Cities):</strong> 3 to 5 business days.</li>
            <li><strong>Rest of India (Tier 2/3 Cities):</strong> 5 to 7 business days.</li>
          </ul>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>3. Shipping Charges</h2>
          <p style={{ marginBottom: '20px' }}>
            We offer <strong>FREE Shipping</strong> on all orders worth <strong>₹499 or more</strong> across India. For orders below ₹499, a nominal flat shipping fee of <strong>₹50</strong> is charged at checkout.
          </p>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>4. Order Tracking</h2>
          <p style={{ marginBottom: '20px' }}>
            Once your order is shipped, you will receive an SMS and email notification with your courier tracking number. You can also view your live order status anytime in the <strong>My Orders</strong> section of your account.
          </p>

        </div>

      </div>
    </div>
  );
};
