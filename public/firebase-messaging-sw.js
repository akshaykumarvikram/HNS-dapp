// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyDkUMBUO-NSrjekE7Jr3Ugaq1WbXyTlb5g",
    authDomain: "hedera-notification-service.firebaseapp.com",
    projectId: "hedera-notification-service",
    storageBucket: "hedera-notification-service.appspot.com",
    messagingSenderId: "575071240694",
    appId: "1:575071240694:web:ff898366bd97edced547d7",
    measurementId: "G-SD0NPKFT5T"
  };

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('notificationclick', event => {
    console.log(event)
    return event;
  });