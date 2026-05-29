import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import '../styles/HomePage.css';

export default function HomePage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      userName: 'أحمد محمد',
      userAvatar: 'https://via.placeholder.com/40',
      content: 'مرحباً بك في ASH SOCIAL! 🎉',
      likes: 5,
      comments: 2,
      shares: 1,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [newPost, setNewPost] = useState('');

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post = {
      id: posts.length + 1,
      userName: 'أنت',
      userAvatar: 'https://via.placeholder.com/40',
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
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
            <button type="submit" disabled={!newPost.trim()}>
              نشر
            </button>
          </form>
        </div>

        {/* Posts Feed */}
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="user-info">
                <img src={post.userAvatar} alt={post.userName} className="avatar" />
                <div>
                  <h3>{post.userName}</h3>
                  <p className="post-time">{new Date(post.createdAt).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            </div>

            <div className="post-content">
              <p>{post.content}</p>
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
