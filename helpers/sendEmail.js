import nodemailer from "nodemailer";
import "dotenv/config";

const { UKR_NET_PASSWORD, UKR_NET_FROM } = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
        user: UKR_NET_FROM,
        pass: UKR_NET_PASSWORD,
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

/*
const data = {    
    to: "yipem62170@wentcity.com",
    subject: "Test email",
    html: "<strong>Test email</strong>"
};
*/

const sendEmail = data => {
    const email = { ...data, from: UKR_NET_FROM };
    return transport.sendMail(email);
}

/*
transport.sendMail(email)
    .then(() => console.log("Email send success"))
    .catch(error => console.log(error.message));
*/

export default sendEmail;
