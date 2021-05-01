import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom"
import './order.css';
import { useLocation} from "react-router-dom";
import firebase from "../../firebase-config";
import loading from "../../assets/icons/loading.gif"
import logo from "../../assets/logo.png";
import { products } from "../../products";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { useHistory } from 'react-router-dom';

export default function OrderScreen(props) {
  const qrKey = new URLSearchParams(useLocation().search).get("code");
  const productId = new URLSearchParams(useLocation().search).get("product");
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    selectedItems : []
  });
  const [quantity, setQuantity] = useState(1);

  const product = products.find(x=>x.code === productId);

  const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

  useEffect(()=> {
    const getQr = firebase.functions().httpsCallable("getQr");

    getQr({ id : qrKey, local : 1}).then((result) => {
      setState(result.data);
      setIsLoading(false);
    })
    .catch((error) => {
    });
  },[qrKey,quantity]);

  const createOrder = (data, actions) =>{
    return actions.order.create({
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
  };

  const onApprove = (data, actions) => {
    history.push('/order_complete');
    return actions.order.capture();
  };

  return (
    isLoading ?
    <div className="loading-container">
      <img src={loading} className="loading-icon" alt="loading"></img>
    </div>
    :
    <div className="container">
      <div className="header">
        <div className="headerText">
          <img src={logo} alt="logo"></img>
        </div>
      </div>
      <div className="body">
        <div className="product-header">
          Name : {product.name}
        </div>
        <Carousel>
          {product.images.map((x,i)=>{
            return (
              <div>
                <img src={x.default} key={i} alt={product.name+" "+i}/>
              </div>
            )
          })}
        </Carousel>
        <div className="product-description">
          {product.description}
        </div>
        <hr/>
        <div className="product-qr-details">
          You've selected this product for <b>{state.qrName}</b>
        </div>
        <div className="product-quantity">
          <label>Quantity : </label>
          <select value={quantity} onChange={(e)=> setQuantity(e.target.value)}>
            {new Array(product.maxQuantity).fill(0).map((x,i)=> {
              return (
                <option value={i+1} key={i}>{i+1}</option>
              )
            })}
          </select>
        </div>
        <div className="order-summary">
          <span>{product.name} x {quantity} : { (quantity*product.price).toFixed(2) } £</span> <br/>
          <span>Discount (30%): -{ (quantity*product.price*0.3).toFixed(2) } £</span> <br/>
          <span>Shipping : 0.00 £</span> <br/>
          <b><span>Order Total : { (quantity*product.price*0.7).toFixed(2) } £</span></b> <br/>
        </div>
        <div className="paypal-buttons">
          <PayPalButton
            createOrder={(data, actions) => createOrder(data, actions)}
            onApprove={(data, actions) => onApprove(data, actions)}
          />
        </div>
      </div>
    </div>
  )
}