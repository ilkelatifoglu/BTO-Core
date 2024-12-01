// utils/email.js

const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Email configuration is missing");
    }

    const transporter = createTransporter();

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"BTO Core" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

// **Add the sendConfirmationEmail function**
const sendConfirmationEmail = async (toEmail, { teacher_name, tour_date, school_name, time_preferences }) => {
  const subject = "Your Tour Application Has Been Received";

  // Construct the HTML content of the email
  const html = `
    <p>Dear ${teacher_name},</p>
    <p>Thank you for submitting a tour application to <strong>Bilkent University</strong> through our platform.</p>
    <p>We understand that you, representing <strong>${school_name}</strong>, have requested a tour on <strong>${new Date(tour_date).toLocaleDateString('tr-TR')}</strong>.</p>
    <p>Your preferred time(s) which are: ${time_preferences.join(', ')} have been noted.</p> 
    <p>We sincerely appreciate your interest and will carefully review your application. Rest assured, we will promptly initiate the necessary processes to accommodate your request and provide you with further details as soon as possible.</p>
    <p>Best regards,<br/><strong>Bilkent Information Office Team</strong></p>
  `;

  // Call sendEmail to send the confirmation email
  await sendEmail({
    to: toEmail,
    subject,
    html,
  });
};

module.exports = {
  sendEmail,
  sendConfirmationEmail, // Export the new function
};
