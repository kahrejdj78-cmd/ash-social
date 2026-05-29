# ASH SOCIAL - تطبيق التواصل الاجتماعي

تطبيق تواصل اجتماعي حديث مع نظام مصادقة مخصص بدون Manus OAuth.

## ✨ الميزات

- ✅ نظام تسجيل دخول بـ البريد الإلكتروني أو رقم الهاتف
- ✅ كلمات مرور آمنة مع bcryptjs
- ✅ نسيان كلمة المرور مع كود التحقق
- ✅ إنشاء المنشورات
- ✅ الإعجابات والتعليقات
- ✅ الرسائل المباشرة
- ✅ ملفات شخصية للمستخدمين
- ✅ واجهة عربية كاملة

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+
- npm أو yarn

### التثبيت

```bash
cd /home/ubuntu/ash-social-app
npm install
```

### البناء

```bash
npm run build
```

### التشغيل

```bash
npm run dev
```

سيبدأ الخادم على `http://localhost:3000`

## 📁 هيكل المشروع

```
ash-social-app/
├── server.js              # خادم Express الرئيسي
├── src/
│   ├── main.jsx          # نقطة الدخول للتطبيق
│   ├── App.jsx           # المكون الرئيسي
│   ├── index.css         # الأنماط العامة
│   ├── pages/            # صفحات التطبيق
│   │   ├── LoginPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── MessagesPage.jsx
│   └── styles/           # ملفات CSS للصفحات
├── dist/                 # الملفات المبنية
├── package.json
├── vite.config.js
└── index.html
```

## 🔐 نظام المصادقة

### تسجيل دخول جديد
```
POST /api/auth/register
{
  "email": "user@example.com",
  "phone": "+966501234567",
  "password": "password123",
  "name": "اسم المستخدم"
}
```

### تسجيل الدخول
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### نسيان كلمة المرور
```
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}
```

### تحديث كلمة المرور
```
POST /api/auth/reset-password
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "newpassword123"
}
```

## 📱 واجهة المستخدم

### الصفحة الرئيسية
- عرض المنشورات
- إنشاء منشورات جديدة
- الإعجاب بالمنشورات
- التعليق على المنشورات

### الملف الشخصي
- عرض معلومات المستخدم
- عدد المتابعين والمتابعة
- المنشورات الخاصة بالمستخدم

### الرسائل
- عرض الرسائل
- إرسال رسائل جديدة

## 🛠️ التطوير

### إضافة ميزة جديدة

1. أضف API endpoint في `server.js`
2. أنشئ مكون React جديد في `src/pages/`
3. أضف أنماط CSS في `src/styles/`
4. أضف المسار في `src/App.jsx`

### الاختبار

```bash
# اختبر API
curl http://localhost:3000/api/posts

# اختبر المصادقة
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

## 📦 التكنولوجيا المستخدمة

- **Backend**: Express.js
- **Frontend**: React 18 + Vite
- **Styling**: CSS3
- **Authentication**: JWT + bcryptjs
- **Database**: In-memory (يمكن استبدالها بـ MySQL)
- **UI Components**: Lucide React

## ⚠️ ملاحظات مهمة

- التطبيق يستخدم قاعدة بيانات في الذاكرة (In-memory)
- في الإنتاج، استبدل بـ MySQL أو قاعدة بيانات أخرى
- غير `JWT_SECRET` في الإنتاج
- أضف HTTPS في الإنتاج

## 📝 الترخيص

MIT

## 👨‍💻 المطور

تم بناء هذا التطبيق بدون Manus OAuth - نظام مصادقة مخصص بالكامل.

---

**لا توجد آثار Manus في هذا التطبيق ✅**
