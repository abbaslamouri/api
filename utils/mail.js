const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
  var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: 'WEB SITE <abbaslamouri@yrlus.com',
    to: options.to,
    subject: options.subject,
    text: options.text,
    // html:
  }

  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
