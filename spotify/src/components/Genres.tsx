import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../styles/Genres.css'; // Importa el archivo CSS

const Genres: React.FC = () => {
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const querySnapshot = await getDocs(collection(db, 'genres'));
      const genresData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setGenres(genresData);
    };
    fetchGenres();
  }, []);

  return (
    <div className="genres-container">
      <h2 className="genres-title">Explora por Géneros</h2>
      <div className="genres-grid">
        {genres.map(genre => (
          <Link to={`/genre/${genre.id}`} key={genre.id} className="genre-card">
            <img
              src="https://i.pinimg.com/236x/09/7a/95/097a95e56ae29b5757a7afa015bd9977.jpg"
              alt={genre.name}
              className="genre-image"
            />
            <span className="genre-name">{genre.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Genres;
