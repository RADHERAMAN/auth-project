import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendVerificationEmail = async (email, token) => {
    const verifcationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "verify your email",
        html: `
        <h2>welcome!</h2>
        
        <p> Please verify your email by clicking the link below: </p>
        
        <a href=${verificationUrl}>
        verify Email
        </a>
        
        <p> This link is for email verificaton. </p>
        `,
    });
};

export { sendVerificationEmail };