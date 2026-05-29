import '../styles/ProfilePage.css';

export default function ProfilePage() {
  const user = {
    name: 'أحمد محمد',
    avatar: 'https://via.placeholder.com/150',
    bio: 'مرحباً بك في ملفي الشخصي',
    followers: 150,
    following: 80,
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={user.avatar} alt={user.name} className="profile-avatar" />
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p className="bio">{user.bio}</p>
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
