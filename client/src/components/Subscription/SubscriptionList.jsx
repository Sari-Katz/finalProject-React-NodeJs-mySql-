import React, { useEffect, useState } from 'react';
import styles from './SubscriptionList.module.css';
import ApiUtils from '../../utils/ApiUtils';

export default function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const apiUtils = new ApiUtils();

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        const data = await apiUtils.get("http://localhost:3000/subscriptions");
        setSubscriptions(data);
      } catch (error) {
        console.error("שגיאה בטעינת חבילות:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSubscriptions();
  }, []);

  const handleSubscribe = async (subscriptionId) => {
    setSelectedId(subscriptionId);
    try {
      await api.post('/api/subscribe', { subscriptionId });
      alert('נרשמת בהצלחה!');
    } catch (error) {
      console.error("שגיאה בהרשמה:", error);
      alert('ההרשמה נכשלה');
    } finally {
      setSelectedId(null);
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
                <button
                  onClick={() => handleSubscribe(sub.id)}
                  disabled={selectedId === sub.id}
                >
                  {selectedId === sub.id ? 'נרשם...' : 'הרשם'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
