// src/components/NotificationPanel.tsx
import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firebaseDb } from '../firebase';

const NotificationPanel = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userId) {
      const notificationRef = doc(firebaseDb, 'notifications', userId);

      // Inicializar el documento si no existe
      const initializeNotificationDoc = async () => {
        const docSnap = await getDoc(notificationRef);
        if (!docSnap.exists()) {
          await setDoc(notificationRef, { notifications: [] }, { merge: true });
        }
      };
      initializeNotificationDoc();

      const unsubscribe = onSnapshot(notificationRef, (docSnap) => {
        if (docSnap.exists()) {
          setNotifications(docSnap.data().notifications || []);
        } else {
          setNotifications([]);
        }
      }, (error) => {
        console.error('Error listening to notifications:', error);
      });
      return () => unsubscribe();
    }
  }, [userId]);

  const markAsRead = async (notificationId) => {
    const notificationRef = doc(firebaseDb, 'notifications', userId);
    const notificationToUpdate = notifications.find((n) => n.id === notificationId);
    if (notificationToUpdate) {
      await updateDoc(notificationRef, {
        notifications: arrayRemove(notificationToUpdate),
      });
      await updateDoc(notificationRef, {
        notifications: arrayUnion({ ...notificationToUpdate, read: true }),
      });
    }
  };

  return (
    <div style={{ marginTop: '20px', border: '1px solid #4B5563', padding: '15px', borderRadius: '10px', backgroundColor: '#1E3A8A' }}>
      <h3 style={{ color: '#FFFFFF' }}>Notificaciones</h3>
      {notifications.length === 0 ? (
        <p style={{ color: '#D1D5DB' }}>No hay notificaciones nuevas.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map((notif) => (
            <li
              key={notif.id}
              style={{ color: notif.read ? '#D1D5DB' : '#FFFFFF', padding: '10px', borderBottom: '1px solid #4B5563' }}
            >
              {notif.message} ({new Date(notif.timestamp).toLocaleString()})
              {!notif.read && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#3B82F6',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginLeft: '10px',
                  }}
                >
                  Marcar como leído
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPanel;