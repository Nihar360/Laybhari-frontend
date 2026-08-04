import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Plus, Edit2, CheckCircle2, Truck, ShieldCheck, ArrowRight, ShoppingBag, Phone } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import { Address, AddressRequest } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cartItems, grandTotal, fetchCart, mergeGuestCart } = useCart();
  const { user, setAuthData } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState<boolean>(false);

  // Phone OTP Checkout Auth State
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [otpMsg, setOtpMsg] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // New Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
  const [newAddrData, setNewAddrData] = useState<AddressRequest>({
    fullName: user?.name || '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: true,
  });

  // Edit Address Form State
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editAddrData, setEditAddrData] = useState<AddressRequest>({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const freeShippingThreshold = 499;
  const isFreeShipping = grandTotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : 50;
  const totalAmount = grandTotal + shippingFee;

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    setIsLoadingAddresses(true);
    setError(null);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
      if (data.length > 0) {
        const defaultAddr = data.find((a) => a.isDefault) || data[0];
        setSelectedAddressId(defaultAddr.id);
      } else {
        setIsAddingAddress(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load delivery addresses');
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifierCheckout) {
      (window as any).recaptchaVerifierCheckout = new RecaptchaVerifier(auth, 'recaptcha-container-checkout', {
        'size': 'invisible',
        'callback': () => {}
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setIsSendingOtp(true);
    setError(null);
    setOtpMsg(null);

    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifierCheckout;
      const formattedPhone = `+91${cleaned}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setOtpMsg(`Firebase SMS OTP sent to +91 ${cleaned}. Please check your phone.`);
    } catch (err: any) {
      console.error('Firebase send OTP error:', err);
      if ((window as any).recaptchaVerifierCheckout) {
        try {
          (window as any).recaptchaVerifierCheckout.clear();
          (window as any).recaptchaVerifierCheckout = null;
        } catch (e) {}
      }

      if (err.code === 'auth/billing-not-enabled' || err.code === 'auth/operation-not-allowed') {
        try {
          const backendRes = await authService.sendOtp(cleaned);
          setOtpSent(true);
          setConfirmationResult(null);
          setOtpMsg(`⚠️ Firebase Billing disabled. Using Backend OTP fallback for +91 ${cleaned} (Test OTP: 123456).`);
        } catch (bErr: any) {
          setError('Firebase Billing is not enabled in Firebase Console. Please upgrade to Blaze Plan or add Test Phone Numbers in Firebase Console.');
        }
      } else {
        setError(err.message || 'Failed to send OTP via Firebase.');
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (otp.length < 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setIsVerifyingOtp(true);
    setError(null);

    if (confirmationResult) {
      try {
        const userCredential = await confirmationResult.confirm(otp);
        const idToken = await userCredential.user.getIdToken();
        const authRes = await authService.firebaseLogin(idToken);
        setAuthData(authRes);
        await mergeGuestCart();
        return;
      } catch (err: any) {
        console.warn('Firebase OTP verification failed, trying backend fallback:', err);
      } finally {
        setIsVerifyingOtp(false);
      }
    }

    try {
      const authRes = await authService.verifyOtp(cleaned, otp);
      setAuthData(authRes);
      await mergeGuestCart();
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.message || err.message || 'Invalid or expired OTP code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const created = await addressService.addAddress(newAddrData);
      setAddresses((prev) => [created, ...prev]);
      setSelectedAddressId(created.id);
      setIsAddingAddress(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add address');
    }
  };

  const handleStartEdit = (addr: Address) => {
    setEditingAddress(addr);
    setEditAddrData({
      fullName: addr.fullName,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;
    setError(null);
    try {
      const updated = await addressService.updateAddress(editingAddress.id, editAddrData);
      setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setEditingAddress(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update address');
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select or add a delivery address.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsSubmittingOrder(true);
    setError(null);

    try {
      const createdOrder = await orderService.checkout({ addressId: selectedAddressId });
      const paymentInfo = await orderService.createPayment(createdOrder.id);

      const res = await loadRazorpayScript();
      if (!res) {
        setError('Failed to load Razorpay SDK. Please check your internet connection.');
        setIsSubmittingOrder(false);
        return;
      }

      const currentAddress = addresses.find((a) => a.id === selectedAddressId);
      const rawPhone = (currentAddress?.phone || phone || '').replace(/\D/g, '');
      const validContact = rawPhone.length >= 10 ? rawPhone.slice(-10) : '9999999999';

      const options = {
        key: paymentInfo.keyId,
        amount: paymentInfo.amount,
        currency: paymentInfo.currency,
        name: 'Laybhari Vlogs',
        description: `Order #${createdOrder.id}`,
        order_id: paymentInfo.razorpayOrderId,
        prefill: {
          name: currentAddress?.fullName || user?.name || '',
          email: user?.email || '',
          contact: validContact,
        },
        theme: {
          color: '#C2410C',
        },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            await orderService.verifyPayment(createdOrder.id, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            await fetchCart();
            navigate(`/order-confirmation/${createdOrder.id}`);
          } catch (verifyErr: any) {
            setError(verifyErr.message || 'Payment verification failed.');
          } finally {
            setIsSubmittingOrder(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmittingOrder(false);
            setError(`Payment window closed. Order #${createdOrder.id} is PENDING. Check order history to retry.`);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Failed to place order.');
      setIsSubmittingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="fade-in" style={{ padding: '60px 0', backgroundColor: '#FAF6F0', minHeight: '70vh' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
            <ShoppingBag size={48} color="#D97706" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#382012', marginBottom: '8px' }}>Your Cart is Empty</h2>
            <p style={{ fontSize: '14px', color: '#786C62', marginBottom: '24px' }}>Add items to your cart before proceeding to checkout.</p>
            <Link to="/shop" className="btn-primary" style={{ padding: '12px 28px' }}>
              Browse Spices & Products →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ padding: '32px 0 60px', backgroundColor: '#FAF6F0', minHeight: '85vh' }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#382012' }}>CHECKOUT</h1>
          <p style={{ fontSize: '14px', color: '#786C62', marginTop: '4px' }}>Confirm your delivery address & order details</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, marginBottom: '24px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Guest / Phone Auth Step on Checkout (if not logged in) */}
        {!user ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E8DFD5', padding: '40px 28px', maxWidth: '540px', margin: '0 auto 40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Phone size={30} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#382012' }}>Enter your phone number to continue</h2>
              <p style={{ fontSize: '13px', color: '#786C62', marginTop: '4px' }}>We will send a 6-digit OTP code to verify your phone for checkout</p>
            </div>

            {otpMsg && (
              <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>
                ✓ {otpMsg}
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#382012', marginBottom: '8px' }}>Mobile Number *</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ padding: '12px 16px', backgroundColor: '#FAF5EF', border: '1px solid #E8DFD5', borderRadius: '8px', fontSize: '15px', fontWeight: 800, color: '#382012' }}>+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '16px', fontWeight: 800, outline: 'none' }}
                      autoFocus
                    />
                  </div>
                </div>

                <div id="recaptcha-container-checkout" style={{ marginBottom: '10px' }}></div>

                <button
                  type="submit"
                  disabled={isSendingOtp || phone.length < 10}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 900, backgroundColor: '#C2410C', opacity: (isSendingOtp || phone.length < 10) ? 0.6 : 1 }}
                >
                  {isSendingOtp ? 'SENDING OTP...' : 'Get OTP →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 800, color: '#382012' }}>Enter 6-Digit OTP *</label>
                    <button type="button" onClick={() => setOtpSent(false)} style={{ fontSize: '12px', color: '#C2410C', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}>Change Number</button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '2px solid #C2410C', fontSize: '22px', fontWeight: 900, textAlign: 'center', letterSpacing: '8px', outline: 'none' }}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingOtp || otp.length < 6}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 900, backgroundColor: '#C2410C', opacity: (isVerifyingOtp || otp.length < 6) ? 0.6 : 1 }}
                >
                  {isVerifyingOtp ? 'VERIFYING...' : 'Verify OTP & Continue →'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="checkout-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' }}>
            
            {/* Left Column: Delivery Address Selection */}
            <div>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #FAF5EF', paddingBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#382012', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={20} color="#C2410C" /> 1. SELECT DELIVERY ADDRESS
                  </h3>

                  {!isAddingAddress && !editingAddress && addresses.length > 0 && (
                    <button
                      onClick={() => {
                        setEditingAddress(null);
                        setIsAddingAddress(true);
                      }}
                      style={{ fontSize: '12px', fontWeight: 800, color: '#C2410C', display: 'flex', alignItems: 'center', gap: '4px', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      <Plus size={16} /> Add New Address
                    </button>
                  )}
                </div>

                {isLoadingAddresses ? (
                  <p style={{ fontSize: '13px', color: '#786C62' }}>Loading saved addresses...</p>
                ) : addresses.length === 0 || isAddingAddress ? (
                  <form onSubmit={handleCreateAddress} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#382012' }}>Add New Delivery Address</h4>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddrData.fullName}
                        onChange={(e) => setNewAddrData({ ...newAddrData, fullName: e.target.value })}
                        placeholder="e.g. Ramesh Patil"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px', backgroundColor: '#FFFFFF' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Mobile Phone Number *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={newAddrData.phone}
                        onChange={(e) => setNewAddrData({ ...newAddrData, phone: e.target.value.replace(/\D/g, '') })}
                        placeholder="9876543210"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px', backgroundColor: '#FFFFFF' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Address Line 1 (Flat, House No, Building, Street) *</label>
                      <input
                        type="text"
                        required
                        value={newAddrData.line1}
                        onChange={(e) => setNewAddrData({ ...newAddrData, line1: e.target.value })}
                        placeholder="House No, Flat No, Street name"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px', backgroundColor: '#FFFFFF' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Address Line 2 (Landmark / Area)</label>
                      <input
                        type="text"
                        value={newAddrData.line2}
                        onChange={(e) => setNewAddrData({ ...newAddrData, line2: e.target.value })}
                        placeholder="Near Temple / Opposite Bank"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px', backgroundColor: '#FFFFFF' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>City *</label>
                        <input
                          type="text"
                          required
                          value={newAddrData.city}
                          onChange={(e) => setNewAddrData({ ...newAddrData, city: e.target.value })}
                          placeholder="e.g. Pune"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px', backgroundColor: '#FFFFFF' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>State *</label>
                        <input
                          type="text"
                          required
                          value={newAddrData.state}
                          onChange={(e) => setNewAddrData({ ...newAddrData, state: e.target.value })}
                          placeholder="e.g. Maharashtra"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px', backgroundColor: '#FFFFFF' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#382012', marginBottom: '4px' }}>Pincode *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        inputMode="numeric"
                        value={newAddrData.pincode}
                        onChange={(e) => setNewAddrData({ ...newAddrData, pincode: e.target.value.replace(/\D/g, '') })}
                        placeholder="e.g. 411001"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '14px', backgroundColor: '#FFFFFF' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setIsAddingAddress(false)}
                          className="btn-outline"
                          style={{ flex: 1, padding: '10px' }}
                        >
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px', backgroundColor: '#C2410C' }}>
                        Save Address & Continue
                      </button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          style={{
                            borderRadius: '12px',
                            border: isSelected ? '2px solid #C2410C' : '1px solid #E8DFD5',
                            backgroundColor: isSelected ? '#FFF8F0' : '#FFFFFF',
                            padding: '16px 20px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                          }}
                        >
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={isSelected}
                              onChange={() => setSelectedAddressId(addr.id)}
                              style={{ marginTop: '4px', accentColor: '#C2410C' }}
                            />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#382012' }}>{addr.fullName}</h4>
                                {addr.isDefault && (
                                  <span style={{ fontSize: '10px', fontWeight: 800, backgroundColor: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: '12px', border: '1px solid #FDE68A' }}>DEFAULT</span>
                                )}
                              </div>
                              <p style={{ fontSize: '12px', color: '#C2410C', fontWeight: 700, marginBottom: '4px' }}>📞 {addr.phone}</p>
                              <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: '1.4' }}>
                                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(addr);
                            }}
                            style={{ color: '#786C62', padding: '4px', cursor: 'pointer', border: 'none', background: 'none' }}
                            title="Edit Address"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: ORDER ITEMS & PAYMENT BUTTON */}
            <div>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#382012', letterSpacing: '0.5px', marginBottom: '16px', textTransform: 'uppercase' }}>
                  ORDER SUMMARY ({cartItems.length} ITEMS)
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '240px', overflowY: 'auto' }}>
                  {cartItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', borderBottom: '1px solid #FAF5EF', paddingBottom: '8px' }}>
                      <div>
                        <span style={{ fontWeight: 800, color: '#291E14', display: 'block' }}>{item.productName}</span>
                        <span style={{ fontSize: '11px', color: '#786C62' }}>{item.weightLabel} × {item.quantity}</span>
                      </div>
                      <span style={{ fontWeight: 800, color: '#C2410C' }}>₹{Number(item.lineTotal).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B5563', marginBottom: '8px' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 800, color: '#382012' }}>₹{grandTotal.toFixed(0)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B5563', marginBottom: '12px' }}>
                  <span>Shipping Fee</span>
                  <span style={{ fontWeight: 800, color: isFreeShipping ? '#15803D' : '#382012' }}>
                    {isFreeShipping ? 'FREE (₹0)' : `₹${shippingFee}`}
                  </span>
                </div>

                <hr style={{ borderColor: '#E8DFD5', margin: '12px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
                  <div>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#382012' }}>Total Payable</span>
                    <p style={{ fontSize: '11px', color: '#786C62' }}>(Inclusive of all taxes)</p>
                  </div>
                  <span style={{ fontSize: '26px', fontWeight: 900, color: '#C2410C' }}>
                    ₹{totalAmount.toFixed(0)}
                  </span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmittingOrder || !selectedAddressId}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '15px',
                    fontWeight: 900,
                    backgroundColor: '#C2410C',
                    justifyContent: 'center',
                    opacity: (isSubmittingOrder || !selectedAddressId) ? 0.6 : 1,
                    cursor: (isSubmittingOrder || !selectedAddressId) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmittingOrder ? 'PROCESSING PAYMENT...' : 'PLACE ORDER & PAY VIA RAZORPAY →'}
                </button>
              </div>

              <div style={{ backgroundColor: '#FAF5EF', borderRadius: '12px', border: '1px solid #E8DFD5', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={24} color="#15803D" />
                <div>
                  <h5 style={{ fontSize: '12px', fontWeight: 800, color: '#382012' }}>100% Safe & Secure Checkout</h5>
                  <p style={{ fontSize: '11px', color: '#786C62' }}>UPI / QR / Cards / NetBanking by Razorpay</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
