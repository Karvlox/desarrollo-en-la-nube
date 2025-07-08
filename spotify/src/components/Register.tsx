import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = () => {
    setError(null);
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Registrado:', userCredential.user);
        navigate('/');
      })
      .catch((error) => {
        setError('Error en el registro. Intenta nuevamente.');
        console.error('Error:', error.message);
      });
  };

  return (
    <div className="auth-container">
      <h1>Crear Cuenta</h1>
      {error && <p className="auth-error">{error}</p>}
      <input
        type="email"
        className="auth-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
      />
      <input
        type="password"
        className="auth-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button onClick={handleRegister} className="auth-button">
        Registrarse
      </button>
      <p className="auth-switch-text">
        ¿Ya tienes cuenta?{' '}
        <Link to="/" className="auth-link">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
};

export default Register;
