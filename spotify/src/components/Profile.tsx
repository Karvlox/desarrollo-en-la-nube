import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import '../styles/Profile.css';

const Profile: React.FC<{ user: any }> = ({ user }) => {
  const [songs, setSongs] = useState<any[]>([]);

  const fetchSongs = async () => {
    if (user) {
      const songsCol = collection(db, `users/${user.uid}/songs`);
      const snapshot = await getDocs(songsCol);
      const songsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSongs(songsData);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [user]);

  const handleDelete = async (songId: string) => {
    if (user) {      
      const songDocRef = doc(db, `users/${user.uid}/songs`, songId);
      const songSnap = await getDoc(songDocRef);

      if (songSnap.exists()) {
        const songData = songSnap.data() as { genreId: string; artistId: string };

        await deleteDoc(songDocRef);

        if (songData.genreId && songData.artistId) {
          const genreSongDocRef = doc(db, `genres/${songData.genreId}/artists/${songData.artistId}/songs`, songId);
          await deleteDoc(genreSongDocRef);
        }
        
        fetchSongs();
      }
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Mis Canciones</h2>
      {songs.length > 0 ? (
        <ul className="songs-list">
          {songs.map(song => (
            <li key={song.id} className="song-item">
              <div className="song-info">
                <h4 className="song-name">{song.name}</h4>
                <audio controls className="song-player">
                  <source src={song.mp3Url} type="audio/mpeg" />
                </audio>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(song.id)}
                aria-label={`Eliminar ${song.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-songs">No has subido canciones aún.</p>
      )}
    </div>
  );
};

export default Profile;
