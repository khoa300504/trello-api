const brevo = require('@getbrevo/brevo')
import { env } from '~/config/environment'

let apiInstance = new brevo.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (receipientEmail, customSubject, customhtmlContent) => {
  //Initial sendSmtpEmail
  let sendSmtpEmail = new brevo.SendSmtpEmail()

  //tai khoan gui mail (brevo email account)
  sendSmtpEmail.sender = { name: env.ADMIN_EMAIL_NAME, email: env.ADMIN_EMAIL_ADDRESS }

  //nhung tai khoan nhan email
  sendSmtpEmail.to = [{ email: receipientEmail }]

  //Tieu de email
  sendSmtpEmail.subject = customSubject

  //Noi dung email (HTML FORM)
  sendSmtpEmail.htmlContent = customhtmlContent
  //Send Email =>>>>>
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}
