import { useState, useEffect } from 'react';
import { Router, Route } from 'wouter';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import './App.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setToken(null);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  if (!token) {
    return <LoginPage onLogin={(newToken) => {
      setToken(newToken);
      localStorage.setItem('token', newToken);
    }} />;
  }

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-container">
            <h1 className="logo">ASH SOCIAL</h1>
            <div className="nav-links">
              <a href="/">الرئيسية</a>
              <a href="/messages">الرسائل</a>
              <a href={`/profile/${user?.id}`}>الملف الشخصي</a>
              <button onClick={handleLogout} className="logout-btn">تسجيل الخروج</button>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Route path="/" component={HomePage} />
          <Route path="/messages" component={MessagesPage} />
          <Route path="/profile/:id" component={ProfilePage} />
        </main>
      </div>
    </Router>
  );
}
