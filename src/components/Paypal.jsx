import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPal = () => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": "test", // "test" suffit pour un exercice simple
        currency: "EUR",
      }}
    >
      <h2>Payer 10€</h2>

      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: "10.00" } }],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(() => {
            alert("Paiement réussi ! ✅");
          });
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPal;
