import { useParams } from 'wouter';
import { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, get, child } from 'firebase/database';
import '../styles/ProfilePage.css';

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const userRef = ref(database, 'users/' + id);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setUser(snapshot.val());
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (!user) return <div className="error">المستخدم غير موجود</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={user.avatar || 'https://via.placeholder.com/150'} alt={user.name} className="profile-avatar" />
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p className="bio">{user.bio || 'لا توجد سيرة ذاتية'}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="count">0</span>
              <span className="label">منشورات</span>
            </div>
            <div className="stat">
              <span className="count">{user.followers}</span>
              <span className="label">متابعون</span>
            </div>
            <div className="stat">
              <span className="count">{user.following}</span>
              <span className="label">متابعة</span>
            </div>
          </div>
          <button className="follow-btn">متابعة</button>
        </div>
      </div>

      <div className="profile-posts">
        <h2>المنشورات</h2>
        <p className="empty">لا توجد منشورات حتى الآن</p>
      </div>
    </div>
  );
}
