import React from 'react';
import { Loader2, PackageX, AlertTriangle } from 'lucide-react';

interface LoadingViewProps {
  message?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ message = 'Loading authentic Laybhari masalas...' }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <Loader2 className="animate-spin" size={40} style={{ color: '#D97706', marginBottom: '16px' }} />
    <p style={{ fontSize: '15px', fontWeight: 600, color: '#786C62' }}>{message}</p>
  </div>
);

interface EmptyViewProps {
  title?: string;
  message?: string;
  onRefresh?: () => void;
}

export const EmptyView: React.FC<EmptyViewProps> = ({
  title = 'No Products Found',
  message = 'We could not find any products matching your search criteria.',
  onRefresh,
}) => (
  <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', margin: '20px 0' }}>
    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#B45309' }}>
      <PackageX size={32} />
    </div>
    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#382012', marginBottom: '8px' }}>{title}</h3>
    <p style={{ fontSize: '14px', color: '#786C62', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.5 }}>{message}</p>
    {onRefresh && (
      <button onClick={onRefresh} className="btn-primary">
        Refresh Catalog
      </button>
    )}
  </div>
);

interface ErrorViewProps {
  error?: string;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  error = 'Could not connect to Laybhari backend at http://localhost:8080.',
  onRetry,
}) => (
  <div style={{ textAlign: 'center', padding: '40px 24px', backgroundColor: '#FEF2F2', borderRadius: '16px', border: '1px solid #FCA5A5', margin: '20px 0' }}>
    <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#DC2626' }}>
      <AlertTriangle size={28} />
    </div>
    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#991B1B', marginBottom: '8px' }}>Connection Error</h3>
    <p style={{ fontSize: '14px', color: '#B91C1C', maxWidth: '500px', margin: '0 auto 20px', lineHeight: 1.5 }}>{error}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-primary" style={{ backgroundColor: '#DC2626' }}>
        Try Again
      </button>
    )}
  </div>
);
