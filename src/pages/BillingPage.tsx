import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RiCheckLine, RiBankCardLine, RiTimeLine, RiLockLine, RiArrowRightLine } from 'react-icons/ri';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuthStore } from '../store/authStore';
import { paymentApi } from '../api/payment';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { formatDate, formatCurrency } from '../utils/helpers';
import type { Payment } from '../types';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

// Replace with your Stripe publishable key via env var
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const premiumFeatures = [
  'Unlimited resumes',
  'All 10 professional templates',
  'PDF download & email sending',
  'Color palette customisation',
  'Profile image upload',
  'ATS optimisation tips',
  'Priority support',
  'All future templates included',
];

/* Stripe Card Form */
interface CardFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

const CardForm: React.FC<CardFormProps> = ({ clientSecret, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setProcessing(true);
    setCardError('');

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setCardError(error.message || 'Payment failed. Please try again.');
        setProcessing(false);
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch {
      setCardError('An unexpected error occurred.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
        <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Card details</p>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '15px',
                color: '#111827',
                fontFamily: '"DM Sans", sans-serif',
                '::placeholder': { color: '#9ca3af' },
              },
              invalid: { color: '#ef4444' },
            },
          }}
          onChange={(e) => { if (e.error) setCardError(e.error.message); else setCardError(''); }}
        />
      </div>
      {cardError && (
        <p className="text-sm text-red-600 flex items-center gap-1.5">
          <span className="w-4 h-4 inline-flex items-center justify-center rounded-full bg-red-100 text-red-600 text-xs">!</span>
          {cardError}
        </p>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-400 bg-green-50 rounded-lg p-2.5">
        <RiLockLine className="w-3.5 h-3.5 text-green-600 shrink-0" />
        <span>Payments are secured and encrypted by Stripe.</span>
      </div>
      <div className="flex gap-2 pt-1">
        <Button variant="ghost" type="button" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" isLoading={processing} className="flex-1" disabled={!stripe}>
          Pay $9.99
        </Button>
      </div>
      {/* <p className="text-xs text-gray-400 text-center">
        Test card: 4242 4242 4242 4242 · Any future date · Any CVC
      </p> */}
    </form>
  );
};

/* Billing Page */
export const BillingPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [paymentModal, setPaymentModal] = useState(false);
  const isPremium = user?.subscriptionPlan === 'premium';

  useEffect(() => {
    paymentApi.getHistory()
      .then(setPayments)
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, []);

  const handleUpgradeClick = async () => {
    setCreatingOrder(true);
    try {
      const order = await paymentApi.createOrder('premium');
      setClientSecret(order.clientSecret);
      setPaymentIntentId(order.paymentIntentId);
      setPaymentModal(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setCreatingOrder(false);
    }
  };

  const handlePaymentSuccess = async (intentId: string) => {
    setPaymentModal(false);
    try {
      await paymentApi.verifyPayment(intentId);
      updateUser({ subscriptionPlan: 'premium' });
      toast.success('Welcome to Premium! All features unlocked.');
      // Refresh history
      paymentApi.getHistory().then(setPayments).catch(() => {});
    } catch {
      toast.error('Payment succeeded but activation failed. Contact support.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-gray-900">Billing</h1>
        <p className="text-gray-500 mt-1">Manage your plan and payment history.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Plan Card */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`card p-6 ${isPremium ? 'ring-2 ring-primary-500' : ''}`}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current plan</p>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-semibold text-gray-900">{isPremium ? 'Premium' : 'Basic'}</h2>
                  {isPremium && <Badge variant="premium"><Star className="w-3 h-3" /> Premium</Badge>}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isPremium ? 'gradient-bg text-white' : 'bg-gray-100 text-gray-500'}`}>
                {isPremium ? <Star /> : <RiBankCardLine />}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
              {premiumFeatures.map((f) => (
                <div key={f} className={`flex items-center gap-2 text-sm ${isPremium ? 'text-gray-700' : 'text-gray-400'}`}>
                  <RiCheckLine className={`w-4 h-4 shrink-0 ${isPremium ? 'text-accent-500' : 'text-gray-300'}`} />
                  {f}
                </div>
              ))}
            </div>

            {!isPremium ? (
              <Button onClick={handleUpgradeClick} isLoading={creatingOrder} leftIcon={<Star className="w-4 h-4" />} rightIcon={<RiArrowRightLine className="w-4 h-4" />}>
                Upgrade to Premium - $9.99 one-time
              </Button>
            ) : (
              <p className="text-sm text-green-600 flex items-center gap-1.5">
                <RiCheckLine className="w-4 h-4" /> You have lifetime access to all Premium features.
              </p>
            )}
          </motion.div>
        </div>

        {/* Plan Summary */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6 flex flex-col gap-4">
          <h3 className="font-semibold text-gray-900">Plan summary</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Plan', value: isPremium ? 'Premium' : 'Basic' },
              { label: 'Price', value: isPremium ? '$9.99 one-time' : 'Free forever' },
              { label: 'Resumes', value: isPremium ? 'Unlimited' : 'Up to 10' },
              { label: 'Templates', value: isPremium ? 'All 10' : '5 free' },
              { label: 'Email sending', value: isPremium ? 'Included' : 'Included' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Payment History */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Payment history</h3>
        {loadingHistory ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <RiTimeLine className="w-4 h-4 animate-pulse" /> Loading…
          </div>
        ) : payments.length === 0 ? (
          <p className="text-sm text-gray-400">No payments yet.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {payments.map((p) => (
              <div key={p._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">{p.planType} Plan</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(p.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={p.status === 'paid' ? 'success' : p.status === 'failed' ? 'danger' : 'default'}>
                    {p.status}
                  </Badge>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(p.amount, p.currency)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Stripe Payment Modal */}
      <Modal isOpen={paymentModal} onClose={() => setPaymentModal(false)} title="Complete your upgrade" description="Enter your card details to activate Premium." size="sm">
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CardForm
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setPaymentModal(false)}
            />
          </Elements>
        )}
      </Modal>
    </div>
  );
};
