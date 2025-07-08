import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    setError(null);
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Iniciado:', userCredential.user);
        navigate('/');
      })
      .catch((error) => {
        setError('Correo o contraseña incorrectos');
        console.error('Error:', error.message);
      });
  };

  return (
    <div className="auth-container">
      <h1>Iniciar Sesión</h1>
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
      <button onClick={handleLogin} className="auth-button">
        Iniciar Sesión
      </button>
      <p className="auth-switch-text">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="auth-link">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
};

export default Login;
