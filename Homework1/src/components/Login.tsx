import styles from './Login.module.css';
import { useContext, useState, type FormEvent } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe contener al menos 8 caracteres.");
      return;
    }
    const result = await authContext?.loginWithEmail(email, password);
    if (result) {
      setError(result);
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    const result = await authContext?.loginWithGoogle();
    if (result) {
      setError(result);
    } else {
      navigate("/dashboard");
    }
  };

  const handleFacebookLogin = async () => {
    setError("");
    const result = await authContext?.loginWithFacebook();
    if (result) {
      setError(result);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Iniciar Sesión</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleEmailLogin}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Correo:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Iniciar Sesión</button>
      </form>
      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={handleGoogleLogin}>Iniciar con Google</button>
        <button className={styles.button} onClick={handleFacebookLogin}>Iniciar con Facebook</button>
      </div>
    </div>
  );
};

export default Login;