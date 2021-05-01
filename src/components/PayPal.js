//import liraries
import React, { useEffect, useRef }  from 'react';
import { useState } from 'react';

export default function PayPal({ quantity, product, qrKey }) {
  const [order,setOrder] = useState(null);

  const paypal = useRef();

  useEffect(()=> {
    console.log(paypal.current);

    setOrder({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: product.name + "x" + quantity,
          custom_id: qrKey,
          amount: {
            currency_code: "GBP",
            value: (quantity*product.price*0.7).toFixed(2)
          }
        }
      ],
      items: [
        {
          name: product.name,
          quantity: quantity,
          unit_amount: {
            currency_code: "GBP",
            value: (product.price*0.7).toFixed(2)
          },
          sku: product.code
        }
      ]
    });
    
    if (paypal.current.outerHTML == "<div></div>") {
      window.paypal.Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create(order)
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(order);
        },
        onError: (err) => {
          console.log(err);
        }
      }).render(paypal.current);
    }
  }, [quantity]);

  return (
    <div ref={paypal}></div>
  )
}
