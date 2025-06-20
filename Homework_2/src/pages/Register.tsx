import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;
      await setDoc(doc(firebaseDb, 'users', user.uid), {
        fullName,
        email,
        address,
        age,
        birthdate,
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '400px',
      margin: '0 auto',
      backgroundColor: '#1E3A8A',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      color: '#FFFFFF',
    }}>
      <h1 style={{ textAlign: 'center', color: '#FFFFFF' }}>Registro</h1>
      {error && <p style={{ color: '#F87171', textAlign: 'center' }}>{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}>
        <input
          type="text"
          placeholder="Nombre Completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #4B5563',
            backgroundColor: '#FFFFFF',
            color: '#1F2937',
            fontSize: '16px',
          }}
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #4B5563',
            backgroundColor: '#FFFFFF',
            color: '#1F2937',
            fontSize: '16px',
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #4B5563',
            backgroundColor: '#FFFFFF',
            color: '#1F2937',
            fontSize: '16px',
          }}
        />
        <input
          type="text"
          placeholder="Dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #4B5563',
            backgroundColor: '#FFFFFF',
            color: '#1F2937',
            fontSize: '16px',
          }}
        />
        <input
          type="number"
          placeholder="Edad"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #4B5563',
            backgroundColor: '#FFFFFF',
            color: '#1F2937',
            fontSize: '16px',
          }}
        />
        <input
          type="date"
          placeholder="Fecha de Nacimiento"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #4B5563',
            backgroundColor: '#FFFFFF',
            color: '#1F2937',
            fontSize: '16px',
          }}
        />
        <button
          onClick={handleSubmit}
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
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#2563EB')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#3B82F6')}
        >
          Registrarse
        </button>
      </div>
    </div>
  );
};

export default Register;