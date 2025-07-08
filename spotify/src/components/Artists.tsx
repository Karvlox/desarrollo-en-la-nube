import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Songs from './Songs';
import '../styles/Artists.css';

interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
}

const Artists: React.FC<{ genreId: string }> = ({ genreId }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      const artistsCol = collection(db, `genres/${genreId}/artists`);
      const artistsSnapshot = await getDocs(artistsCol);
      const artistsData = artistsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Artist));
      setArtists(artistsData);
    };
    fetchArtists();
  }, [genreId]);

  return (
    <div className="artists-container">
      <h2 className="artists-title">Artistas</h2>
      <div className="artists-grid">
        {artists.map(artist => (
          <div
            key={artist.id}
            className="artist-card"
            onClick={() => setSelectedArtist(artist.id)}
          >
            {artist.imageUrl ? (
              <img src={artist.imageUrl} alt={artist.name} className="artist-img" />
            ) : (
              <div className="artist-placeholder">{artist.name.charAt(0)}</div>
            )}
            <h3 className="artist-name">{artist.name}</h3>
          </div>
        ))}
      </div>
      {selectedArtist && <Songs genreId={genreId} artistId={selectedArtist} />}
    </div>
  );
};

export default Artists;
