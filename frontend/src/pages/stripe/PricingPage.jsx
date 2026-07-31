import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Zap, Crown, ArrowRight, Loader2, Sparkles, Building2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../../config/api';
import PortalCardPage from '../../components/portal/PortalCardPage';

const PLANS = [
  {
    key: 'mini',
    name: 'Mini Plan',
    price: '$100',
    interval: 'monthly',
    subtitle: 'Great for small clinics starting out',
    icon: Zap,
    popular: false,
    color: 'from-blue-500 to-cyan-500',
    btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
    features: [
      'Up to 5 Staff Accounts',
      'Basic Appointment Management',
      'Patient Records & History',
      'Email Support'
    ]
  },
  {
    key: 'basic',
    name: 'Basic Plan',
    price: '$200',
    interval: 'quarterly',
    subtitle: 'Ideal for growing veterinary hospitals',
    icon: Sparkles,
    popular: true,
    color: 'from-emerald-500 to-teal-600',
    btnColor: 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/30',
    features: [
      'Up to 25 Staff Accounts',
      'Advanced Calendar & Scheduling',
      'Billing, Invoicing & Prescriptions',
      'Google Calendar Integration',
      '24/7 Priority Support'
    ]
  },
  {
    key: 'advanced',
    name: 'Advanced Plan',
    price: '$500',
    interval: 'yearly',
    subtitle: 'For enterprise multi-branch hospitals',
    icon: Crown,
    popular: false,
    color: 'from-purple-600 to-indigo-600',
    btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    features: [
      'Unlimited Staff & Admin Accounts',
      'Multi-Branch Hospital Management',
      'Custom Workflow & Integrations',
      'Dedicated Account Manager',
      'Full Analytics & Export Tools'
    ]
  }
];

