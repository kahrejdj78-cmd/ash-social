import { useState } from 'react';
import '../styles/LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate authentication
      const token = btoa(`${email}:${password}`);
      localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
      onLogin(token);
    } catch (error) {
      console.error('Auth error:', error);
      alert('حدث خطأ في المصادقة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">ASH SOCIAL</h1>
          <p className="login-subtitle">تطبيق التواصل الاجتماعي</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                required
              />
            </div>

            <div className="form-group">
              <label>كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'جاري الدخول...' : isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isSignUp ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="toggle-btn"
              >
                {isSignUp ? 'تسجيل الدخول' : 'إنشاء حساب'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
