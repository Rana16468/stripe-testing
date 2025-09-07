import  { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// Firebase config
const firebaseConfig = {
  // apiKey: "AIzaSyAoqRRdmL9jOhDQZ5BXQkZV19lyN3-0ygQ",
  // authDomain: "moving-delivery-service.firebaseapp.com",
  // projectId: "moving-delivery-service",
  // storageBucket: "moving-delivery-service.firebasestorage.app",
  // messagingSenderId: "316749586606",
  // appId: "1:316749586606:web:505212ee54ad61b4254d3f"

    apiKey: "AIzaSyAJy5EDuKmQNCpoZnlRTAGZKsg8c1A4KNE",
  authDomain: "moving-delivery-service-776cb.firebaseapp.com",
  projectId: "moving-delivery-service-776cb",
  storageBucket: "moving-delivery-service-776cb.firebasestorage.app",
  messagingSenderId: "202081296611",
  appId: "1:202081296611:web:b15052151b777fb6fc25d6"
};

  

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const messaging = getMessaging();

type NotificationPermissionStatus = 'default' | 'granted' | 'denied';

function FCMTokenComponent() {
  const [fcmToken, setFcmToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>(
    (Notification.permission as NotificationPermissionStatus) || 'default'
  );

  const getFCMToken = async () => {
    setLoading(true);
    setError(null);

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission as NotificationPermissionStatus);

      if (permission !== 'granted') {
        setError(`Notification permission ${permission}. Cannot get FCM token.`);
        return;
      }

      const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      const token = await getToken(messaging, {
        // vapidKey: "BOd6KLslH1BoXL_5wVbCCbpvzvSC4MchG2AhAtpBLiiGXbew8JWa5iV64YiXHHa45N1xPAwwvdlu078_XaQG-dA",
         vapidKey: "BDWnzAPA0ma-JHA98ZQuQ6QG-C2ILGuIgXQwEEWnyKFJvReKyekJ3ANRUKxE0wHTqMQyxY5xhMW5Q5SPxXXeyTU",
        serviceWorkerRegistration: swRegistration
      });

      console.log(token);

      if (token) {
        setFcmToken(token);
        localStorage.setItem('fcmToken', token);
        console.log('FCM Token:', token);
      } else {
        setError('No registration token available.');
      }
    } catch (err) {
      setError(`Error getting FCM token: ${err || 'Unknown error'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('fcmToken');
    if (storedToken) {
      setFcmToken(storedToken);
    } else if (permissionStatus === 'granted') {
      getFCMToken();
    }
  }, []);

  const copyToClipboard = () => {
    if (fcmToken && navigator.clipboard) {
      navigator.clipboard.writeText(fcmToken).then(() => {
        alert('Token copied to clipboard!');
      }).catch(err => {
        alert('Failed to copy token.');
        console.error(err);
      });
    }
  };

  console.log(fcmToken)

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h2>Firebase Cloud Messaging Token</h2>
      <p>Notification Permission Status: <strong>{permissionStatus}</strong></p>

      {loading ? (
        <p>Loading token...</p>
      ) : fcmToken ? (
        <div>
          <textarea
            readOnly
            value={fcmToken}
            style={{
              width: '100%',
              height: 100,
              marginTop: 10,
              padding: 10,
              fontFamily: 'monospace',
              fontSize: 12
            }}
          />
          <p>You can use this token to send test notifications.</p>
          <button onClick={copyToClipboard} style={{
            padding: '8px 16px',
            background: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            marginTop: 10,
            cursor: 'pointer'
          }}>
            Copy to Clipboard
          </button>
        </div>
      ) : (
        <div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={getFCMToken} style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 16,
            cursor: 'pointer'
          }}>
            Get FCM Token
          </button>
        </div>
      )}
    </div>
  );
}

export default FCMTokenComponent;
