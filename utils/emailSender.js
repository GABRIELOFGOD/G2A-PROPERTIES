var nodemailer = require('nodemailer');
const caseCodeEmailSender = (email, name, link) => {

  let mess = 
  `<div style="background: white; width: 100vw; height: 100vh; padding: 10px;">
    <h1 style="color: black;">Hello ${name}</h1>
    <p>You requested for a change of password, click on the button below to</p>
    <div style="width: 100%; display: flex; justify-content: center;">
      <button style="padding: 10px 20px; border: none; color: white; outline: none; background: orange; border-radius: 5px; font-weight: bold; cursor: pointer; "><a href="${link}" style="text-decoration: none; color: inherit;">CHANGE PASSWORD</a></button>
    </div>
    <p>Note that this request will expire in 5 minutes time, kindly change your password with the button above</p>
    <p>Kindly ignore this message if this request is not made by you. </p>
  </div>
  <small>&copy; G2A PROPERTIES</small>
  `

  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'aletechglobal@gmail.com',
          pass: process.env.GOOGLE_EMAIL_AUTH
      }
      });

      var mailOptions = {
      from: 'aletechglobal@gmail.com',
      to: email,
      subject: 'Case Code from Safernet',
      html: mess
      };

      transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
  });

}

module.exports = { caseCodeEmailSender }