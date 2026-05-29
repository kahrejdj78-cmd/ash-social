import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      setCurrentPage('home');
      setUser({ id: '1', name: 'المستخدم' });
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setCurrentPage('login');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="logo">ASH SOCIAL</h1>
          <div className="nav-links">
            <button onClick={() => handleNavigate('home')} className={currentPage === 'home' ? 'active' : ''}>
              الرئيسية
            </button>
            <button onClick={() => handleNavigate('messages')} className={currentPage === 'messages' ? 'active' : ''}>
              الرسائل
            </button>
            <button onClick={() => handleNavigate('profile')} className={currentPage === 'profile' ? 'active' : ''}>
              الملف الشخصي
            </button>
            <button onClick={handleLogout} className="logout-btn">تسجيل الخروج</button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'messages' && <MessagesPage />}
        {currentPage === 'profile' && <ProfilePage userId={user?.id} />}
      </main>
    </div>
  );
}
