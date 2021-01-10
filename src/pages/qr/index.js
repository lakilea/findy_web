import React from 'react';
import './qr.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'

export default function QrScreen() {
  return (
    <div className="container">
      <div className="header">
        <div className="headerText">findy</div>
      </div>
      <div className="body">
        <div className="qr-desc">
          Hello, propably I've lost that baggage and you've scanned my baggage. Can you please reach me with using the below contact details? Thank you very much...
        </div>
        <div className="qr-item">
          <FontAwesomeIcon icon={faCoffee} /> Adress Mahallesi adres sokak.
        </div>
        <div className="qr-item">
          <FontAwesomeIcon icon={faFacebook} /> facebook.com/zfrkoja
        </div>
      </div>
    </div>
  )
}