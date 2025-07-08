import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/Songs.css';

interface Song {
  id: string;
  name: string;
  mp3Url: string;
}

const Songs: React.FC<{ artistId: string; genreId: string }> = ({ artistId, genreId }) => {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const songsCol = collection(db, `genres/${genreId}/artists/${artistId}/songs`);
      const songsSnapshot = await getDocs(songsCol);
      const songsData = songsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Song));
      setSongs(songsData);
    };
    fetchSongs();
  }, [artistId, genreId]);

  return (
    <div className="songs-section">
      <h2 className="section-title">Canciones</h2>
      {songs.length > 0 ? (
        <ul className="song-list">
          {songs.map(song => (
            <li key={song.id} className="song-item">
              <div className="song-thumbnail">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/727/727218.png"
                  alt={song.name}
                  className="song-image"
                />
              </div>
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

export default Songs;