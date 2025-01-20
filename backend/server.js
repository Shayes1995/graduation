import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email endpoint
app.post('/send-email', async (req, res) => {
  const { to_email, to_name, message } = req.body;

  console.log('Request body:', req.body); // Log the request body

  if (!to_email || !to_name || !message) {
    console.log('Missing required fields:', { to_email, to_name, message });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to_email,
    subject: `Message from ${to_name}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});