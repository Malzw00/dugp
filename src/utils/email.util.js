const ServiceErrorLogger = require("@root/src/utils/serviceErrorLogger.util");
const nodemailer = require('nodemailer')

class EmailService {
    
    static logger = new ServiceErrorLogger({ module: 'Service' });

    static #transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS, 
        },
    });

    static async send ({ to, subject, text, html }) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,              // المستلم
            subject,         // عنوان الرسالة
            text,            // النص العادي
            html,            // النص المنسق (اختياري)
        };

        const info = await this.#transporter.sendMail(mailOptions);
        return info;      
    }
}


module.exports = EmailService;