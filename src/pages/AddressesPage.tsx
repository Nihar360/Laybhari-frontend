import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, Home } from 'lucide-react';
import { addressService } from '../services/addressService';
import { useAuth } from '../context/AuthContext';
import { Address, AddressRequest } from '../types';

export const AddressesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressRequest>({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadAddresses();
  }, [user, navigate]);

  const loadAddresses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch saved addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      fullName: user?.name || '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.id, formData);
      } else {
        await addressService.addAddress(formData);
      }
      setIsModalOpen(false);
      await loadAddresses();
    } catch (err: any) {
      setError(err.message || 'Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await addressService.deleteAddress(id);
      await loadAddresses();
    } catch (err: any) {
      setError(err.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (addr: Address) => {
    if (addr.isDefault) return;
    try {
      await addressService.updateAddress(addr.id, {
        fullName: addr.fullName,
        phone: addr.phone,
        line1: addr.line1,
        line2: addr.line2,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        isDefault: true,
      });
      await loadAddresses();
    } catch (err: any) {
      setError(err.message || 'Failed to set default address');
    }
  };

  return (
    <div className="fade-in" style={{ padding: '32px 0 60px', backgroundColor: '#FAF6F0', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#382012' }}>
              SAVED ADDRESSES <span style={{ fontSize: '18px', fontWeight: 600, color: '#786C62' }}>({addresses.length})</span>
            </h1>
            <p style={{ fontSize: '14px', color: '#786C62', marginTop: '4px' }}>Manage your delivery addresses for seamless checkout</p>
          </div>

          <button
            onClick={openAddModal}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px' }}
          >
            <Plus size={18} /> Add New Address
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#786C62' }}>Loading your addresses...</div>
        ) : addresses.length === 0 ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '60px 20px', textAlign: 'center', margin: '20px 0' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#D97706' }}>
              <MapPin size={36} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#382012', marginBottom: '8px' }}>No Saved Addresses Found</h2>
            <p style={{ fontSize: '14px', color: '#786C62', marginBottom: '24px' }}>Add a delivery address to make checking out fast & easy!</p>
            <button onClick={openAddModal} className="btn-primary" style={{ padding: '12px 28px' }}>
              + Add Your First Address
            </button>
          </div>
        ) : (
          <div className="address-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {addresses.map((addr) => (
              <div
                key={addr.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: addr.isDefault ? '2px solid #D97706' : '1px solid #E8DFD5',
                  padding: '24px',
                  boxShadow: addr.isDefault ? '0 4px 20px rgba(217,119,6,0.12)' : '0 4px 16px rgba(0,0,0,0.03)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {addr.isDefault && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#FEF3C7', color: '#B45309', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', marginBottom: '12px', border: '1px solid #FDE68A' }}>
                      <CheckCircle2 size={13} /> DEFAULT ADDRESS
                    </span>
                  )}

                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>{addr.fullName}</h3>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#C2410C', marginBottom: '12px' }}>📞 {addr.phone}</p>

                  <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.5', marginBottom: '4px' }}>{addr.line1}</p>
                  {addr.line2 && <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.5', marginBottom: '4px' }}>{addr.line2}</p>}
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#382012', marginTop: '6px' }}>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E8DFD5', paddingTop: '16px', marginTop: '20px' }}>
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      style={{ fontSize: '12px', fontWeight: 800, color: '#D97706', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#15803D', fontWeight: 700 }}>✓ Default</span>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => openEditModal(addr)}
                      style={{ color: '#786C62', cursor: 'pointer', padding: '4px' }}
                      title="Edit address"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      style={{ color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                      title="Delete address"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="fade-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '520px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#382012' }}>
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} style={{ fontSize: '20px', color: '#9CA3AF', cursor: 'pointer' }}>✕</button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Patil"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    value={formData.line1}
                    onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                    placeholder="Flat / House No. / Building / Street"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={formData.line2}
                    onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                    placeholder="Landmark / Area"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Pune"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="e.g. Maharashtra"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Pincode *</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="e.g. 411001"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    style={{ accentColor: '#C2410C', width: '16px', height: '16px' }}
                  />
                  <label htmlFor="isDefault" style={{ fontSize: '13px', color: '#382012', fontWeight: 700, cursor: 'pointer' }}>
                    Make this my default delivery address
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-outline"
                    style={{ flex: 1, padding: '12px', textAlign: 'center' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                  >
                    {isSubmitting ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
