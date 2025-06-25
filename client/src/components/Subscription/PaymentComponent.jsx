import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PaymentComponent({ price, onSuccess, onClose }) {
  if (isNaN(Number(price))) {
    console.error("Invalid price value:", price);
    return <div>מחיר לא תקין לתשלום</div>;
  }

  return (
    <>
      {/* Overlay רקע כהה */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 999,
        }}
      />

      {/* חלון התשלום */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          zIndex: 1000,
          minWidth: '300px',
        }}
      >
        <button
          onClick={onClose}
          style={{ float: 'right', fontSize: '1.5rem', border: 'none', background: 'none', cursor: 'pointer' }}
          aria-label="סגור תשלום"
        >
          &times;
        </button>

        {/* כותרת מעל תשלום */}
        <h3 style={{ marginTop: 0, marginBottom: '1rem', textAlign: 'center' }}>
          תשלום מנוי באמצעות PayPal
        </h3>

        <PayPalScriptProvider options={{ "client-id": "AeRU6LbdXU8NMXD8BzGvtIK9VSdRGMHqLS2D_9wCHjty0qmoHZOIBj3vLjcQAUzu3wU_MDPXZkTJXULX", currency: "ILS" }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: { value: Number(price).toFixed(2) }
                }]
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(function (details) {
                onSuccess();
                onClose();
              });
            }}
            onError={(err) => {
              console.error("Payment error:", err);
              alert("שגיאה בתשלום, נסה שוב.");
            }}
          />
        </PayPalScriptProvider>
      </div>
    </>
  );
}
