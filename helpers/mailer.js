const { createTransport, createTestAccount } = require("nodemailer");

// TODO styled html message
exports.send = async (from, to, subject, html) => {
  let transporter = createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: process.env.EMAIL_SMPT_PORT,
    secure: process.env.EMAIIL_SMPT_SECURE,
    auth: {
      type: "login",
      user: process.env.EMAIL_SMTP_USERNAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail(
    {
      from,
      to,
      subject,
      html,
    },
    (err, info) => {
      if (err) {
        throw new Error(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
};

/*

ENABLING THIS TO WORK

STEP 1 -> ON GOOGLE ACCOUNT ENABLE 2-FACTOR AUTHENTICATION
STEP 2 -> ENABLE APP PASSWORD AND COPY THE CODE TO USE AS AUTH PASSWORD
STEP 3 -> CONFIGURE CODE LIKE ABOVE


*/
