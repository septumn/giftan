import nodemailer from "nodemailer"

export async function sendVerificationEmail(email: string, confirmLink: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })

  await transporter.sendMail({
    to: email,
    subject: "Подтверждение входа",
    html: `
    <div style="background-color: #f9f9f9; padding: 50px 20px; font-family: sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <tr>
          <td style="padding: 40px 30px; text-align: center;">
            <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Подтвердите ваш Email</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
              Здравствуйте! Чтобы активировать ваш аккаунт, пожалуйста, нажмите на кнопку ниже:
            </p>
            
            <!-- Кнопка -->
            <a href="${confirmLink}" 
               style="background-color: #4CAF50; 
                      color: white; 
                      padding: 14px 28px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      font-weight: bold; 
                      display: inline-block;
                      font-size: 16px;">
               Подтвердить почту
            </a>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
            </p>
          </td>
        </tr>
      </table>
    </div>
  `
  })
}