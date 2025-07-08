import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/ArtistDetail.css';

const ArtistDetail: React.FC = () => {
  const { genreId, artistId } = useParams<{ genreId: string; artistId: string }>();
  const [songs, setSongs] = useState<{ id: string; name: string; mp3Url: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      const querySnapshot = await getDocs(collection(db, `genres/${genreId}/artists/${artistId}/songs`));
      const songsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as { id: string; name: string; mp3Url: string }));
      setSongs(songsData);
    };
    fetchSongs();
  }, [genreId, artistId]);

  return (
    <div className="artist-detail">
      <button className="back-button" onClick={() => navigate(-1)}>⟵ Volver</button>
      <h2 className="section-title">Canciones</h2>
      {songs.length > 0 ? (
        <ul className="song-list">
          {songs.map(song => (
            <li key={song.id} className="song-item">
              <div className="song-icon">🎵</div>
              <div className="song-info">
                <h3 className="song-name">{song.name}</h3>
                <audio controls className="song-player">
                  <source src={song.mp3Url} type="audio/mpeg" />
                </audio>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-songs">No hay canciones disponibles.</p>
      )}
    </div>
  );
};

export default ArtistDetail;
