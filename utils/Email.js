const sgMail = require('@sendgrid/mail')
const colors = require('colors')

class Email {
  constructor(data) {
    this.to = data.email
    this.firstname = data.name.split(' ')[0]
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
    await this.send(process.env.SENDGRID_SIGNUP_TEMPLATE_ID)
  }

  async sendOrderProcessing() {
    await this.send(process.env.SENDGRID_ORDER_TEMPLATE_ID)
  }

  async sendResetPassword() {
    await this.send(process.env.SENDGRID_PASSWORD_RESET_TEMPLATE_ID)
  }
}

module.exports = Email

// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//         const msg = {
//           to: {
//             email: order.shippingAddress.email,
//             name: order.shippingAddress.name,
//           },

//           from: {
//             email: 'support@yrlus.com',
//             name: 'YRL Consulting',
//           },
//           replyTo: {
//             email: 'support@yrlus.com',
//             name: 'Abbas Lamouri',
//           },
//           subject: 'Thank you for your order',
//           template_id: process.env.ORDER_TEMPLATE_ID,
//           dynamic_template_data: {
//             retailer: 'YRL Consulting',
//             items: order.items,
//           },
//         }

//         console.log('SEND', await sgMail.send(msg))
