import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Flame, Wheat, Sparkles, Gift } from 'lucide-react';
import { Product, Category } from '../types';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { LoadingView, EmptyView, ErrorView } from '../components/StateViews';
import { HeroSlider } from '../components/HeroSlider';
import { FeaturesSection } from '../components/FeaturesSection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribedMsg, setSubscribedMsg] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const pageData = await productService.getProducts(0, 10);
      const fetched = pageData.content || [];
      setProducts(fetched);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not connect to Laybhari Backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribedMsg(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribedMsg(false), 4000);
    }
  };

  return (
    <div className="fade-in">
      
      {/* Sarita's Kitchen Style Interactive Hero Slider */}
      <HeroSlider />

      {/* Modern Premium Ecommerce Features Section */}
      <FeaturesSection />

      {/* SHOP BY CATEGORY Section (Compact Apple / Shopify Minimalist Redesign) */}
      <section className="category-section-wrapper" style={{ padding: '28px 0', backgroundColor: '#FAF6F0', borderBottom: '1px solid #E8DFD5' }}>
        <div className="container">
          <div className="section-title-wrapper" style={{ marginBottom: '16px' }}>
            <h2 className="section-title" style={{ fontSize: '18px', letterSpacing: '1px' }}>SHOP BY CATEGORY</h2>
          </div>

          <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { id: 1, name: 'MASALAS', icon: <Flame size={18} /> },
              { id: 2, name: 'MIXES (PITH)', icon: <Wheat size={18} /> },
              { id: 3, name: 'UNIQUE PRODUCTS', icon: <Sparkles size={18} /> },
              { id: 4, name: 'COMBO OFFERS', icon: <Gift size={18} /> },
            ].map((cat) => (
              <div
                key={cat.id}
                className="category-item-card"
                onClick={() => navigate(`/shop?category=${cat.name.toLowerCase()}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderBottom: '2px solid transparent',
                  borderRadius: '4px 4px 0 0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderBottomColor = '#D97706';
                  const icon = e.currentTarget.querySelector('.cat-icon') as HTMLElement;
                  if (icon) icon.style.color = '#D97706';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderBottomColor = 'transparent';
                  const icon = e.currentTarget.querySelector('.cat-icon') as HTMLElement;
                  if (icon) icon.style.color = '#382012';
                }}
              >
                <span className="cat-icon" style={{ color: '#382012', transition: 'color 0.2s ease', display: 'flex' }}>
                  {cat.icon}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#382012', letterSpacing: '0.5px' }}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS / FEATURED Section */}
      <section className="featured-products-section" style={{ padding: '60px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="featured-header-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
              <h2 className="featured-title" style={{ fontSize: '24px', fontWeight: 900, color: '#382012', letterSpacing: '1px', textTransform: 'uppercase' }}>FEATURED PRODUCTS</h2>

            <Link to="/shop" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              View All
            </Link>
          </div>

          {isLoading ? (
            <LoadingView message="Fetching best seller spices..." />
          ) : errorMessage ? (
            <ErrorView error={errorMessage} onRetry={loadData} />
          ) : products.length === 0 ? (
            <EmptyView title="No Products Available" message="No products loaded from backend server." onRefresh={loadData} />
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
