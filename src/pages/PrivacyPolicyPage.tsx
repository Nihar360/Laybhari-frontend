import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="fade-in" style={{ padding: '32px 0 60px', backgroundColor: '#FAF6F0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <Shield size={28} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#382012' }}>PRIVACY POLICY</h1>
          <p style={{ fontSize: '13px', color: '#786C62', marginTop: '4px' }}>Last updated: August 2026 · Laybhari Vlogs</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', lineHeight: '1.7', color: '#4B5563', fontSize: '14px' }}>
          
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>1. Introduction</h2>
          <p style={{ marginBottom: '20px' }}>
            Welcome to <strong>Laybhari Vlogs</strong> ("we", "our", "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this policy, or our practices with regards to your personal information, please contact us at <strong>support@laybharivlogs.com</strong>.
          </p>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>2. Information We Collect</h2>
          <p style={{ marginBottom: '12px' }}>
            We collect personal information that you voluntarily provide to us when you register on the website, place an order, or contact us.
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li><strong>Personal Details:</strong> Name, mobile phone number, and email address.</li>
            <li><strong>Delivery Addresses:</strong> Street address, city, state, and postal code for shipping your spice orders.</li>
            <li><strong>Payment Information:</strong> Processed securely via Razorpay. We do NOT store your credit card numbers, UPI PINs, or net banking passwords.</li>
          </ul>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>3. How We Use Your Information</h2>
          <p style={{ marginBottom: '12px' }}>We use personal information collected via our website for business purposes described below:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li>To fulfill and manage your spice orders, payments, and delivery tracking.</li>
            <li>To send 1-click Mobile OTP authentication codes for secure checkout.</li>
            <li>To respond to user inquiries, customer support requests, and order updates.</li>
          </ul>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>4. Payment Security & Data Sharing</h2>
          <p style={{ marginBottom: '20px' }}>
            All online transactions are securely encrypted and processed through <strong>Razorpay Payment Gateway</strong> (PCI-DSS Level 1 Compliant). We do not sell, rent, or trade your personal information with third parties for marketing purposes.
          </p>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>5. Grievance Officer & Contact Us</h2>
          <p style={{ marginBottom: '12px' }}>
            In accordance with Indian Information Technology Act 2000 and rules made thereunder, the contact details of the Grievance Officer are provided below:
          </p>
          <div style={{ backgroundColor: '#FAF5EF', padding: '16px 20px', borderRadius: '10px', border: '1px solid #E8DFD5', fontSize: '13px' }}>
            <p style={{ fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Laybhari Vlogs Grievance Cell</p>
            <p>Email: grievance@laybharivlogs.com | Phone: +91 98765 43210</p>
            <p>Address: Laybhari Spices & Foods, Pune, Maharashtra - 411001</p>
          </div>

        </div>

      </div>
    </div>
  );
};
