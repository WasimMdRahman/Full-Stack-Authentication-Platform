const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Testing email config...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'MISSING');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.error('\n❌ EMAIL CONNECTION FAILED:');
        console.error(error.message);
    } else {
        console.log('\n✅ Email connection is working!');
        console.log('Sending test email...');

        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself as a test
            subject: '✅ Test Email from Violet Auth Platform',
            html: `<h1 style="color: #8b5cf6;">It works! 🎉</h1><p>Your email configuration is working correctly.</p>`
        }, (err, info) => {
            if (err) {
                console.error('❌ Send failed:', err.message);
            } else {
                console.log('✅ Test email sent! Check your inbox:', process.env.EMAIL_USER);
            }
        });
    }
});
