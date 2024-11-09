import nodemailer from "nodemailer" 

const SendEmail = async(to,subject,html) =>{
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth: {
          user: process.env.emailSender,
          pass: process.env.emailPassword,
        },
      });

    const info = await transporter.sendMail({
          from: `${process.env.emailSender}`, // sender address
          to ,
          subject,
          html
     });
         
}
export default SendEmail   
    