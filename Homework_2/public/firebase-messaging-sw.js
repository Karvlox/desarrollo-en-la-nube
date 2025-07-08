importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAMxw1JnYsuyUwAqpjx271_hZGWnjzoCHM",
  authDomain: "desarrolloenlanube-a0d01.firebaseapp.com",
  projectId: "desarrolloenlanube-a0d01",
  storageBucket: "desarrolloenlanube-a0d01.appspot.com",
  messagingSenderId: "1078968510007",
  appId: "1:1078968510007:web:2a1be1b3667f81378581b2"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] 🎯 Notificación recibida en segundo plano:', payload);

  const { title, body } = payload.notification || {};

  if (title && body) {
    self.registration.showNotification(title, {
      body,
      icon: '/logo192.png'
    });
  }
});
