import React, { useState } from 'react';
import axios from 'axios';
import './Candidate.css';

const EmailModal = ({ candidate, onClose }) => {
  const [message, setMessage] = useState('');

  const handleSendEmail = async () => {
    try {
      const response = await axios.post('http://localhost:5000/send-email', {
        to_email: candidate.email,
        to_name: `${candidate.firstName} ${candidate.lastName}`,
        message,
      });
      alert(response.data.message);
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    }
  };

  return (
    <div className="email-modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Send Email to {candidate.firstName} {candidate.lastName}</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          rows="5"
        />
        <button onClick={handleSendEmail} className="btn btn-primary">Send Email</button>
        <button onClick={onClose} className="btn btn-secondary">Close</button>
      </div>
    </div>
  );
};

export default EmailModal;