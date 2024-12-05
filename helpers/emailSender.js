import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


export const sendEmail = async (to, code) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: "Email Confirmation",
        text: `Your confirmation code is ${code}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent");
    } catch (error) {
        console.log(error);
    }

}
export const sendEmailResetPassword = async (to, code) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: "Email Confirmation",
        text: `Your confirmation code to reset password is ${code}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent");
    } catch (error) {
        console.log(error);
    }

}