const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 5000;
const DB_PATH = path.join(__dirname, 'db.json');

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper to send welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Welcome to our Platform! 🚀',
            html: `
                <div style="font-family: Arial, sans-serif; background: #050505; color: #fff; padding: 40px; border-radius: 10px; border: 1px solid #8b5cf6;">
                    <h1 style="color: #a78bfa;">Welcome, ${userName}! 🎉</h1>
                    <p style="font-size: 16px;">We are thrilled to have you here at <strong>Violet Auth Platform</strong>.</p>
                    <p>Your account is now active and ready to go.</p>
                    <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;">
                    <p style="color: #94a3b8; font-size: 14px;">If you didn't create this account, please ignore this email.</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to: ${userEmail}`);
    } catch (error) {
        console.error('Email Error:', error.message);
    }
};

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database (File-based)
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
}

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const saveDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const db = getDB();

        if (db.users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { name, email, password: hashedPassword, createdAt: new Date() };
        
        db.users.push(newUser);
        saveDB(db);

        // Fire and forget welcome email
        sendWelcomeEmail(email, name);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = getDB();

        const user = db.users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Database (db.json) initialized at ${DB_PATH}`);
});
