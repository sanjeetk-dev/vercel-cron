import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ path: './.env' });

export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cors({ origin: '*', credentials: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Email Route
app.get('/api/email/send', async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Beautiful Email Template
    const emailTemplate = `
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
        <div style="max-width: 600px; background: white; margin: auto; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #6a0dad;">Hello Sanjeet! 🎉</h2>
          <p style="font-size: 16px; color: #555;">This is an automated email sent from your Node.js server.</p>
          <p style="font-size: 14px; color: #777;">We are excited to see your project growing! 🚀 Keep coding and building amazing things.</p>
          <a href="https://yourwebsite.com" 
            style="display: inline-block; padding: 10px 20px; margin-top: 10px; background: #6a0dad; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
            Visit Our Website
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #888;">This is an automated email, please do not reply.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL,
      to: "iamsanjeet1432@gmail.com",
      subject: "🚀 Your Automated Email from Node.js",
      html: emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent successfully!", info });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email", error });
  }
});

// 404 Route
app.get('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Page not found',
  });
});

app.listen(port, () =>
  console.log(`Server is working on Port: ${port} in ${envMode} Mode.`)
);
