import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import '../styles/Header.css';
import profile from '../assets/profile.png';

const logoutIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut()
      .then(() => navigate('/login'))
      .catch((error) => console.error('Error al cerrar sesión:', error));
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <Link to="/" className="nav-icon" title="Spotify Clone">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Spotify_App_Logo.svg/2048px-Spotify_App_Logo.svg.png"
              alt="Spotify Clone Logo"
              className="logo"
            />
          </Link>
          <Link to="/" className="nav-text" title="Inicio">Inicio</Link>
          <Link to="/upload" className="nav-text" title="Subir Música">Subir Música</Link>
        </div>

        <div className="nav-right">
          <Link to="/profile" className="nav-icon" title="Perfil">
            <img src={profile} alt="Perfil" className="profile-icon" />
          </Link>
          <button onClick={handleLogout} className="nav-icon logout-button" title="Cerrar Sesión" aria-label="Cerrar Sesión">
            {logoutIcon}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;