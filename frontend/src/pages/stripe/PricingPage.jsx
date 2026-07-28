import { useState } from 'react';

const PricingPage = () => {
  const [loading, setLoading] = useState(null);

  const choosePlan = async (planKey) => {
    try {
      setLoading(planKey);
      const res = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking: {
            id: 'demo-1',
            email: 'test@gmail.com',
            hospital_name: 'Sohana Hospital'
          },
          feedbackToken: 'abc123',
          planKey
        })
      });

      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <button onClick={() => choosePlan('mini')}>Mini $100</button>
      <button onClick={() => choosePlan('basic')}>Basic $200</button>
      <button onClick={() => choosePlan('advanced')}>Advanced $500</button>
    </div>
  );
};

export default PricingPage;