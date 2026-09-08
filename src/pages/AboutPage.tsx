import React from 'react';
import { Heart, ShieldCheck, Award } from 'lucide-react';
import { OptimizedImage } from '../components/OptimizedImage';

export const AboutPage: React.FC = () => {
  return (
    <div className="fade-in" style={{ padding: '32px 0 60px', backgroundColor: '#FAF6F0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/logo-badge.jpg"
            alt="Laybhari Seal"
            style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #D97706', margin: '0 auto 12px', objectFit: 'cover' }}
          />
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#382012' }}>ABOUT LAY BHARI VLOGS</h1>
          <p style={{ fontSize: '16px', fontWeight: 800, color: '#C2410C', marginTop: '6px' }}>
            पारंपरिक चव, आपल्या कुटुंबासाठी!
          </p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '28px', lineHeight: 1.8, fontSize: '14px', color: '#4B5563', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <p style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700, color: '#382012' }}>
            LAY BHARI VLOGS हे आपला आरोग्याची काळजी घेत, घरगुती पद्धतीने मसाले, मिश्रण आणि उपयुक्त उत्पादने देण्याचा आमचा प्रामाणिक प्रयत्न आहे.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Our mission is to bring authentic Maharashtrian flavors directly from traditional kitchens to homes across India. Every batch of Goda Masala, Malvani Masala, Kanda Lasun Masala, and Besan Pith is prepared using 100% natural, hand-picked ingredients without any chemical preservatives or artificial colors.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid #E8DFD5', textAlign: 'center' }}>
            <div style={{ backgroundColor: '#FAF5EF', padding: '16px', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <Heart size={22} />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#382012' }}>Made With Love</h4>
              <p style={{ fontSize: '12px', color: '#786C62', marginTop: '2px' }}>Homemade traditional recipes</p>
            </div>
            <div style={{ backgroundColor: '#FAF5EF', padding: '16px', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <ShieldCheck size={22} />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#382012' }}>100% Pure</h4>
              <p style={{ fontSize: '12px', color: '#786C62', marginTop: '2px' }}>No chemical preservatives</p>
            </div>
            <div style={{ backgroundColor: '#FAF5EF', padding: '16px', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <Award size={22} />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#382012' }}>Authentic Taste</h4>
              <p style={{ fontSize: '12px', color: '#786C62', marginTop: '2px' }}>Authentic Maharashtra</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
