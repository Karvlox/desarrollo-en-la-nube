import { useContext, useState, useEffect, type FormEvent } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLinkEmail = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    const result = await authContext?.linkWithEmail(email, password);
    if (result) {
      setError(result);
    } else {
      alert("Correo/contraseña vinculado exitosamente");
      setEmail("");
      setPassword("");
    }
  };

  const handleLinkGoogle = async () => {
    setError("");
    const result = await authContext?.linkGoogle();
    if (result) {
      setError(result);
    } else {
      alert("Google vinculado exitosamente");
    }
  };

  const handleLinkFacebook = async () => {
    setError("");
    const result = await authContext?.linkFacebook();
    if (result) {
      setError(result);
    } else {
      alert("Facebook vinculado exitosamente");
    }
  };

  const handleUnlink = async (providerId: string) => {
    setError("");
    const result = await authContext?.unlinkProvider(providerId);
    if (result) {
      setError(result);
    } else {
      alert(`Proveedor ${providerId} desvinculado exitosamente`);
    }
  };

  const handleLogout = async () => {
    setError("");
    await authContext?.logout();
    navigate("/login");
  };

  const providers = authContext?.user?.providerData.map((provider) => provider.providerId) || [];

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Bienvenido, {authContext?.user?.email}</h2>
      {error && <p className={styles.error}>{error}</p>}
      {authContext?.customClaims && (
        <div className={styles.claims}>
          <h3 className={styles.subheading}>Información Personal:</h3>
          <p><strong>Dirección:</strong> {authContext.customClaims.direccion || 'No especificada'}</p>
          <p><strong>Fecha de Nacimiento:</strong> {authContext.customClaims.fechaNacimiento || 'No especificada'}</p>
          <p><strong>Edad:</strong> {authContext.customClaims.edad || 'No especificada'}</p>
        </div>
      )}
      <h3 className={styles.subheading}>Proveedores vinculados:</h3>
      <ul className={styles.providerList}>
        {providers.map((provider) => (
          <li key={provider} className={styles.providerItem}>
            {provider === "password" ? "Correo/contraseña" : provider}
            <button className={styles.unlinkButton} onClick={() => handleUnlink(provider)}>Desvincular</button>
          </li>
        ))}
      </ul>
      {!providers.includes("password") && (
        <div className={styles.formContainer}>
          <h3 className={styles.subheading}>Vincular con Correo/Contraseña</h3>
          <form className={styles.form} onSubmit={handleLinkEmail}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Correo:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.submitButton}>Vincular Correo/Contraseña</button>
          </form>
        </div>
      )}
      <div className={styles.buttonGroup}>
        {!providers.includes("google.com") && (
          <button className={styles.button} onClick={handleLinkGoogle}>Vincular Google</button>
        )}
        {!providers.includes("facebook.com") && (
          <button className={styles.button} onClick={handleLinkFacebook}>Vincular Facebook</button>
        )}
        <button className={styles.logoutButton} onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default Dashboard;