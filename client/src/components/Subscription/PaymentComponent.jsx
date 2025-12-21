import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PaymentComponent({ price, onSuccess, onClose }) {
  const numericPrice = Number(price);

  if (isNaN(numericPrice)) {
    console.error("Invalid price value:", price);
    return <div>מחיר לא תקין לתשלום</div>;
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 999,
        }}
      />

      {/* Payment Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          zIndex: 1000,
          minWidth: "300px",
        }}
      >
        <button
          onClick={onClose}
          aria-label="סגור תשלום"
          style={{
            float: "right",
            fontSize: "1.5rem",
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          &times;
        </button>

        <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
          תשלום מנוי באמצעות PayPal
        </h3>

        <PayPalScriptProvider
          options={{
            "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
            currency: "ILS",
          }}
        >
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) =>
              actions.order.create({
                purchase_units: [
                  {
                    amount: { value: numericPrice.toFixed(2) },
                  },
                ],
              })
            }
            onApprove={(data, actions) =>
              actions.order.capture().then(() => {
                onSuccess();
                onClose();
              })
            }
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
