import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { database } from '../firebase';
import { ref, push, set, get, child } from 'firebase/database';
import '../styles/MessagesPage.css';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const messagesRef = ref(database, 'messages');
      const snapshot = await get(messagesRef);
      if (snapshot.exists()) {
        const messagesData = [];
        snapshot.forEach((child) => {
          const msg = child.val();
          if (msg.senderId === userId || msg.recipientId === userId) {
            messagesData.push({ id: child.key, ...msg });
          }
        });
        setMessages(messagesData.reverse());
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const newMessageRef = push(ref(database, 'messages'));
      await set(newMessageRef, {
        senderId: userId,
        recipientId: '1',
        content: newMessage,
        createdAt: new Date().toISOString(),
      });

      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg.id} className="message-item">
              <p>{msg.content}</p>
              <small>{new Date(msg.createdAt).toLocaleTimeString('ar-SA')}</small>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            placeholder="اكتب رسالة..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
