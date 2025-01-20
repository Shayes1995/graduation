import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, arrayUnion, doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/firebase/configfb';
import { getAuth } from 'firebase/auth';
import './Inbox.css';

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [reply, setReply] = useState("");
  const [userNames, setUserNames] = useState({}); 
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const q = query(collection(db, 'messages'), where('participants', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);

        const fetchedConversations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setConversations(fetchedConversations);


        const allParticipants = [
          ...new Set(fetchedConversations.flatMap(conv => conv.participants))
        ];
        fetchUserNames(allParticipants);
      } catch (error) {
        console.error("Fel vid hämtning av konversationer:", error);
      }
    };

    fetchConversations();
  }, [user]);


  const fetchUserNames = async (uids) => {
    const newUserNames = { ...userNames };

    for (const uid of uids) {
      if (!uid || newUserNames[uid]) continue; 

      let userRef = doc(db, 'users', uid); 
      let userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        userRef = doc(db, 'admins', uid); 
        userSnap = await getDoc(userRef);
      }

      if (userSnap.exists()) {
        const userData = userSnap.data();
        newUserNames[uid] = userData.firstName || "Okänd användare";
      } else {
        newUserNames[uid] = uid; 
      }
    }

    setUserNames(newUserNames);
  };

  const handleReply = async () => {
    if (!selectedConversation || !reply.trim()) return;

    try {
      const conversationRef = doc(db, 'messages', selectedConversation.id);
      const newMessage = {
        message: reply,
        senderId: user.uid,
        receiverId: selectedConversation.participants.find(p => p !== user.uid),
        timestamp: new Date()
      };

      await updateDoc(conversationRef, {
        messages: arrayUnion(newMessage)
      });

      setReply("");

  
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === selectedConversation.id
            ? { ...conv, messages: [...conv.messages, newMessage] }
            : conv
        )
      );

    
      setSelectedConversation(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));
    } catch (error) {
      console.error("Fel vid svar:", error);
      alert("Fel vid svar. Försök igen.");
    }
  };

  return (
    <div className="inbox-container">
      <h2>Inbox</h2>
      <div className="messages-list">
        {conversations.length > 0 ? (
          conversations.map(convo => (
            <div
              key={convo.id}
              className="message-item"
              onClick={() => setSelectedConversation(convo)}
            >
              <p>
                <strong>Konversation med:</strong>{" "}
                {convo.participants
                  .filter(p => p !== user.uid)
                  .map(uid => userNames[uid] || uid)
                  .join(", ")}
              </p>
              <p>
                <small>Senaste meddelandet: {convo.messages.length > 0 ? convo.messages[convo.messages.length - 1].message : "Inga meddelanden"}</small>
              </p>
            </div>
          ))
        ) : (
          <p>Inga konversationer hittades.</p>
        )}
      </div>

      {selectedConversation && (
        <div className="message-details">
          <h3>Konversation</h3>
          <div className="chat-history">
            {selectedConversation.messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.senderId === user.uid ? 'sent' : 'received'}`}>
                <p><strong>{userNames[msg.senderId] || msg.senderId}:</strong> {msg.message}</p>
                <p><small>{new Date(msg.timestamp?.seconds * 1000).toLocaleString()}</small></p>
              </div>
            ))}
          </div>

          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Skriv ditt svar här..."
          />
          <button onClick={handleReply} className="btn btn-primary">
            Svara
          </button>
        </div>
      )}
    </div>
  );
};

export default Inbox;
