const express = require("express");
const app = express();

const path = require("path");

const nodemailer = require('nodemailer');

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // console.log("Home page accessed");
    res.sendFile(path.join(__dirname, "public", "index.html"));
    console.log("Home page accessed");
    
});
app.get("/about", (req, res) => {
    console.log("About page accessed");
    res.sendFile(path.join(__dirname, "public", "about.html"));
    
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,// true for 465, false for other ports
    // auth: {
    //   type: 'OAuth2',
    //   user: process.env.EMAIL, // Add your email address here
    //   clientId: process.env.CLIENT_ID,
    //   clientSecret: process.env.CLIENT_SECRET,
    //   refreshToken: process.env.REFRESH_TOKEN,
    //   accessToken: process.env.ACCESS_TOKEN,
    // },
    auth: {
      user: 'professionalpavan444@gmail.com', // Add your email address here
      pass: 'pixpgfnoyjqtdqmj', // Add email password or app-specific password
    },
    debug : true, // Enable debug output
    logger : true // Enable logging
  });
app.get("/contact", (req, res) => {
    console.log("Contact page accessed");
    res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.post("/contact-form", (req, res) => {
    const { name, email, message } = req.body;
    const mailOptions = {
        from: 'professionalpavan444@gmail.com',
        to: email,
        subject: `Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).send("Error sending email");
        }
        console.log("Email sent:", info.response);
        console.log("Thank you page sent after form submission");
        res.status(200).sendFile(path.join(__dirname, "public", "thankyou.html"));
        
    });
});
app.get("/services", (req, res) => {
    console.log("Services page accessed");
    res.sendFile(path.join(__dirname, "public", "services.html"));
    
});
app.post("/Service-form", (req, res) => {
    const { service, email, details } = req.body;
    const mailOptions = {
        from: 'professionalpavan444@gmail.com',
        to: email,
        subject: `Service Form Submission`,
        text: `Interested in a Service ? ${service}\n Email: ${email}\n Message: ${details}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).send("Error sending email");
        }
        console.log("Email sent:", info.response);
        console.log("Thank you page sent after service form submission");
        res.status(200).sendFile(path.join(__dirname, "public", "thankyou.html"));
        
    });
});
app.get("/404", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
    console.log("404 page accessed");
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
// module.exports = app; // Export the app for testing or further use 
// // if needed
// if (require.main === module) {
//     app.listen(3000, () => {
//         console.log("Server is running on http://localhost:3000");
//     });
// } else {
//     console.log("Server module loaded, not starting server.");
// }
// // This allows the server to be used in other modules or for testing purposes
// // without starting the server automatically.
// // The server will only start if this file is run directly, not when imported.
