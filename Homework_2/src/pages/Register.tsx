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
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Registro</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Nombre Completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          placeholder="Edad"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="date"
          placeholder="Fecha de Nacimiento"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: '10px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Registrarse
        </button>
      </div>
    </div>
  );
};

export default Register;