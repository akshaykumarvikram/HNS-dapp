// Import the functions you need from the SDKs you need
// require("dotenv").config();

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging"

const firebaseConfig = {
  apiKey: "AIzaSyDkUMBUO-NSrjekE7Jr3Ugaq1WbXyTlb5g",
  authDomain: "hedera-notification-service.firebaseapp.com",
  projectId: "hedera-notification-service",
  storageBucket: "hedera-notification-service.appspot.com",
  messagingSenderId: "575071240694",
  appId: "1:575071240694:web:ff898366bd97edced547d7",
  measurementId: "G-SD0NPKFT5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export const requestFirebaseNotificationPermissionOld = () =>
  new Promise((resolve, reject) => {
    messaging
      // .requestPermission()
      .then(() => messaging.getToken())
      .then((firebaseToken) => {
        resolve(firebaseToken);
      })
      .catch((err) => {
        reject(err);
      });
  });

  export const requestFirebaseNotificationPermission = () =>
    new Promise((resolve, reject) => {
      getToken(messaging, { vapidKey: "Fill in Your VAPID Key from Firebase Portal"})
        .then((fcmToken) => {
          resolve(fcmToken);
        })
        .catch((err) => {
          reject(err);
        })
    });

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});
export default app;
