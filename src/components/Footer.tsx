import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#2E1A0F', color: '#E8DFD5', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '40px' }}>
      <div className="container footer-grid" style={{ paddingBottom: '40px' }}>
        
        {/* Column 1: About Us */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <img
              src="/logo-badge.jpg"
              alt="Laybhari Seal"
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #D97706' }}
            />
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '1px' }}>LAY BHARI VLOGS</h3>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#FED7AA', marginBottom: '16px' }}>
            LAY BHARI VLOGS हे आपला आरोग्याची काळजी घेत, घरगुती पद्धतीने मसाले, मिश्रण आणि उपयुक्त उत्पादने देण्याचा आमचा प्रयत्न आहे.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '12px', textDecoration: 'none', fontWeight: 700 }}>▶ YouTube</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '12px', textDecoration: 'none', fontWeight: 700 }}>📷 Instagram</a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '1px', marginBottom: '14px', textTransform: 'uppercase' }}>QUICK LINKS</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', padding: 0 }}>
            <li><Link to="/" style={{ color: '#E8DFD5', textDecoration: 'none' }}>Home</Link></li>
            <li><Link to="/shop" style={{ color: '#E8DFD5', textDecoration: 'none' }}>Storefront</Link></li>
            <li><Link to="/about" style={{ color: '#E8DFD5', textDecoration: 'none' }}>About Us</Link></li>
            <li><Link to="/contact" style={{ color: '#E8DFD5', textDecoration: 'none' }}>Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 3: Legal & Customer Service */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '1px', marginBottom: '14px', textTransform: 'uppercase' }}>LEGAL & POLICIES</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', padding: 0 }}>
            <li><Link to="/privacy-policy" style={{ color: '#E8DFD5', textDecoration: 'none' }}>Privacy Policy</Link></li>
            <li><Link to="/terms" style={{ color: '#E8DFD5', textDecoration: 'none' }}>Terms & Conditions</Link></li>
            <li><Link to="/refund-policy" style={{ color: '#E8DFD5', textDecoration: 'none' }}>Cancellation & Refund</Link></li>
            <li><Link to="/shipping-policy" style={{ color: '#E8DFD5', textDecoration: 'none' }}>Shipping & Delivery</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '1px', marginBottom: '14px', textTransform: 'uppercase' }}>GET IN TOUCH</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <a href="tel:+919876543210" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E8DFD5', textDecoration: 'none' }}>
              <Phone size={16} color="#D97706" />
              <span>+91 98765 43210</span>
            </a>
            <a href="mailto:support@laybharivlogs.com" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E8DFD5', textDecoration: 'none' }}>
              <Mail size={16} color="#D97706" />
              <span>support@laybharivlogs.com</span>
            </a>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <MapPin size={16} color="#D97706" style={{ marginTop: '2px' }} />
              <span>Pune, Maharashtra - 411001</span>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div style={{ backgroundColor: '#1E110A', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '16px 0', fontSize: '12px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span>© 2026 LAY BHARI VLOGS. All Rights Reserved.</span>
          <span>Made with ❤️ in Maharashtra, India</span>
        </div>
      </div>
    </footer>
  );
};
