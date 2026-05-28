"use client";

import React, { useCallback, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  // CreateCheckoutSession();

  const fetchClientSecret = useCallback(async () => {
    console.log("yo??");
    // Create a Checkout Session
    const res = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    // console.log(res);
    const data = await res.json();
    console.log(data);
    setClientSecret(data.client_secret);
    console.log(data.client_secret);
  }, []);

  useEffect(() => {
    fetchClientSecret();
  }, []);

  return (
    <div className="min-h-[700px] w-full py-10">
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout className="overflow-clip rounded-md" />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}
