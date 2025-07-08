import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Genres from './components/Genres';
import Upload from './components/Upload';
import Profile from './components/Profile';
import Header from './components/Header';
import GenreDetail from './components/GenreDetail';
import ArtistDetail from './components/ArtistDetail';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="app">
      {isAuthenticated && <Header />}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Genres /> : (
                <div>                  
                  <Login />                  
                </div>
              )
            }
          />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/upload" element={isAuthenticated ? <Upload /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile user={user} /> : <Navigate to="/login" />} />
          <Route path="/genre/:genreId" element={isAuthenticated ? <GenreDetail /> : <Navigate to="/login" />} />
          <Route path="/genre/:genreId/artist/:artistId" element={isAuthenticated ? <ArtistDetail /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;