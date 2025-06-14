import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb, firebaseAuth } from '../firebase';
import { Link } from 'react-router-dom';

const Home = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        const docRef = doc(firebaseDb, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      };
      fetchUserData();
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#333' }}>Bienvenido</h1>
        <p>
          Por favor, <Link to="/login" style={{ color: '#007BFF' }}>inicia sesión</Link> o{' '}
          <Link to="/register" style={{ color: '#007BFF' }}>regístrate</Link>.
        </p>
      </div>
    );
  }

  if (!userData) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Página Principal</h1>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <p><strong>Bienvenido:</strong> {userData.fullName}</p>
        <p><strong>Correo:</strong> {userData.email}</p>
        <p><strong>Dirección:</strong> {userData.address}</p>
        <p><strong>Edad:</strong> {userData.age}</p>
        <p><strong>Fecha de Nacimiento:</strong> {userData.birthdate}</p>
        <button
          onClick={() => firebaseAuth.signOut()}
          style={{
            padding: '10px',
            backgroundColor: '#DC3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Home;