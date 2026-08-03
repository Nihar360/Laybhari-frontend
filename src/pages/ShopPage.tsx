import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, Category } from '../types';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { LoadingView, EmptyView, ErrorView } from '../components/StateViews';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Fetch categories on mount
  useEffect(() => {
    productService.getCategories()
      .then((cats) => setCategories(cats))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  // 2. Sync categoryParam from URL to selectedCategory
  useEffect(() => {
    if (categoryParam) {
      const numericId = Number(categoryParam);
      if (!isNaN(numericId) && numericId > 0) {
        setSelectedCategory(numericId);
      } else if (categories.length > 0) {
        const found = categories.find(
          (c) => c.name.toLowerCase() === categoryParam.toLowerCase()
        );
        if (found) {
          setSelectedCategory(found.id);
        }
      }
    } else {
      setSelectedCategory(null);
    }
  }, [categoryParam, categories]);

  // 3. Fetch products based on selectedCategory or searchQuery
  const loadProducts = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      let result: Product[] = [];
      if (selectedCategory !== null) {
        result = await productService.getProductsByCategory(selectedCategory);
      } else if (searchQuery.trim()) {
        result = await productService.searchProducts(searchQuery.trim());
      } else {
        const res = await productService.getProducts(0, 50);
        result = res.content || [];
      }

      setProducts(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load products from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="fade-in" style={{ padding: '40px 0 60px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#382012' }}>LAY BHARI STOREFRONT</h1>
          <p style={{ fontSize: '14px', color: '#786C62', marginTop: '4px' }}>Explore authentic Maharashtrian spices, Goda masala, Besan pith & combo offers</p>
        </div>

        {/* Filter Controls Bar */}
        <div className="shop-filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', backgroundColor: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
          
          {/* Category Chips */}
          <div className="shop-category-strip" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={() => { setSelectedCategory(null); setSearchParams({}); }}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 700,
                border: '1px solid #E8DFD5',
                backgroundColor: selectedCategory === null ? '#D97706' : '#FFFFFF',
                color: selectedCategory === null ? '#FFFFFF' : '#382012'
              }}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setSearchParams({ category: String(cat.id) }); }}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: '1px solid #E8DFD5',
                  backgroundColor: selectedCategory === cat.id ? '#D97706' : '#FFFFFF',
                  color: selectedCategory === cat.id ? '#FFFFFF' : '#382012'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Bar Input */}
          <div style={{ display: 'flex', gap: '8px', minWidth: '280px' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #E8DFD5', fontSize: '13px', outline: 'none' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="btn-outline" style={{ padding: '6px 12px' }}>
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Content State */}
        {isLoading ? (
          <LoadingView message="Loading products catalog..." />
        ) : errorMessage ? (
          <ErrorView error={errorMessage} onRetry={loadProducts} />
        ) : products.length === 0 ? (
          <EmptyView title="No Products Found" message="Try searching for something else or clearing filters." onRefresh={loadProducts} />
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
