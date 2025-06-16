import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firebaseDb, firebaseAuth } from '../firebase';
import PostList from './PostList';
import { Link } from 'react-router-dom';

const Home = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        const userDocRef = doc(firebaseDb, 'users', currentUser.uid);
        const postDocRef = doc(firebaseDb, 'posts', currentUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            console.log('No user data found, creating default profile.');
            setUserData({ fullName: 'Usuario', email: currentUser.email, address: '', age: '', birthdate: '' });
          }
          const postDocSnap = await getDoc(postDocRef);
          if (postDocSnap.exists()) {
            setPosts(postDocSnap.data().posts || []);
          } else {
            // Inicializar el documento si no existe
            await setDoc(postDocRef, { posts: [] }, { merge: true });
            setPosts([]);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setUserData({ fullName: 'Usuario', email: currentUser.email, address: '', age: '', birthdate: '' });
          setPosts([]);
        }
      };
      fetchUserData();
    }
  }, [currentUser]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const postDocRef = doc(firebaseDb, 'posts', currentUser.uid);
    const newPost = {
      id: Date.now().toString(), // ID único basado en timestamp
      content: postContent,
      timestamp: new Date().toISOString(),
    };

    try {
      await updateDoc(postDocRef, {
        posts: arrayUnion(newPost),
      }, { merge: true });
      setPosts((prevPosts) => [...prevPosts, newPost]);
      setPostContent('');
      setSuccessMessage('Publicación creada exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3000); // Mensaje desaparece después de 3 segundos
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    const postDocRef = doc(firebaseDb, 'posts', currentUser.uid);
    const postToDelete = posts.find((post) => post.id === postId);

    try {
      await updateDoc(postDocRef, {
        posts: arrayRemove(postToDelete),
      }, { merge: true });
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      setSuccessMessage('Publicación eliminada exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3000); // Mensaje desaparece después de 3 segundos
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (!currentUser) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#333' }}>Bienvenido</h1>
        <p>
          Por favor, <Link to="/login" style={{ color: '#007BFF' }}>inicia sesión</Link> o{' '}
          <Link to="/register" style={{ color: '#007BFF' }}>regístrate</Link>.
        </p>
      </div>
    );
  }

  if (!userData) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Página Principal</h1>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <p><strong>Bienvenido:</strong> {userData.fullName}</p>
        <p><strong>Correo:</strong> {userData.email}</p>
        <p><strong>Dirección:</strong> {userData.address}</p>
        <p><strong>Edad:</strong> {userData.age}</p>
        <p><strong>Fecha de Nacimiento:</strong> {userData.birthdate}</p>
        <button
          onClick={() => firebaseAuth.signOut()}
          style={{
            padding: '10px',
            backgroundColor: '#DC3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Formulario para crear publicaciones */}
      <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ color: '#333' }}>Crear Publicación</h2>
        <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Escribe tu publicación..."
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '100px' }}
          />
          <button
            type="submit"
            style={{
              padding: '10px',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Publicar
          </button>
        </form>
        {successMessage && <p style={{ color: '#28A745', textAlign: 'center', marginTop: '10px' }}>{successMessage}</p>}
      </div>

      {/* Lista de publicaciones */}
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ color: '#333' }}>Tus Publicaciones</h2>
        {posts.length === 0 ? (
          <p>No hay publicaciones aún.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {posts.map((post) => (
              <li key={post.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#fff' }}>
                <p>{post.content}</p>
                <p style={{ fontSize: '0.8em', color: '#666' }}>Publicado: {new Date(post.timestamp).toLocaleString()}</p>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#DC3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '5px',
                  }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
        {successMessage && <p style={{ color: '#28A745', textAlign: 'center', marginTop: '10px' }}>{successMessage}</p>}
      </div>
    </div>
  );
};

export default Home;