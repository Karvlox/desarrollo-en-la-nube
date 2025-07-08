import React, { useState } from 'react';
import { storage, db, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import '../styles/Upload.css';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [genreId, setGenreId] = useState('');
  const [artistId, setArtistId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const user = auth.currentUser;

  const handleUpload = async () => {
    if (!file || !genreId || !artistId || !user) {
      setMessage('Por favor completa todos los campos y selecciona un archivo mp3.');
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const storageRef = ref(storage, `mp3/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await setDoc(doc(db, `genres/${genreId}`), { name: genreId, imageUrl: '' }, { merge: true });
      await setDoc(doc(db, `genres/${genreId}/artists/${artistId}`), { name: artistId, imageUrl: '' }, { merge: true });

      const songRef = doc(collection(db, `genres/${genreId}/artists/${artistId}/songs`), Date.now().toString());
      await setDoc(songRef, {
        name: file.name,
        mp3Url: url,
        uploadedBy: user.uid,
        timestamp: serverTimestamp(),
      });

      const userSongRef = doc(collection(db, `users/${user.uid}/songs`), songRef.id);
      await setDoc(userSongRef, {
        name: file.name,
        mp3Url: url,
        genreId,
        artistId,
        songId: songRef.id,
        timestamp: serverTimestamp(),
      });

      setMessage('🎉 ¡Canción subida exitosamente!');
      setFile(null);
      setGenreId('');
      setArtistId('');
    } catch (error) {
      console.error('Error al subir:', error);
      setMessage('❌ Error al subir la canción. Intenta nuevamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Subir Música</h2>
      <div className="upload-form">
        <label className="upload-label">ID del Género</label>
        <input
          type="text"
          value={genreId}
          onChange={(e) => setGenreId(e.target.value)}
          placeholder="Ej: rock, pop..."
          className="upload-input"
          disabled={isUploading}
        />

        <label className="upload-label">ID del Artista</label>
        <input
          type="text"
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          placeholder="Nombre del artista"
          className="upload-input"
          disabled={isUploading}
        />

        <label className="upload-label">Archivo MP3</label>
        <input
          type="file"
          accept="audio/mp3"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="upload-file"
          disabled={isUploading}
        />

        <button
          onClick={handleUpload}
          className="upload-button"
          disabled={isUploading}
        >
          {isUploading ? <div className="loader"></div> : 'Subir'}
        </button>

        {message && <p className={`upload-message ${message.includes('❌') ? 'error' : 'success'}`}>{message}</p>}
      </div>
    </div>
  );
};

export default Upload;
