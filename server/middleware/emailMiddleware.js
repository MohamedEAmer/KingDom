import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
});

const siteUrl = process.env.BASE_URL || "http://localhost:5173";

const MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "KingDom Of Secrets Asda2",
        link: siteUrl
    }
});

export const sendActivationEmail = async (userEmail, username, activationToken) => {
    const activationLink = `${siteUrl}/activate-account/${activationToken}`;

    const email = {
        body: {
            name: username,
            intro: "Welcome to KingDom Of Secrets Asda2! Please activate your account.",
            action: {
                instructions: "Click the button below to activate your account:",
                button: {
                    color: "#22BC66",
                    text: "Activate Account",
                    link: activationLink
                }
            },
            outro: "If you didn’t create this account, you can safely ignore this email."
        }
    };

    const emailBody = MailGenerator.generate(email);

    const message = {
        from: `"Asda2-EvoL Game" <${process.env.EMAIL}>`,
        to: userEmail,
        subject: "Activate your Asda2 Game account",
        html: emailBody
    };

    try {
        await transporter.sendMail(message);
    } catch (err) {
        console.error("Email send failed:", err);
    }
};
