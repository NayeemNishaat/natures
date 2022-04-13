const nodemailer = require("nodemailer");
const pug = require("pug");
const { htmlToText } = require("html-to-text");

// new Email(user, url).sendWelcome();

module.exports = class Email {
    constructor(user, url) {
        // Remark: Setting properties to the object that is going to be created from this class
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.url = url;
        this.from = `Nayeem <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === "production") {
            // SendGrid
            return 1;
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // Important: All of these methods are goin to be defined on the object creted from this class and the object is accessible by "this"!
    async send(template, subject) {
        // Part: Render HTML based on a pug template Important: Warning: To debug and get error message use try/catch block!
        const html = pug.renderFile(
            `${__dirname}/../views/emails/${template}.pug`, // Note: __dirname is the location of the directory of currently running script which is "lib"!
            {
                firstName: this.firstName,
                url: this.url,
                subject
            }
        );

        // Part: Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html) // Warning: Required for high email delivery rate and escaping from spam filters.
        };

        // Part: Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send("welcome", "Welcome to the Natours Family!");
    }

    async sendPasswordReset() {
        await this.send(
            "passwordReset",
            "Your password reset token (valid for 10 minutes)."
        );
    }
};

/* const sendEmail = async (options) => {
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
 */
