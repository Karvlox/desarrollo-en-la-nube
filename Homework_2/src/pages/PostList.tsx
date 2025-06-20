import React from 'react';

const PostList = ({ posts, onDeletePost, successMessage }) => {
  if (posts.length === 0) {
    return <p style={{ color: '#D1D5DB' }}>No hay publicaciones aún.</p>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h2 style={{ color: '#FFFFFF' }}>Tus Publicaciones</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post) => (
          <li key={post.id} style={{ border: '1px solid #4B5563', padding: '15px', marginBottom: '15px', borderRadius: '10px', backgroundColor: '#1E3A8A' }}>
            <p style={{ color: '#FFFFFF' }}>{post.content}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                style={{ maxWidth: '100%', borderRadius: '5px', marginTop: '10px' }}
              />
            )}
            <p style={{ fontSize: '0.8em', color: '#D1D5DB' }}>Publicado: {new Date(post.timestamp).toLocaleString()}</p>
            <button
              onClick={() => onDeletePost(post.id)}
              style={{
                padding: '8px 12px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s',
                marginTop: '10px',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#DC2626')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#EF4444')}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      {successMessage && <p style={{ color: '#10B981', textAlign: 'center', marginTop: '10px' }}>{successMessage}</p>}
    </div>
  );
};

export default PostList;