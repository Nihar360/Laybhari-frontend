import React from 'react';
import { Leaf, HeartHandshake, Truck, ShieldCheck } from 'lucide-react';

interface FeatureItem {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const featuresData: FeatureItem[] = [
  {
    id: 1,
    title: '100% Natural',
    subtitle: 'No Preservatives',
    icon: <Leaf size={24} />,
  },
  {
    id: 2,
    title: 'Homemade',
    subtitle: 'Made With Love',
    icon: <HeartHandshake size={24} />,
  },
  {
    id: 3,
    title: 'Fast Delivery',
    subtitle: 'Across India',
    icon: <Truck size={24} />,
  },
  {
    id: 4,
    title: 'Safe & Secure',
    subtitle: '100% Secure Payments',
    icon: <ShieldCheck size={24} />,
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="features-section-wrapper" style={{ padding: '24px 0', backgroundColor: '#FAF6F0' }}>
      <div className="container">
        <div
          style={{
            backgroundColor: '#FFFDF9',
            borderRadius: '16px',
            border: '1px solid #F0E6D8',
            boxShadow: '0 4px 16px rgba(56, 32, 18, 0.04)',
            padding: '16px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            alignItems: 'center'
          }}
          className="features-single-bar"
        >
          {featuresData.map((feature, idx) => (
            <div
              key={feature.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                padding: '8px 16px',
                borderRight: idx < featuresData.length - 1 ? '1px solid #F0E6D8' : 'none',
                transition: 'all 0.25s ease',
                cursor: 'default'
              }}
              className="feature-bar-item"
              onMouseEnter={(e) => {
                const iconBox = e.currentTarget.querySelector('.feature-bar-icon') as HTMLElement;
                if (iconBox) iconBox.style.color = '#D97706';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const iconBox = e.currentTarget.querySelector('.feature-bar-icon') as HTMLElement;
                if (iconBox) iconBox.style.color = '#786C62';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                className="feature-bar-icon"
                style={{
                  color: '#786C62',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'color 0.25s ease'
                }}
              >
                {feature.icon}
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#382012', margin: 0, lineHeight: 1.2 }}>
                  {feature.title}
                </h4>
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#786C62', margin: '2px 0 0 0', lineHeight: 1.2 }}>
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
