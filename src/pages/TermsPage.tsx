import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="fade-in" style={{ padding: '32px 0 60px', backgroundColor: '#FAF6F0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <FileText size={28} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#382012' }}>TERMS & CONDITIONS</h1>
          <p style={{ fontSize: '13px', color: '#786C62', marginTop: '4px' }}>Last updated: August 2026 · Laybhari Vlogs Storefront</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', lineHeight: '1.7', color: '#4B5563', fontSize: '14px' }}>
          
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>1. Introduction</h2>
          <p style={{ marginBottom: '20px' }}>
            These Terms & Conditions govern your use of the <strong>Laybhari Vlogs</strong> website and online storefront. By accessing or purchasing authentic Maharashtrian spices from our store, you agree to comply with these terms.
          </p>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>2. Product Pricing & Availability</h2>
          <p style={{ marginBottom: '20px' }}>
            All prices listed on our website are in Indian Rupees (INR) and are inclusive of applicable taxes. We reserve the right to modify prices or discontinue products at any time without prior notice. Stock levels are updated dynamically.
          </p>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>3. Orders & Payments</h2>
          <p style={{ marginBottom: '20px' }}>
            Orders placed on Laybhari Vlogs are subject to acceptance and stock availability. Payments are processed securely via Razorpay. An order is deemed confirmed once payment verification is successfully received.
          </p>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>4. Intellectual Property</h2>
          <p style={{ marginBottom: '20px' }}>
            All content on this website, including brand logos, product names, recipe descriptions, images, and visual design elements, are the property of Laybhari Vlogs and protected by Indian copyright and intellectual property laws.
          </p>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '10px' }}>5. Governing Law</h2>
          <p style={{ marginBottom: '20px' }}>
            These terms are governed by and construed in accordance with the laws of India. Any disputes arising out of your use of this site shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra.
          </p>

        </div>

      </div>
    </div>
  );
};
