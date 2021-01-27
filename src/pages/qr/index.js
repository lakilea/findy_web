import React, { useEffect, useState } from 'react';
import './qr.css';
import { useLocation} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faEnvelope, faLocationArrow, faPhone } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons'
import firebase from "../../firebase-config";
import logo from "../../assets/logo.png";

export default function QrScreen() {
  const qrKey = new URLSearchParams(useLocation().search).get("code");
  const local = new URLSearchParams(useLocation().search).get("m");
  const [state, setState] = useState({
    selectedItems : []
  });

  useEffect(()=> {
    const getQr = firebase.functions().httpsCallable("getQr");

    getQr({ id : qrKey, local : local}).then((result) => {
      setState(result.data);

      if (!local) {
        const userId = result.userId;
        const currentTimeStamp = new Date().getTime();
        const oneHourLater = new Date().getTime() + (1*60*60*1000);

        // firestore.collection("Users").doc(userId).onSnapshot(u => {
        //   firestore.collection("NotificationQueue").where("userId", "==", userId).where("expiredAt",">",currentTimeStamp).onSnapshot(prevSnapShot=> {
        //     if(prevSnapShot.docs.length === 0)
        //     {
        //       firestore.collection("NotificationQueue").add({
        //         text:"'" + result.qrName + "' QR has been scanned by someone!",
        //         fcmToken : u.data().fcmToken,
        //         userId: userId,
        //         timestamp: currentTimeStamp,
        //         expiredAt: oneHourLater
        //       });
      
        //       firestore.collection("UserNotifications").add({
        //         text:"'" + result.qrName + "' QR has been scanned by someone!",
        //         isRead: false,
        //         navigation: null,
        //         userId: userId
        //       });
        //     }
        //   });
        // });
      }
    })
    .catch((error) => {
      debugger
    });
  },[qrKey]);

  return (
    state.selectedItems.length > 0 ? 
    <div className="container">
      <div className="header">
        <div className="headerText">
          <img src={logo}></img>
        </div>
      </div>
      <div className="body">
        <div className="qr-desc">
          {state.qrDescription}
        </div>
        <div className="qr-item-list">
          {state.selectedItems.map((item) => 
            {
              let text = "";
              let icon = faCoffee;

              if (item.type==="address") {
                text = item.address + " " + item.country;
                icon = faLocationArrow;

                return (<div className="qr-item" key={item.id}>
                  <FontAwesomeIcon icon={icon} color="#f69833" /> <a href={"https://maps.google.com/?q="+text} target="_blank">{text}</a>
                </div>)
              }

              if (item.type==="email") {
                text = item.emailAddress;
                icon = faEnvelope;

                return (<div className="qr-item" key={item.id}>
                  <FontAwesomeIcon icon={icon} color="#f69833" /> <a href={"mailto:"+text}>{text}</a>
                </div>)
              }

              if (item.type==="phone") {
                text = item.phoneNumber;
                icon = faPhone;

                return (<div className="qr-item" key={item.id}>
                  <FontAwesomeIcon icon={icon} color="#f69833" /> <a href={"tel:"+text}>{text}</a>
                </div>)
              }

              if (item.type==="social") {
                text = item.platform+"/"+item.socialAccount;
                if (item.platform==="facebook.com")
                  icon = faFacebook;
                if (item.platform==="twitter.com")
                  icon = faTwitter;

                return (<div className="qr-item" key={item.id}>
                  <FontAwesomeIcon icon={icon} color="#f69833" /> <a href={"http://"+text} target="_blank">{text}</a>
                </div>)
              }
            }
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
