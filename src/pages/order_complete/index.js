import React from 'react';
import './order_complete.css';
import logo from "../../assets/logo.png";

export default function OrderCompleteScreen() {
  return (
    <div className="container">
      <div className="header">
        <div className="headerText">
          <img src={logo} alt="logo"></img>
        </div>
      </div>
      <div className="body">
        <h1>Thank you for your order!</h1>
        <h2>Your order has been completed successfully. We'll be sent the tracking number via email.</h2>
      </div>
    </div>
  )
}