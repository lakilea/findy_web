import React, { useEffect, useState } from 'react';
import './qr.css';
import {
  useLocation
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import firestore from "../../firestore";

export default function QrScreen() {
  const qrKey = new URLSearchParams(useLocation().search).get("code");
  const [state, setState] = useState({
    selectedItems : []
  });

  useEffect(()=> {
    const unsubscribe = firestore
    .collection('UserQRCodes')
    .doc(qrKey)
    .onSnapshot(x => {
      setState(x.data());
      console.log(x.data())
    });

    return unsubscribe;
  },[qrKey]);

  return (
    state.selectedItems.length > 0 ? 
    <div className="container">
      <div className="header">
        <div className="headerText">findy</div>
      </div>
      <div className="body">
        <div className="qr-desc">
          {state.qrDescription}
        </div>
        <div className="qr-item-list">
          {state.selectedItems.map((item) => 
            <div className="qr-item" key={item.id}>
              <FontAwesomeIcon icon={faCoffee} /> {item.name}
            </div>
          )}
        </div>
      </div>
    </div>
    :
    <div className="container">
      <div className="header">
        <div className="headerText">findy</div>
      </div>
      <div className="body">
        <div className="qr-desc">
          There is no QR here!
        </div>
      </div>
    </div>
  )
}
