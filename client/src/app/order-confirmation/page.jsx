'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderConfirmation() {
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const checkOrderStatus = async () => {
      try {
        const res = await fetch(`https://api.agiigo.com/api/orders/${orderId}`);
        if (!res.ok) throw new Error('Order not found');
        const data = await res.json();
        setOrder(data);

        if (data.paymentMethod === 'Stripe' && data.paymentStatus === 'Pending') {
          const paymentRes = await fetch('https://api.agiigo.com/api/payment/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              userId: data.user._id,
              paymentIntentId: data.paymentId,
            }),
          });
          const paymentData = await paymentRes.json();
          setOrder(paymentData.order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkOrderStatus();
  }, [orderId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
      {order && (
        <div className="bg-white p-6 rounded shadow">
          <p>Order ID: {order._id}</p>
          <p>Status: {order.paymentStatus === 'Paid' ? 'Payment Successful' : 'Payment Pending'}</p>
        </div>
      )}
    </div>
  );
}