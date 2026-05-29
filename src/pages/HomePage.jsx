import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { database } from '../firebase';
import { ref, push, set, get, child, update } from 'firebase/database';
import '../styles/HomePage.css';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsRef = ref(database, 'posts');
      const snapshot = await get(postsRef);
      if (snapshot.exists()) {
        const postsData = [];
        snapshot.forEach((child) => {
          postsData.push({ id: child.key, ...child.val() });
        });
        setPosts(postsData.reverse());
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setLoading(true);
    try {
      // Get user data
      const userRef = ref(database, 'users/' + userId);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      // Create new post
      const newPostRef = push(ref(database, 'posts'));
      await set(newPostRef, {
        userId,
        userName: userData.name,
        userAvatar: userData.avatar,
        content: newPost,
        imageUrl: null,
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        createdAt: new Date().toISOString(),
      });

      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const postRef = ref(database, 'posts/' + postId);
      const snapshot = await get(postRef);
      const post = snapshot.val();
      
      await update(postRef, {
        likes: (post.likes || 0) + 1
      });

      fetchPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  return (
    <div className="home-page">
      <div className="feed-container">
        {/* Create Post */}
        <div className="create-post-card">
          <form onSubmit={handleCreatePost}>
            <textarea
              placeholder="ما الذي يشغل بالك؟"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows="3"
            />
            <button type="submit" disabled={loading || !newPost.trim()}>
              {loading ? 'جاري النشر...' : 'نشر'}
            </button>
          </form>
        </div>

        {/* Posts Feed */}
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="user-info">
                <img src={post.userAvatar || 'https://via.placeholder.com/40'} alt={post.userName} className="avatar" />
                <div>
                  <h3>{post.userName}</h3>
                  <p className="post-time">{new Date(post.createdAt).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            </div>

            <div className="post-content">
              <p>{post.content}</p>
              {post.imageUrl && <img src={post.imageUrl} alt="Post" className="post-image" />}
            </div>

            <div className="post-stats">
              <span>{post.likes} إعجاب</span>
              <span>{post.comments} تعليق</span>
              <span>{post.shares} مشاركة</span>
            </div>

            <div className="post-actions">
              <button onClick={() => handleLike(post.id)} className="action-btn">
                <Heart size={20} /> إعجاب
              </button>
              <button className="action-btn">
                <MessageCircle size={20} /> تعليق
              </button>
              <button className="action-btn">
                <Share2 size={20} /> مشاركة
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
