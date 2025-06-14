import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Inicio de Sesión</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
        <button
          onClick={handleSubmit}
          style={{
            padding: '10px',
            backgroundColor: '#28A745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default Login;