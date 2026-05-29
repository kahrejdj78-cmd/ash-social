import { useState } from 'react';
import { Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { auth, database } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';
import '../styles/LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('email');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    name: '',
    verificationCode: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const email = loginType === 'email' ? form.email : form.phone;
      const userCredential = await signInWithEmailAndPassword(auth, email, form.password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userCredential.user.uid);
      onLogin(token);
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      const email = loginType === 'email' ? form.email : form.phone;
      const userCredential = await createUserWithEmailAndPassword(auth, email, form.password);
      
      // Save user data to Firebase Realtime Database
      await set(ref(database, 'users/' + userCredential.user.uid), {
        id: userCredential.user.uid,
        email: form.email || null,
        phone: form.phone || null,
        name: form.name,
        avatar: null,
        bio: null,
        followers: 0,
        following: 0,
        createdAt: new Date().toISOString(),
      });

      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userCredential.user.uid);
      onLogin(token);
    } catch (err) {
      setError(err.message || 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="logo">ASH SOCIAL</h1>
        <p className="subtitle">مرحباً بعودتك</p>

        {!isForgotPassword ? (
          <>
            <div className="toggle-buttons">
              <button
                className={`toggle-btn ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                تسجيل الدخول
              </button>
              <button
                className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                إنشاء حساب
              </button>
            </div>

            <div className="login-type-toggle">
              <button
                className={`type-btn ${loginType === 'email' ? 'active' : ''}`}
                onClick={() => setLoginType('email')}
              >
                <Mail size={16} /> البريد
              </button>
              <button
                className={`type-btn ${loginType === 'phone' ? 'active' : ''}`}
                onClick={() => setLoginType('phone')}
              >
                <Phone size={16} /> الهاتف
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={isLogin ? handleLogin : handleSignup}>
              {!isLogin && (
                <div className="form-group">
                  <label>الاسم الكامل</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="أدخل اسمك الكامل"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>{loginType === 'email' ? 'البريد الإلكتروني' : 'رقم الهاتف'}</label>
                <input
                  type={loginType === 'email' ? 'email' : 'tel'}
                  name={loginType}
                  placeholder={loginType === 'email' ? 'your@email.com' : '+966501234567'}
                  value={form[loginType]}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>كلمة المرور</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="أدخل كلمة المرور"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label>تأكيد كلمة المرور</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="أعد إدخال كلمة المرور"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'جاري المعالجة...' : isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
              </button>
            </form>

            {isLogin && (
              <button
                className="forgot-password-btn"
                onClick={() => setIsForgotPassword(true)}
              >
                هل نسيت كلمة المرور؟
              </button>
            )}
          </>
        ) : (
          <>
            {!isVerifying ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                setIsVerifying(true);
              }}>
                <p className="forgot-text">
                  أدخل {loginType === 'email' ? 'بريدك الإلكتروني' : 'رقم هاتفك'} وسنرسل لك كود التحقق
                </p>

                <div className="form-group">
                  <label>{loginType === 'email' ? 'البريد الإلكتروني' : 'رقم الهاتف'}</label>
                  <input
                    type={loginType === 'email' ? 'email' : 'tel'}
                    name={loginType}
                    placeholder={loginType === 'email' ? 'your@email.com' : '+966501234567'}
                    value={form[loginType]}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  إرسال الكود
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                setIsForgotPassword(false);
                setIsVerifying(false);
              }}>
                <p className="forgot-text">
                  تحقق من {loginType === 'email' ? 'بريدك الإلكتروني' : 'رسائلك النصية'} وأدخل الكود
                </p>

                <div className="form-group">
                  <label>كود التحقق</label>
                  <input
                    type="text"
                    name="verificationCode"
                    placeholder="أدخل الكود المكون من 6 أرقام"
                    value={form.verificationCode}
                    onChange={handleChange}
                    maxLength="6"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>كلمة المرور الجديدة</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="أدخل كلمة المرور الجديدة"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>تأكيد كلمة المرور</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="أعد إدخال كلمة المرور"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  تحديث كلمة المرور
                </button>
              </form>
            )}

            <button
              className="back-btn"
              onClick={() => {
                setIsForgotPassword(false);
                setIsVerifying(false);
              }}
            >
              العودة إلى تسجيل الدخول
            </button>
          </>
        )}
      </div>
    </div>
  );
}
