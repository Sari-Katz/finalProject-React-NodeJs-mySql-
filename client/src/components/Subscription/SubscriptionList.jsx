// SubscriptionList.jsx
import React, { useEffect, useState } from 'react';
import styles from './SubscriptionList.module.css';
import ApiUtils from '../../utils/ApiUtils';
import PaymentComponent from './PaymentComponent';

export default function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentSubscription, setPaymentSubscription] = useState(null);

  // בטעינת הקומפוננטה נבדוק אם ב-URL יש id של מנוי לתשלום ונפתח את התשלום
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('paymentId');
    if (paymentId) {
      // מחפשים את המנוי לפי id מתוך הרשימה, אם כבר טעונה
      // או נשאיר את paymentSubscription ל-null ונעדכן אחרי הטעינה
      setPaymentSubscription({ id: paymentId });
    }
  }, []);

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        const data = await ApiUtils.get("http://localhost:3000/subscription/plans");
        setSubscriptions(data);

        // אם יש paymentSubscription עם id, נעדכן את המנוי המלא מתוך הרשימה
        if (paymentSubscription?.id) {
          const sub = data.find(s => String(s.id) === String(paymentSubscription.id));
          if (sub) setPaymentSubscription(sub);
        }
      } catch (error) {
        console.error("שגיאה בטעינת חבילות:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSubscriptions();
  }, [paymentSubscription?.id]);

  const openPayment = (sub) => {
    // מוסיף את מזהה המנוי ל-URL
    const params = new URLSearchParams(window.location.search);
    params.set('paymentId', sub.id);
    const newUrl = window.location.pathname + '?' + params.toString();
    window.history.replaceState(null, '', newUrl);
    setPaymentSubscription(sub);
  };

  const closePayment = () => {
    // מסיר את מזהה התשלום מה-URL
    const params = new URLSearchParams(window.location.search);
    params.delete('paymentId');
    const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState(null, '', newUrl);
    setPaymentSubscription(null);
  };

  const handlePaymentSuccess = async (subscriptionId) => {
    try {
      await ApiUtils.post(`http://localhost:3000/subscription/${subscriptionId}/register`);
      alert('נרשמת בהצלחה!');
    } catch (error) {
      console.error("שגיאה בהרשמה:", error);
      alert('ההרשמה נכשלה');
    } finally {
      closePayment();
    }
  };

  if (loading) return <div>טוען חבילות...</div>;

  return (
    <div className={styles.container} dir="rtl">
      <h2>רשימת חבילות מנוי</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>שם החבילה</th>
            <th>מחיר</th>
            <th>תיאור</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub.id}>
              <td>{sub.name}</td>
              <td>{sub.price} ₪</td>
              <td>{sub.description}</td>
              <td>
                <button onClick={() => openPayment(sub)}>לתשלום</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {paymentSubscription && (
        <PaymentComponent
          price={paymentSubscription.price}
          onSuccess={() => handlePaymentSuccess(paymentSubscription.id)}
          onClose={closePayment}
        />
      )}
    </div>
  );
}
