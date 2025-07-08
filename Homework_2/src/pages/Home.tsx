import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  collection,
} from 'firebase/firestore';
import { firebaseDb, firebaseAuth, firebaseMessaging } from '../firebase';
import PostForm from './PostForm';
import PostList from './PostList';
import { Link } from 'react-router-dom';
import { getToken, onMessage } from 'firebase/messaging';

const Home = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    const fetchUserData = async () => {
      const userDocRef = doc(firebaseDb, 'users', currentUser.uid);
      const postDocRef = doc(firebaseDb, 'posts', currentUser.uid);

      try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          const newUserData = {
            fullName: 'Usuario',
            email: currentUser.email,
            address: '',
            age: '',
            birthdate: '',
          };
          await setDoc(userDocRef, newUserData);
          setUserData(newUserData);
        }

        const postDocSnap = await getDoc(postDocRef);
        if (postDocSnap.exists()) {
          setPosts(postDocSnap.data().posts || []);
        } else {
          await setDoc(postDocRef, { posts: [] }, { merge: true });
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const setupNotifications = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          const currentToken = await getToken(firebaseMessaging, {
            vapidKey: 'BOpmFl1x44EtBQrD6SsKci923_XvrL6cQzBfhZxqu042N9bJE9ooUKLmU0-0-3DLUN0hFDBdOGihKeq5jSQ9kIQ',
            serviceWorkerRegistration: registration,
          });

          if (currentToken) {
            console.log('🔔 Token de notificación:', currentToken);
            await updateDoc(doc(firebaseDb, 'users', currentUser.uid), {
              notificationToken: currentToken,
            }, { merge: true });
          }
        }
      } catch (error) {
        console.error('🚨 Error con las notificaciones:', error);
      }
    };

    fetchUserData();
    setupNotifications();

    onMessage(firebaseMessaging, (payload) => {
      console.log('📩 Notificación recibida en primer plano:', payload);
      const { title, body } = payload.notification ?? {};
      if (title && body) {
        alert(`${title}: ${body}`);
      }
    });
  }, [currentUser]);

  const handleCreatePost = async (postData) => {
    if (!postData.content.trim() && !postData.imageUrl) return;
    const postDocRef = doc(firebaseDb, 'posts', currentUser.uid);

    try {
      await updateDoc(postDocRef, { posts: arrayUnion(postData) }, { merge: true });
      setPosts((prevPosts) => [...prevPosts, postData]);
      setSuccessMessage('Publicación creada exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await sendNotificationsToAllUsers(postData);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    const postDocRef = doc(firebaseDb, 'posts', currentUser.uid);
    const postToDelete = posts.find((post) => post.id === postId);

    try {
      await updateDoc(postDocRef, {
        posts: arrayRemove(postToDelete),
      }, { merge: true });
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      setSuccessMessage('Publicación eliminada exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const sendNotificationsToAllUsers = async (postData) => {
    if (!userData?.fullName) return;

    const usersSnapshot = await getDocs(collection(firebaseDb, 'users'));
    const notifications = usersSnapshot.docs
      .filter((doc) => doc.id !== currentUser.uid)
      .map(async (userDoc) => {
        const userId = userDoc.id;
        const userToken = userDoc.data().notificationToken;

        if (userToken) {
          await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `key=BOpmFl1x44EtBQrD6SsKci923_XvrL6cQzBfhZxqu042N9bJE9ooUKLmU0-0-3DLUN0hFDBdOGihKeq5jSQ9kIQ`,
            },
            body: JSON.stringify({
              to: userToken,
              notification: {
                title: `${userData.fullName} ha publicado algo nuevo`,
                body: postData.content.substring(0, 100),
              },
            }),
          });
        }
      });

    await Promise.all(notifications);
  };

  if (!currentUser) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#1E3A8A',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        color: '#FFFFFF',
      }}>
        <h1>Bienvenido</h1>
        <p>
          Por favor, <Link to="/login" style={{ color: '#3B82F6' }}>inicia sesión</Link> o{' '}
          <Link to="/register" style={{ color: '#3B82F6' }}>regístrate</Link>.
        </p>
      </div>
    );
  }

  if (!userData) return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando...</div>;

  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#1E3A8A',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      color: '#FFFFFF',
    }}>
      <h1 style={{ textAlign: 'center' }}>Página Principal</h1>
      <div style={{ border: '1px solid #4B5563', padding: '20px', borderRadius: '10px' }}>
        <p><strong>Bienvenido:</strong> {userData.fullName}</p>
        <p><strong>Correo:</strong> {userData.email}</p>
        <p><strong>Dirección:</strong> {userData.address}</p>
        <p><strong>Edad:</strong> {userData.age}</p>
        <p><strong>Fecha de Nacimiento:</strong> {userData.birthdate}</p>
        <button
          onClick={() => firebaseAuth.signOut()}
          style={{
            padding: '12px',
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
            marginTop: '10px',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#2563EB')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#3B82F6')}
        >
          Cerrar Sesión
        </button>
      </div>

      <PostForm onCreatePost={handleCreatePost} successMessage={successMessage} />
      <PostList posts={posts} onDeletePost={handleDeletePost} successMessage={successMessage} />
    </div>
  );
};

export default Home;
