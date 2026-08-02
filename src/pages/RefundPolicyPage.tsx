import React from 'react';
import { RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="fade-in" style={{ padding: '32px 0 60px', backgroundColor: '#FAF6F0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <RotateCcw size={28} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#382012' }}>CANCELLATION & REFUND POLICY</h1>
          <p style={{ fontSize: '13px', color: '#786C62', marginTop: '4px' }}>Last updated: August 2026 · Laybhari Vlogs Spices</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', lineHeight: '1.7', color: '#4B5563', fontSize: '14px' }}>
          
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>1. Order Cancellation Policy</h2>
          <p style={{ marginBottom: '20px' }}>
            You can request to cancel your order within <strong>2 hours</strong> of placing it, provided the order has not yet been dispatched for shipping. Once dispatched, orders cannot be cancelled.
          </p>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>2. Returns & Replacement Policy for Food Products</h2>
          <p style={{ marginBottom: '12px' }}>
            Due to hygiene and food safety regulations, unopened spice packs can only be returned or replaced if:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li>The product package received is physically damaged, torn, or leaked in transit.</li>
            <li>An incorrect item was delivered compared to your order confirmation.</li>
            <li>The product received has expired or exceeds its shelf life.</li>
          </ul>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>3. How to File a Replacement / Refund Request</h2>
          <p style={{ marginBottom: '12px' }}>
            To file a replacement or refund claim, please notify us within <strong>7 days</strong> of delivery:
          </p>
          <div style={{ backgroundColor: '#FAF5EF', padding: '16px 20px', borderRadius: '10px', border: '1px solid #E8DFD5', fontSize: '13px', marginBottom: '20px' }}>
            <p style={{ fontWeight: 800, color: '#382012', marginBottom: '4px' }}>📩 Contact Support</p>
            <p>Email photos of the damaged package and order ID to <strong>support@laybharivlogs.com</strong> or WhatsApp us at <strong>+91 98765 43210</strong>.</p>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>4. Refund Processing Time</h2>
          <p style={{ marginBottom: '20px' }}>
            Approved refunds will be processed back to your original payment method (UPI / Debit Card / NetBanking) via Razorpay within <strong>5 to 7 business days</strong>.
          </p>

        </div>

      </div>
    </div>
  );
};
