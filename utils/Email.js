const path = require('path')
const nodemailer = require('nodemailer')
const pug = require('pug')
const htmlToText = require('html-to-text')
const colors = require('colors')

class Email {
	constructor(user, url) {
		this.to = user.email
		this.firstname = user.name.split(' ')[0]
		this.url = url
		this.from = `${process.env.FROM_NAME}<${process.env.FROM_EMAIL}>`
	}

	emailTransport() {
		if (process.env.NODE_ENV === 'development') {
			return nodemailer.createTransport({
				service: 'Sendgrid',
				auth: {
					user: process.env.SENDGRID_USERNAME,
					pass: process.env.SENDGRID_PASSWORD,
				},
			})
		}

		return nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			auth: {
				user: process.env.SMTP_USERNAME,
				pass: process.env.SMTP_PASSWORD,
			},
		})
	}

	async send(template, subject) {
		const html = pug.renderFile(path.join(__dirname, `../templates/emails/${template}.pug`), {
			firstname: this.firstname,
			url: this.url,
			subject,
		})

		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.fromString(html),
		}

		const info = await this.emailTransport().sendMail(mailOptions)

		console.log(colors.brightGreen.bold('Message sent: %s', info.messageId))
	}

	async sendCompleteSignup() {
		await this.send('complete-signup', 'Please complete your registration within 10 minutes')
	}

	async sendWelcome() {
		await this.send('welcome', `Welcome to ${process.env.FROM_NAME}`)
	}

	async sendPasswordReset() {
		await this.send('password-reset', 'Your password reset token (valid for 10 minutes)')
	}
}

// const sendEmail = async (options) => {
//   var transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     auth: {
//       user: process.env.SMTP_USERNAME,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   })

//   const mailOptions = {
//     from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
//     to: options.to,
//     subject: options.subject,
//     text: options.text,
//     html: options.html,
//   }

//   const info = await transporter.sendMail(mailOptions)

//   console.log(colors.brightGreen.bold('Message sent: %s', info.messageId))
// }

module.exports = Email
