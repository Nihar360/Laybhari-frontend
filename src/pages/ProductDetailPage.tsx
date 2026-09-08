import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  Leaf,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import { LoadingView, ErrorView } from '../components/StateViews';
import { OptimizedImage } from '../components/OptimizedImage';
import { getDefaultSizes } from '../utils/imageUtils';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();
  const { token } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'howtouse' | 'storage' | 'reviews'>('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchProductData = async () => {
    if (!id) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const mainProduct = await productService.getProductById(Number(id));
      setProduct(mainProduct);

      // Select first active variant by default if present
      if (mainProduct.variants && mainProduct.variants.length > 0) {
        setSelectedVariant(mainProduct.variants[0]);
      }

      // Fetch related products
      const allProductsRes = await productService.getProducts(0, 10);
      const allProducts = allProductsRes.content || [];
      const filtered = allProducts.filter((p) => p.id !== mainProduct.id);
      setRelatedProducts(filtered);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load product details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setErrorMessage('Please select a weight variant first.');
      return;
    }
    setIsAdding(true);
    setErrorMessage(null);
    try {
      await addToCart(selectedVariant.id, quantity, {
        name: product?.name || 'Spice Product',
        imageUrl: product?.imageUrl || undefined,
        price: selectedVariant.price,
        weightLabel: selectedVariant.weightLabel,
      });
      setActionSuccessMsg(`Added ${quantity} x ${product?.name} (${selectedVariant.weightLabel}) to your cart!`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not add item to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      setErrorMessage('Please select a weight variant first.');
      return;
    }
    setIsAdding(true);
    setErrorMessage(null);
    try {
      await buyNow(selectedVariant.id, quantity, {
        name: product?.name || 'Spice Product',
        imageUrl: product?.imageUrl || undefined,
        price: selectedVariant.price,
        weightLabel: selectedVariant.weightLabel,
      });
      navigate('/cart');
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not process Buy Now.');
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) return <LoadingView message="Loading spice product details..." />;
  if (errorMessage && !product) return <ErrorView error={errorMessage} onRetry={fetchProductData} />;
  if (!product) return <ErrorView error="Product not found" onRetry={fetchProductData} />;

  const galleryImages = (product.imageUrls && product.imageUrls.length > 0)
    ? product.imageUrls
    : (product.imageUrl ? [product.imageUrl] : []);

  const reviewCount = product.reviewCount || 128;
  const currentPrice = selectedVariant ? selectedVariant.price : (product.variants && product.variants.length > 0 ? product.variants[0].price : 0);

  return (
    <div className="fade-in" style={{ padding: '24px 0 60px', backgroundColor: '#FAF6F0' }}>
      <div className="container">
        
        {/* Breadcrumb Navigation */}
        <nav style={{ fontSize: '13px', color: '#786C62', marginBottom: '24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#786C62', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link to="/shop" style={{ color: '#786C62', textDecoration: 'none' }}>{product.categoryName || 'Masalas'}</Link>
          <span>›</span>
          <span style={{ color: '#382012', fontWeight: 700 }}>{product.name}</span>
        </nav>

        {actionSuccessMsg && (
          <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, marginBottom: '20px' }}>
            ✓ {actionSuccessMsg}
          </div>
        )}

        {errorMessage && (
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, marginBottom: '20px' }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Main Product Details Layout Grid */}
        <div className="pdp-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '36px', marginBottom: '40px' }}>
          
          {/* Left Column: Vertical Thumbnails + Main Showcase Image */}
          <div className="pdp-gallery-col" style={{ display: 'flex', gap: '16px' }}>
            
            {galleryImages.length > 1 && (
              <div className="pdp-thumbnail-strip" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <button
                  className="pdp-thumb-arrow"
                  onClick={() => setSelectedImageIndex((prev) => Math.max(0, prev - 1))}
                  style={{ border: '1px solid #E8DFD5', borderRadius: '4px', padding: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                >
                  <ChevronUp size={16} color="#382012" />
                </button>

                {galleryImages.map((imgUrl, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className="pdp-thumb-item"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '8px',
                      border: selectedImageIndex === index ? '2px solid #D97706' : '1px solid #E8DFD5',
                      padding: '4px',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <OptimizedImage
                      src={imgUrl}
                      alt={`Thumbnail ${index + 1}`}
                      width={150}
                      loading="lazy"
                      sizes={getDefaultSizes('thumbnail')}
                      objectFit="cover"
                      style={{ borderRadius: '4px' }}
                    />
                  </div>
                ))}

                <button
                  className="pdp-thumb-arrow"
                  onClick={() => setSelectedImageIndex((prev) => Math.min(galleryImages.length - 1, prev + 1))}
                  style={{ border: '1px solid #E8DFD5', borderRadius: '4px', padding: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                >
                  <ChevronDown size={16} color="#382012" />
                </button>
              </div>
            )}

            <div
              className="pdp-showcase-box"
              style={{
                flex: 1,
                backgroundColor: '#FFFDF9',
                borderRadius: '16px',
                border: '1px solid #E8DFD5',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                minHeight: '440px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}
            >
              {galleryImages.length > 0 ? (
                <OptimizedImage
                  src={galleryImages[selectedImageIndex] || galleryImages[0]}
                  alt={product.name}
                  width={800}
                  loading="eager"
                  fetchPriority="high"
                  sizes={getDefaultSizes('detail')}
                  objectFit="contain"
                  style={{ maxWidth: '100%', maxHeight: '400px' }}
                />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <OptimizedImage
                    src="/logo-badge.jpg"
                    alt="Laybhari Seal"
                    width={120}
                    loading="eager"
                    objectFit="cover"
                    containerStyle={{ width: '120px', height: '120px', borderRadius: '50%', marginBottom: '16px', margin: '0 auto' }}
                  />
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#382012' }}>{product.name}</h3>
                </div>
              )}

              <OptimizedImage
                src="/logo-badge.jpg"
                alt="Laybhari Seal"
                width={100}
                loading="lazy"
                objectFit="cover"
                containerStyle={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '2px solid #FDE68A',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              />

              <button
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8DFD5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#786C62'
                }}
              >
                <Maximize2 size={16} />
              </button>
            </div>

          </div>

          {/* Right Column: Title, Real API Variants Selector, Price */}
          <div className="pdp-details-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            
            <h1 className="pdp-product-title" style={{ fontSize: '28px', fontWeight: 900, color: '#291E14', marginBottom: '8px' }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', color: '#F59E0B' }}>
                <Star size={16} fill="#F59E0B" />
                <Star size={16} fill="#F59E0B" />
                <Star size={16} fill="#F59E0B" />
                <Star size={16} fill="#F59E0B" />
                <Star size={16} fill="#F59E0B" />
              </div>
              <span style={{ fontSize: '13px', color: '#786C62' }}>({reviewCount} customer reviews)</span>
            </div>

            {/* Price (Reflects selected variant) */}
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#C2410C', marginBottom: '16px' }}>
              ₹{Number(currentPrice).toFixed(0)}
            </div>

            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6, marginBottom: '24px' }}>
              {product.description || 'Experience the authentic taste of Maharashtrian cuisine with our homemade spice blend.'}
            </p>

            {/* REAL API Product Variants Selector (Weight Options from Database) */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#382012', display: 'block', marginBottom: '8px' }}>
                Select Net Weight Variant:
              </span>
              {product.variants && product.variants.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 800,
                        border: selectedVariant?.id === variant.id ? '2px solid #C2410C' : '1px solid #E8DFD5',
                        backgroundColor: selectedVariant?.id === variant.id ? '#FFF8F0' : '#FFFFFF',
                        color: selectedVariant?.id === variant.id ? '#C2410C' : '#382012',
                        cursor: 'pointer'
                      }}
                    >
                      {variant.weightLabel} - ₹{Number(variant.price).toFixed(0)}
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '12px', color: '#DC2626' }}>No active weight options for this product.</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#382012' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E8DFD5', borderRadius: '6px', backgroundColor: '#FFFFFF' }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ width: '36px', height: '36px', fontSize: '18px', fontWeight: 700, color: '#382012', cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontSize: '14px', fontWeight: 800 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{ width: '36px', height: '36px', fontSize: '18px', fontWeight: 700, color: '#382012', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart (Disabled if no variant selected) */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || isAdding}
                className="btn-primary"
                style={{
                  flex: 1.2,
                  backgroundColor: '#C2410C',
                  padding: '14px',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 900,
                  opacity: (!selectedVariant || isAdding) ? 0.5 : 1,
                  cursor: (!selectedVariant || isAdding) ? 'not-allowed' : 'pointer'
                }}
              >
                <ShoppingCart size={18} /> {isAdding ? 'ADDING...' : 'ADD TO CART'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!selectedVariant || isAdding}
                className="btn-outline"
                style={{
                  flex: 1,
                  padding: '14px',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 900,
                  borderColor: '#C2410C',
                  color: '#C2410C',
                  opacity: (!selectedVariant || isAdding) ? 0.5 : 1
                }}
              >
                BUY NOW
              </button>
            </div>

            {/* Shipping Info Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', paddingTop: '20px', borderTop: '1px solid #E8DFD5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={18} color="#D97706" />
                <div>
                  <h6 style={{ fontSize: '11px', fontWeight: 800, color: '#382012' }}>Free Shipping</h6>
                  <p style={{ fontSize: '10px', color: '#786C62' }}>On orders above ₹499</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="#D97706" />
                <div>
                  <h6 style={{ fontSize: '11px', fontWeight: 800, color: '#382012' }}>Secure Payment</h6>
                  <p style={{ fontSize: '10px', color: '#786C62' }}>100% safe & secure</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={18} color="#D97706" />
                <div>
                  <h6 style={{ fontSize: '11px', fontWeight: 800, color: '#382012' }}>Easy Returns</h6>
                  <p style={{ fontSize: '10px', color: '#786C62' }}>7 days return policy</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Section: Tabs + You May Also Like */}
        <div className="pdp-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #E8DFD5', backgroundColor: '#FAF5EF', overflowX: 'auto' }}>
              {[
                { id: 'description', label: 'DESCRIPTION' },
                { id: 'ingredients', label: 'INGREDIENTS' },
                { id: 'howtouse', label: 'HOW TO USE' },
                { id: 'storage', label: 'STORAGE' },
                { id: 'reviews', label: `REVIEWS (${reviewCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '14px 18px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: activeTab === tab.id ? '#C2410C' : '#786C62',
                    borderBottom: activeTab === tab.id ? '2px solid #C2410C' : '2px solid transparent',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '28px', lineHeight: 1.7, fontSize: '14px', color: '#4B5563' }}>
              {activeTab === 'description' && (
                <div>
                  <p style={{ marginBottom: '20px' }}>
                    Our {product.name} is a traditional spice blend made using age-old recipes passed down through generations.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#382012', fontWeight: 700 }}>
                      <CheckCircle2 size={18} color="#C2410C" /> Authentic Maharashtrian taste
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#382012', fontWeight: 700 }}>
                      <CheckCircle2 size={18} color="#C2410C" /> Made with premium quality spices
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#382012', marginBottom: '8px' }}>Pure Ingredients:</h5>
                  <p>Red Chillies, Coriander Seeds, Cumin, Mustard Seeds, Turmeric, Cinnamon, Cloves, Cardamom, Black Pepper, Star Anise, Nutmeg, and Salt.</p>
                </div>
              )}

              {activeTab === 'howtouse' && (
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#382012', marginBottom: '8px' }}>Cooking Directions:</h5>
                  <p>Add 1-2 tbsp of {product.name} while sautéing onions and tomatoes for curry gravy.</p>
                </div>
              )}

              {activeTab === 'storage' && (
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#382012', marginBottom: '8px' }}>Storage Instructions:</h5>
                  <p>Store in a cool, dry, and hygienic place in an airtight container away from direct sunlight.</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: '#382012' }}>5.0</div>
                    <div>
                      <div style={{ color: '#F59E0B' }}>★★★★★</div>
                      <p style={{ fontSize: '12px', color: '#786C62' }}>Based on {reviewCount} verified buyer reviews</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Box: YOU MAY ALSO LIKE */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#382012', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                YOU MAY ALSO LIKE
              </h3>
              <Link to="/shop" style={{ fontSize: '12px', fontWeight: 800, color: '#C2410C', textDecoration: 'none' }}>
                View All
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {relatedProducts.slice(0, 4).map((relProd) => (
                <ProductCard key={relProd.id} product={relProd} />
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Sticky Mobile Add to Cart Bar (<767px) */}
      <div className="mobile-sticky-add-to-cart">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', color: '#786C62', fontWeight: 600 }}>Total Price</span>
          <span style={{ fontSize: '18px', fontWeight: 900, color: '#C2410C' }}>
            ₹{(Number(currentPrice) * quantity).toFixed(0)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Quantity Controls with min 44x44px touch targets */}
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E8DFD5', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              style={{ width: '36px', height: '44px', fontSize: '16px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}
            >
              -
            </button>
            <span style={{ padding: '0 6px', fontSize: '13px', fontWeight: 800 }}>{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              style={{ width: '36px', height: '44px', fontSize: '16px', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || isAdding}
            style={{
              height: '44px',
              padding: '0 14px',
              backgroundColor: '#C2410C',
              color: '#FFFFFF',
              borderRadius: '8px',
              fontWeight: 900,
              fontSize: '12px',
              border: 'none',
              cursor: (!selectedVariant || isAdding) ? 'not-allowed' : 'pointer',
              opacity: (!selectedVariant || isAdding) ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ShoppingCart size={15} /> {isAdding ? 'ADDING...' : 'ADD'}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={!selectedVariant || isAdding}
            style={{
              height: '44px',
              padding: '0 14px',
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              borderRadius: '8px',
              fontWeight: 900,
              fontSize: '12px',
              border: 'none',
              cursor: (!selectedVariant || isAdding) ? 'not-allowed' : 'pointer',
              opacity: (!selectedVariant || isAdding) ? 0.5 : 1
            }}
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
};
