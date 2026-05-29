import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// In-memory database (replace with MySQL in production)
const users = new Map();
const posts = new Map();
const messages = new Map();
let userId = 1;
let postId = 1;
let messageId = 1;

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, phone, password, name } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Name required' });
    }

    // Check if user exists
    for (const user of users.values()) {
      if (user.email === email || user.phone === phone) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    const passwordHash = await bcryptjs.hash(password, 10);
    const newUser = {
      id: userId++,
      email,
      phone,
      name,
      passwordHash,
      avatar: null,
      bio: null,
      followers: 0,
      following: 0,
      createdAt: new Date(),
    };

    users.set(newUser.id, newUser);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1y' });

    res.json({
      success: true,
      token,
      user: { ...newUser, passwordHash: undefined },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone required' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    let user = null;
    for (const u of users.values()) {
      if ((email && u.email === email) || (phone && u.phone === phone)) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcryptjs.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1y' });

    res.json({
      success: true,
      token,
      user: { ...user, passwordHash: undefined },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone required' });
    }

    let user = null;
    for (const u of users.values()) {
      if ((email && u.email === email) || (phone && u.phone === phone)) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.json({ success: true, message: 'If account exists, code sent' });
    }

    const code = Math.random().toString().slice(2, 8);
    console.log(`Reset code for ${email || phone}: ${code}`);

    res.json({
      success: true,
      message: 'Code sent',
      code: process.env.NODE_ENV === 'development' ? code : undefined,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, phone, newPassword } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone required' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    let user = null;
    for (const u of users.values()) {
      if ((email && u.email === email) || (phone && u.phone === phone)) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    user.passwordHash = await bcryptjs.hash(newPassword, 10);
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Posts Routes
app.get('/api/posts', (req, res) => {
  const postList = Array.from(posts.values()).reverse();
  res.json(postList);
});

app.post('/api/posts', verifyToken, (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    const user = users.get(req.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const newPost = {
      id: postId++,
      userId: req.userId,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      imageUrl,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      createdAt: new Date(),
    };

    posts.set(newPost.id, newPost);
    res.json(newPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.post('/api/posts/:id/like', verifyToken, (req, res) => {
  const post = posts.get(parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  post.likes++;
  res.json(post);
});

// Messages Routes
app.get('/api/messages', verifyToken, (req, res) => {
  const userMessages = Array.from(messages.values())
    .filter(m => m.senderId === req.userId || m.recipientId === req.userId)
    .reverse();
  res.json(userMessages);
});

app.post('/api/messages', verifyToken, (req, res) => {
  try {
    const { recipientId, content } = req.body;

    const newMessage = {
      id: messageId++,
      senderId: req.userId,
      recipientId,
      content,
      createdAt: new Date(),
    };

    messages.set(newMessage.id, newMessage);
    res.json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// User Routes
app.get('/api/users/:id', (req, res) => {
  const user = users.get(parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ ...user, passwordHash: undefined });
});

app.get('/api/auth/me', verifyToken, (req, res) => {
  const user = users.get(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ ...user, passwordHash: undefined });
});

// Serve React app
app.use((req, res) => {
  res.sendFile(new URL('./dist/index.html', import.meta.url).pathname);
});

app.listen(PORT, () => {
  console.log(`🚀 ASH SOCIAL Server running on http://localhost:${PORT}`);
  console.log('✅ No Manus, No OAuth - Pure Custom Auth');
});
