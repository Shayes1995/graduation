import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../src/firebase/configfb';
import { getAuth } from 'firebase/auth';
import './Inbox.css';

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;

      const q = query(collection(db, 'messages'), where('receiverId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedMessages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(fetchedMessages);
    };

    fetchMessages();
  }, [user]);

  const handleReply = async () => {
    if (!selectedMessage || !reply.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        senderId: user.uid,
        receiverId: selectedMessage.senderId,
        message: reply,
        timestamp: serverTimestamp(),
      });
      setReply("");
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply. Please try again.');
    }
  };

  return (
    <div className="inbox-container">
      <h2>Inbox</h2>
      <div className="messages-list">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className="message-item"
              onClick={() => setSelectedMessage(msg)}
            >
              <p><strong>From:</strong> {msg.senderId}</p>
              <p>{msg.message}</p>
              <p><small>{new Date(msg.timestamp?.seconds * 1000).toLocaleString()}</small></p>
            </div>
          ))
        ) : (
          <p>No messages found.</p>
        )}
      </div>

      {selectedMessage && (
        <div className="message-details">
          <h3>Message Details</h3>
          <p><strong>From:</strong> {selectedMessage.senderId}</p>
          <p>{selectedMessage.message}</p>
          <p><small>{new Date(selectedMessage.timestamp?.seconds * 1000).toLocaleString()}</small></p>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply here..."
          />
          <button onClick={handleReply} className="btn btn-primary">
            Reply
          </button>
        </div>
      )}
    </div>
  );
};

export default Inbox;