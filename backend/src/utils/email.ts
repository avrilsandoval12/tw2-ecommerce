import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export const transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: parseInt(process.env.EMAIL_PORT || "587") === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<any> => {
    try {
        const mailOptions = {
            from: `"E-commerce App" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email enviado:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Error al enviar email:", error);
        throw error;
    }
};
