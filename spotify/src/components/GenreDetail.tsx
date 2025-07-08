import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Songs from './Songs';
import '../styles/GenreDetail.css';

const GenreDetail: React.FC = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const [artists, setArtists] = useState<{ id: string; name: string }[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      const querySnapshot = await getDocs(collection(db, `genres/${genreId}/artists`));
      const artistsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setArtists(artistsData);
    };
    fetchArtists();
  }, [genreId]);

  return (
    <div className="genre-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>⟵ Volver</button>
      <h2 className="genre-detail-title">Artistas</h2>
      <div className="artist-grid">
        {artists.map(artist => (
          <div
            key={artist.id}
            className="artist-card"
            onClick={() => setSelectedArtist(artist.id)}
          >
            <Link to={`/genre/${genreId}/artist/${artist.id}`} className="artist-link">
              <h3 className="artist-name">{artist.name}</h3>
            </Link>
          </div>
        ))}
      </div>
      {selectedArtist && <Songs genreId={genreId} artistId={selectedArtist} />}
    </div>
  );
};

export default GenreDetail;
