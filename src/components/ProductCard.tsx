import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const currentVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const newPrice = currentVariant ? currentVariant.price : (product.price || 0);
  const oldPrice = Math.round(Number(newPrice) * 1.25);

  return (
    <Link
      to={`/product/${product.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div
        className="prod-card-container"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 8px 24px rgba(45, 26, 16, 0.04)',
          position: 'relative',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 16px 36px rgba(45, 26, 16, 0.09)';
          const img = e.currentTarget.querySelector('.prod-card-img') as HTMLElement;
          if (img) img.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(45, 26, 16, 0.04)';
          const img = e.currentTarget.querySelector('.prod-card-img') as HTMLElement;
          if (img) img.style.transform = 'scale(1)';
        }}
      >
        {/* Product Image Container */}
        <div
          className="prod-card-img-box"
          style={{
            height: '210px',
            backgroundColor: '#FCFBF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '24px',
            overflow: 'hidden'
          }}
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="prod-card-img"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '48px', display: 'block' }}>🌶️</span>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {product.categoryName || 'LAY BHARI SPICE'}
              </span>
            </div>
          )}

          {!product.isActive && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '12px',
                letterSpacing: '1px'
              }}
            >
              OUT OF STOCK
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="prod-card-details" style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          {/* Product Name */}
          <h3
            className="prod-card-title"
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#382012',
              lineHeight: 1.35,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height: '44px'
            }}
          >
            {product.name}
          </h3>

          {/* Single Line Price */}
          <div className="prod-card-price-row" style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
            <span className="prod-card-price" style={{ fontSize: '16px', fontWeight: 800, color: '#D97706' }}>
              From Rs. {Number(newPrice).toFixed(0)}
            </span>
            <span className="prod-card-old-price" style={{ fontSize: '13px', fontWeight: 500, color: '#9CA3AF', textDecoration: 'line-through' }}>
              Rs. {oldPrice}
            </span>
          </div>

        </div>
      </div>
    </Link>
  );
};
