import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '../firebase';

const PostForm = ({ onCreatePost, successMessage }) => {
  const [postContent, setPostContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim() && !imageFile) return;

    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `posts/${Date.now()}_${imageFile?.name || 'no-image'}`);
    let imageUrl = '';

    if (imageFile) {
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading image:', error);
        },
        async () => {
          imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          submitPost(imageUrl);
        }
      );
    } else {
      submitPost(imageUrl);
    }
  };

  const submitPost = (imageUrl) => {
    const newPost = {
      id: Date.now().toString(),
      content: postContent,
      timestamp: new Date().toISOString(),
      imageUrl: imageUrl || '',
    };
    onCreatePost(newPost);
    setPostContent('');
    setImageFile(null);
    setUploadProgress(0);
  };

  return (
    <div style={{ marginTop: '20px', border: '1px solid #4B5563', padding: '20px', borderRadius: '10px', backgroundColor: '#1E3A8A' }}>
      <h2 style={{ color: '#FFFFFF' }}>Crear Publicación</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Escribe tu publicación..."
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #4B5563',
            backgroundColor: '#FFFFFF',
            color: '#1F2937',
            fontSize: '16px',
            minHeight: '100px',
          }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #4B5563', backgroundColor: '#FFFFFF', color: '#1F2937' }}
        />
        {uploadProgress > 0 && <p style={{ color: '#10B981' }}>Subiendo: {uploadProgress}%</p>}
        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#2563EB')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#3B82F6')}
        >
          Publicar
        </button>
      </form>
      {successMessage && <p style={{ color: '#10B981', textAlign: 'center', marginTop: '10px' }}>{successMessage}</p>}
    </div>
  );
};

export default PostForm;