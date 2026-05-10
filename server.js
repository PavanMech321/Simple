require('dotenv').config();
const express = require("express");
const app = express();

const path = require("path");
const nodemailer = require('nodemailer');

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Transporter configuration with environment variables
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter ready to send emails");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
  console.log("Home page accessed");
});

app.get("/about", (req, res) => {
  console.log("About page accessed");
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.get("/contact", (req, res) => {
  console.log("Contact page accessed");
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.post("/contact-form", (req, res) => {
  const { name, email, message } = req.body;

  // Input validation
  if (!name || !email || !message) {
    return res.status(400).send("All fields are required");
  }

  // XSS Prevention: Escape HTML characters
  const escapeHtml = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  };

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER, // Send to YOUR email
    replyTo: email, // User can reply to this email
    subject: `Contact Form Submission from ${escapeHtml(name)}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error sending email:", error);
      return res.status(500).send("Error sending email. Please try again.");
    }
    console.log("✅ Email sent successfully:", info.response);
    res.status(200).sendFile(path.join(__dirname, "public", "thankyou.html"));
  });
});

app.get("/services", (req, res) => {
  console.log("Services page accessed");
  res.sendFile(path.join(__dirname, "public", "services.html"));
});

app.post("/service-form", (req, res) => {
  const { service, email, details } = req.body;

  // Input validation
  if (!service || !email || !details) {
    return res.status(400).send("All fields are required");
  }

  // XSS Prevention: Escape HTML characters
  const escapeHtml = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  };

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER, // Send to YOUR email
    replyTo: email, // User can reply to this email
    subject: `Service Form Submission - ${escapeHtml(service)}`,
    html: `
      <h3>New Service Request</h3>
      <p><strong>Service:</strong> ${escapeHtml(service)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Details:</strong></p>
      <p>${escapeHtml(details).replace(/\n/g, '<br>')}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error sending email:", error);
      return res.status(500).send("Error sending email. Please try again.");
    }
    console.log("✅ Email sent successfully:", info.response);
    res.status(200).sendFile(path.join(__dirname, "public", "thankyou.html"));
  });
});

app.get("/404", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
  console.log("404 page accessed");
});

// 404 fallback for all other routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});