import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, arrayUnion, doc } from "firebase/firestore";
import { db } from "../../src/firebase/configfb";
import { getAuth } from "firebase/auth";
import "./Inbox.css";

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [reply, setReply] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      if (!user) return;
    
      try {
        const querySnapshot = await getDocs(collection(db, "messages"));
    
        const fetchedConversations = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((conv) =>
            Array.isArray(conv.participants) && 
            conv.participants.some((p) => p.id === user.uid) 
          );
    
        setConversations(fetchedConversations);
      } catch (error) {
        console.error("Fel vid hämtning av konversationer:", error);
      }
    };
    

    fetchConversations();
  }, [user]);

  const handleReply = async () => {
    if (!selectedConversation || !reply.trim()) return;

    try {
      const conversationRef = doc(db, "messages", selectedConversation.id);
      const newMessage = {
        message: reply,
        senderId: user.uid,
        senderName: user.displayName || "Okänd",
        timestamp: new Date().toISOString(),
      };

      await updateDoc(conversationRef, {
        messages: arrayUnion(newMessage),
      });

      setReply("");


      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === selectedConversation.id
            ? { ...conv, messages: [...conv.messages, newMessage] }
            : conv
        )
      );

      setSelectedConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
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
          conversations.map((convo) => (
            <div
              key={convo.id}
              className="message-item"
              onClick={() => setSelectedConversation(convo)}
            >
              <p>
                <strong>Konversation med:</strong>{" "}
                {convo.participants
                  .filter((p) => p.id !== user.uid) 
                  .map((p) => p.name || "Okänd användare")
                  .join(", ")}
              </p>
              <p>
                <small>
                  Senaste meddelandet:{" "}
                  {convo.messages && convo.messages.length > 0
                    ? convo.messages[convo.messages.length - 1].message
                    : "Inga meddelanden"}
                </small>
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
            {selectedConversation.messages &&
              selectedConversation.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-bubble ${
                    msg.senderId === user.uid ? "sent" : "received"
                  }`}
                >
                  <p>
                    <strong>{msg.senderName || "Okänd användare"}:</strong> {msg.message}
                  </p>
                  <p>
                    <small>
                      {new Date(msg.timestamp).toLocaleString("sv-SE")}
                    </small>
                  </p>
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
