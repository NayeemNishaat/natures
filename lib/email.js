const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // Point: Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Point: Define the email options
    const mailOptions = {
        from: "Nayeem <kazimdyeakubali@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
        // html:"<p>This is html!</p>"
    };

    // Point: Finally send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
