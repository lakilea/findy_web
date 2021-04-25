import React, { useEffect, useState } from 'react';
import './order.css';
import { useLocation} from "react-router-dom";
import firebase from "../../firebase-config";
import loading from "../../assets/icons/loading.gif"
import logo from "../../assets/logo.png";
import { products } from "../../products";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export default function OrderScreen() {
  const qrKey = new URLSearchParams(useLocation().search).get("code");
  const productId = new URLSearchParams(useLocation().search).get("product");

  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    selectedItems : []
  });

  const product = products.find(x=>x.code == productId);

  useEffect(()=> {
    const getQr = firebase.functions().httpsCallable("getQr");

    getQr({ id : qrKey, local : 1}).then((result) => {
      setState(result.data);
      setIsLoading(false);
    })
    .catch((error) => {
      debugger
    });
  },[qrKey]);

  return (
    isLoading ?
    <div className="loading-container">
      <img src={loading} className="loading-icon"></img>
    </div>
    :
    <div className="container">
      <div className="header">
        <div className="headerText">
          <img src={logo}></img>
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
                <img src={x.default} key={i}/>
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
          <select>
            {new Array(product.maxQuantity).fill(0).map((x,i)=> {
              return (
                <option value={i+1}>{i+1}</option>
              )
            })}
          </select>
        </div>
      </div>
    </div>
  )
}