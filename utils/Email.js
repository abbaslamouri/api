const sgMail = require('@sendgrid/mail')
const colors = require('colors')

class Email {
  constructor(data) {
    this.to = data.user.email
    this.firstname = data.user.name.split(' ')[0]
    this.url = data.url
    this.subject = data.emailSubject
    this.data = data
  }

  async send(templateId) {
    console.log('SPREAD', { ...this.data, firstname: this.firstname })
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
      to: {
        email: this.to,
        name: this.firsname,
      },

      from: {
        email: process.env.FROM_EMAIL,
        name: process.env.FROM_NAME,
      },
      replyTo: {
        email: process.env.FROM_EMAIL,
        name: process.env.FROM_NAME,
      },
      subject: this.subject,
      template_id: templateId,
      dynamic_template_data: { ...this.data, firstname: this.firstname, subject: this.subject },
    }

    await sgMail.send(msg)
    console.log(colors.brightGreen.bold('Message sent'))
  }

  async sendCompleteSignup() {
    await this.send(process.env.SIGNUP_TEMPLATE_ID)
  }

  async sendWelcome() {
    await this.send('welcome', `Welcome to ${process.env.FROM_NAME}`)
  }

  async sendResetPassword() {
    await this.send('reset-password', 'Your password reset token (valid for 10 minutes)')
  }
}

module.exports = Email
