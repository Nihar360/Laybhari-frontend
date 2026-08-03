import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Flame, Wheat, Sparkles, Gift, Tag } from 'lucide-react';
import { Product, Category } from '../types';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { LoadingView, EmptyView, ErrorView } from '../components/StateViews';
import { HeroSlider } from '../components/HeroSlider';
import { FeaturesSection } from '../components/FeaturesSection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribedMsg, setSubscribedMsg] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [pageData, catData] = await Promise.all([
        productService.getProducts(0, 10),
        productService.getCategories().catch(() => []),
      ]);
      setProducts(pageData.content || []);
      setCategories(catData || []);
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

  // Fallback default categories if database has none yet
  const displayCategories: Category[] = categories.length > 0 ? categories : [
    { id: 1, name: 'MASALAS' },
    { id: 2, name: 'MIXES (PITH)' },
    { id: 3, name: 'UNIQUE PRODUCTS' },
    { id: 4, name: 'COMBO OFFERS' },
  ];

  return (
    <div className="fade-in">
      
      {/* Sarita's Kitchen Style Interactive Hero Slider */}
      <HeroSlider />

      {/* Modern Premium Ecommerce Features Section */}
      <FeaturesSection />

      {/* SHOP BY CATEGORY Section (Dynamic Admin Category Images & Compact Spice Pills) */}
      <section className="category-section-wrapper" style={{ padding: '20px 0', backgroundColor: '#FAF6F0', borderBottom: '1px solid #E8DFD5' }}>
        <div className="container">
          <div className="categories-flex-wrap" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
            {/* All Products Quick Filter */}
            <div
              className="category-pill-card"
              onClick={() => navigate('/shop')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 20px 8px 10px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E8DFD5',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 2px 8px rgba(56, 32, 18, 0.05)',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = '#D97706';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(217, 119, 6, 0.18)';
                e.currentTarget.style.backgroundColor = '#FFFBEB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#E8DFD5';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(56, 32, 18, 0.05)';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '2px solid #FDE68A',
              }}>
                <Tag size={16} color="#D97706" />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#382012', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                All Products
              </span>
            </div>

            {/* Dynamic Admin Categories */}
            {displayCategories.map((cat) => (
              <div
                key={cat.id}
                className="category-pill-card"
                onClick={() => navigate(`/shop?category=${cat.id}`)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 20px 8px 10px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E8DFD5',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 2px 8px rgba(56, 32, 18, 0.05)',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = '#D97706';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(217, 119, 6, 0.18)';
                  e.currentTarget.style.backgroundColor = '#FFFBEB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E8DFD5';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(56, 32, 18, 0.05)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF3C7',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '2px solid #FDE68A',
                }}>
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Tag size={16} color="#D97706" />
                  )}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#382012', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
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
