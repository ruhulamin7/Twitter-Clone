// dependencies
const createError = require('http-errors');
const nodeMailer = require('nodemailer');

// send email function
const sendEmail = (receivers, data, callback) => {
  try {
    // create transporter
    const transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // options
    const options = {
      from: process.env.SMTP_MAIL,
      to: receivers.join(','),
      subject: data.subject,
      html: data.template,
      attachments: data.attachments,
    };
    // sending email
    transporter.sendMail(options, callback);
  } catch (error) {
    next(createError(500, 'Internal Server Error'));
  }
};

// export
module.exports = sendEmail;
