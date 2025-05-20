// Firebase service worker for FCM

importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAoqRRdmL9jOhDQZ5BXQkZV19lyN3-0ygQ",
  authDomain: "moving-delivery-service.firebaseapp.com",
  projectId: "moving-delivery-service",
  storageBucket: "moving-delivery-service.firebasestorage.app",
  messagingSenderId: "316749586606",
  appId: "1:316749586606:web:505212ee54ad61b4254d3f"
});

const messaging = firebase.messaging();