export default function PricingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const isRenewal = searchParams.get('renew') === 'true';

  const [bookingInfo, setBookingInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [submitting, setSubmitting] = useState(null);
  const [user, setUser] = useState(null);

  // ─── Check if user is logged in ─────────────────────────────
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // ─── Fetch booking info if token exists ─────────────────────
  // useEffect(() => {
  //   if (!token) {
  //     setLoadingInfo(false);
  //     return;
  //   }
  //   (async () => {
  //     try {
  //       const res = await fetch(`${API_URL}/api/feedback/${token}`);
  //       const data = await res.json();
  //       if (res.ok && data.booking) {
  //         setBookingInfo(data.booking);
  //       }
  //     } catch (err) {
  //       console.error('Could not fetch booking details for pricing page', err);
  //     } finally {
  //       setLoadingInfo(false);
  //     }
  //   })();
  // }, [token]);

  useEffect(() => {
    if (!token) {
      setLoadingInfo(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/feedback/${token}`);
        const data = await res.json();
        if (res.ok && data.booking) {
          // Correctly set the booking info
          setBookingInfo({
            ...data.booking,
            // Ensure email is always available
            email: data.booking.email || data.booking.contactEmail || 'customer@example.com'
          });
        }
      } catch (err) {
        console.error('Could not fetch booking details for pricing page', err);
      } finally {
        setLoadingInfo(false);
      }
    })();
  }, [token]);


  // ─── Handle plan selection ───────────────────────────────────
  // const handleChoosePlan = async (planKey) => {
  //   try {
  //     setSubmitting(planKey);

  //     // Get auth token
  //     const authToken = localStorage.getItem('token');
  //     const headers = {
  //       'Content-Type': 'application/json',
  //       ...(authToken && { Authorization: `Bearer ${authToken}` })
  //     };

  //     // Build request body
  //     const body = {
  //       planKey,
  //       ...(token && { feedbackToken: token }),
  //       ...(bookingInfo?.id && { bookingId: bookingInfo.id }),
  //       ...(user?.id && { userId: user.id }),
  //       ...(bookingInfo?.hospitalName && { hospitalName: bookingInfo.hospitalName }),
  //       isRenewal: isRenewal
  //     };

  //     // If user is logged in, use subscription endpoint
  //     const endpoint = user
  //       ? '/api/subscriptions/create-checkout'
  //       : '/api/payments/create-checkout-session';

  //     const res = await fetch(`${API_URL}${endpoint}`, {
  //       method: 'POST',
  //       headers,
  //       body: JSON.stringify(body)
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       // Fallback for dev mode when Stripe isn't configured
  //       if (res.status === 503 || data.message?.includes('Stripe not configured')) {
  //         toast.success('Redirecting to registration...');
  //         navigate(`/register/${token}?plan=${planKey}`);
  //         return;
  //       }
  //       toast.error(data.message || 'Could not initiate payment');
  //       return;
  //     }

  //     if (data.url) {
  //       window.location.href = data.url; // Redirect to Stripe Checkout
  //     } else {
  //       navigate(`/register/${token}?plan=${planKey}`);
  //     }
  //   } catch (err) {
  //     console.error('Payment error:', err);
  //     toast.error('Network error during payment initiation. Redirecting...');
  //     navigate(`/register/${token}?plan=${planKey}`);
  //   } finally {
  //     setSubmitting(null);
  //   }
  // };

  const handleChoosePlan = async (planKey) => {
  try {
    setSubmitting(planKey);

    const authToken = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` })
    };

    // Build the booking object with email
    const booking = {
      id: bookingInfo?.id || 'demo-booking',
      email: bookingInfo?.email || user?.email || 'customer@example.com',
      hospital_name: bookingInfo?.hospitalName || 'Pet Hospital'
    };

    const body = {
      booking,                    
      planKey,
      feedbackToken: token,
      isRenewal: isRenewal
    };

    // If user is logged in, use subscription endpoint; otherwise, use payment endpoint
    const endpoint = user
      ? '/api/subscriptions/create-checkout'
      : '/api/payments/create-checkout-session';

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 503 || data.message?.includes('Stripe not configured')) {
        toast.success('Redirecting to registration...');
        navigate(`/register/${token}?plan=${planKey}`);
        return;
      }
      toast.error(data.message || 'Could not initiate payment');
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    } else {
      navigate(`/register/${token}?plan=${planKey}`);
    }
  } catch (err) {
    console.error('Payment error:', err);
    toast.error('Network error during payment initiation. Redirecting...');
    navigate(`/register/${token}?plan=${planKey}`);
  } finally {
    setSubmitting(null);
  }
};

  const getIntervalLabel = (interval) => {
    const map = {
      monthly: 'per month',
      quarterly: 'per quarter',
      yearly: 'per year'
    };
    return map[interval] || interval;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800 mb-3">
            <ShieldCheck size={14} /> Secure Onboarding
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {isRenewal ? 'Renew Your Subscription' : 'Choose Your Hospital Plan'}
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            {isRenewal
              ? 'Renew your subscription to continue managing your hospital seamlessly.'
              : `Select the subscription plan that best fits ${bookingInfo?.hospitalName ? <strong className="text-slate-800">{bookingInfo.hospitalName}</strong> : 'your clinic'}. You will be redirected to complete payment and register.`
            }
          </p>
          {isRenewal && user && (
            <div className="mt-2 text-sm text-slate-500">
              👋 Welcome back, <strong>{user.name || user.email}</strong>
            </div>
          )}
        </div>

        {/* Plan Cards */}
        {loadingInfo ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.key;
              const isSubmittingThis = submitting === plan.key;

              return (
                <motion.div
                  key={plan.key}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedPlan(plan.key)}
                  className={`relative flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl transition-all cursor-pointer border-2 ${isSelected ? 'border-teal-500 ring-4 ring-teal-500/20' : 'border-gray-100 hover:border-gray-200'
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold uppercase px-4 py-1 rounded-full shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${plan.color} text-white shadow-md`}>
                        <Icon size={24} />
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-900">{plan.price}</span>
                        <span className="text-xs text-slate-500 block">{getIntervalLabel(plan.interval)}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-6">{plan.subtitle}</p>

                    <div className="space-y-3 mb-8">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoosePlan(plan.key);
                    }}
                    disabled={submitting !== null}
                    className={`w-full py-3.5 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${plan.btnColor} disabled:opacity-60`}
                  >
                    {isSubmittingThis ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Redirecting...
                      </>
                    ) : (
                      <>
                        {isRenewal ? `Renew ${plan.name}` : `Choose ${plan.name}`} <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 text-center text-xs text-slate-400">
          🔒 Payments are securely processed via Stripe. After payment, you will automatically be redirected to finish registering your hospital credentials.
        </div>
      </div>
    </div>
  );
}