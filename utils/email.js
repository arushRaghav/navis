const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) create transporter
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: '0a8a701485ca71',
            pass: '1cb33c7fbff9ec',
        },
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Arush Raghav <arush@arush.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
