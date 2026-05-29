import { useState } from 'react';
import { Send } from 'lucide-react';
import '../styles/MessagesPage.css';

export default function MessagesPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'أحمد', content: 'مرحباً!', time: '10:30' },
    { id: 2, sender: 'أنت', content: 'مرحباً بك!', time: '10:31' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: 'أنت',
        content: newMessage,
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewMessage('');
  };

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-item ${msg.sender === 'أنت' ? 'sent' : 'received'}`}>
              <p>{msg.content}</p>
              <small>{msg.time}</small>
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
          <button type="submit" disabled={!newMessage.trim()}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
