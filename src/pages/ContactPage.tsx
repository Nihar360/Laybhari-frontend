import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="fade-in" style={{ padding: '32px 0 60px', backgroundColor: '#FAF6F0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#382012' }}>CONTACT LAY BHARI VLOGS</h1>
          <p style={{ fontSize: '14px', color: '#786C62', marginTop: '4px' }}>Have questions about our spices or orders? We are here to help!</p>
        </div>

        <div className="contact-main-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          
          {/* Info Card */}
          <div style={{ backgroundColor: '#382012', color: '#FFFFFF', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FDE68A', letterSpacing: '0.5px' }}>LAY BHARI VLOGS STORE</h3>

            <a href="tel:+919876543210" style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#FFFFFF', textDecoration: 'none' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FED7AA', flexShrink: 0 }}>
                <Phone size={20} />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#FED7AA', fontWeight: 700 }}>Mobile Call Support</p>
                <p style={{ fontSize: '15px', fontWeight: 800 }}>+91 98765 43210</p>
              </div>
            </a>

            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#FFFFFF', textDecoration: 'none' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', flexShrink: 0 }}>
                <MessageSquare size={20} />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#FED7AA', fontWeight: 700 }}>WhatsApp Chat Support</p>
                <p style={{ fontSize: '15px', fontWeight: 800 }}>+91 98765 43210</p>
              </div>
            </a>

            <a href="mailto:support@laybharivlogs.com" style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#FFFFFF', textDecoration: 'none' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FED7AA', flexShrink: 0 }}>
                <Mail size={20} />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#FED7AA', fontWeight: 700 }}>Email Address</p>
                <p style={{ fontSize: '14px', fontWeight: 800 }}>support@laybharivlogs.com</p>
              </div>
            </a>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FED7AA', flexShrink: 0 }}>
                <MapPin size={20} />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#FED7AA', fontWeight: 700 }}>Store & Warehouse Address</p>
                <p style={{ fontSize: '14px', fontWeight: 700 }}>Pune, Maharashtra - 411001, India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#382012', marginBottom: '16px' }}>Send Us a Message</h3>
            
            {submitted && (
              <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
                ✓ Thank you! Your message has been sent. We will contact you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Your Name *</label>
                <input type="text" required placeholder="Full Name" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Mobile Phone / Email *</label>
                <input type="text" required placeholder="Mobile or Email" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Message / Inquiry *</label>
                <textarea rows={4} required placeholder="How can we help you with your spice order?" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px', outline: 'none' }}></textarea>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', backgroundColor: '#C2410C' }}>
                Send Message <Send size={16} />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
