// Email Configuration - Brevo SMTP (formerly Sendinblue)
// File name kept as resend.js to avoid changes in other files
const nodemailer = require('nodemailer');

// Create Brevo SMTP transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.BREVO_SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });
};

// Email template with AAGAAZ branding colors
const getRegistrationEmailHTML = (data) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmed - AAGAAZ 2026</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #0d0d1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.05); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #e94560 0%, #ff6b35 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #fff; font-size: 28px; font-weight: 700; letter-spacing: 2px;">
                🏆 AAGAAZ 2026
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                The Arena Calls
              </p>
            </td>
          </tr>
          
          <!-- Success Badge -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; padding: 12px 24px; border-radius: 50px; font-size: 16px; font-weight: 600;">
                ✓ Registration Confirmed
              </div>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 20px 30px;">
              <h2 style="margin: 0 0 15px; color: #fff; font-size: 22px; text-align: center;">
                Hello, ${data.name}! 🎉
              </h2>
              <p style="margin: 0 0 25px; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.6; text-align: center;">
                Your registration for <strong style="color: #ff6b35;">${data.sportName}</strong> has been confirmed. Welcome to the arena!
              </p>
            </td>
          </tr>
          
          <!-- Registration Details Card -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.08); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #ff6b35; font-size: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                      📋 Registration Details
                    </h3>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: rgba(255,255,255,0.6); font-size: 14px; width: 40%;">Registration ID</td>
                        <td style="color: #fff; font-size: 14px; font-weight: 600;">${data.registrationId}</td>
                      </tr>
                      <tr>
                        <td style="color: rgba(255,255,255,0.6); font-size: 14px;">Sport</td>
                        <td style="color: #fff; font-size: 14px;">${data.sportName}</td>
                      </tr>
                      <tr>
                        <td style="color: rgba(255,255,255,0.6); font-size: 14px;">Category</td>
                        <td style="color: #fff; font-size: 14px;">${data.sportType}</td>
                      </tr>
                      ${data.teamName ? `
                      <tr>
                        <td style="color: rgba(255,255,255,0.6); font-size: 14px;">Team Name</td>
                        <td style="color: #fff; font-size: 14px;">${data.teamName}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="color: rgba(255,255,255,0.6); font-size: 14px;">University</td>
                        <td style="color: #fff; font-size: 14px;">${data.universityName}</td>
                      </tr>
                      <tr>
                        <td style="color: rgba(255,255,255,0.6); font-size: 14px;">Amount Paid</td>
                        <td style="color: #10b981; font-size: 14px; font-weight: 600;">₹${data.amount}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Event Info -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background: linear-gradient(135deg, #e94560 0%, #ff6b35 100%); border-radius: 12px; padding: 20px; text-align: center;">
                <p style="margin: 0 0 5px; color: #fff; font-size: 14px; opacity: 0.9;">Event Dates</p>
                <h3 style="margin: 0; color: #fff; font-size: 20px; font-weight: 700;">
                  31st Jan, 1st Feb & 2nd Feb 2026
                </h3>
              </div>
            </td>
          </tr>
          
          <!-- Important Note -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background: rgba(233, 69, 96, 0.1); border: 1px solid rgba(233, 69, 96, 0.3); border-radius: 8px; padding: 15px;">
                <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 13px; line-height: 1.5;">
                  <strong style="color: #ff6b35;">📌 Important:</strong> Please carry a valid ID proof and this email confirmation on the event day. Reach the venue 30 minutes before your scheduled event.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: rgba(0,0,0,0.3); padding: 25px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0 0 10px; color: rgba(255,255,255,0.5); font-size: 13px;">
                © 2026 AAGAAZ - University of Lucknow
              </p>
              <p style="margin: 0; color: rgba(255,255,255,0.4); font-size: 12px;">
                Play, Progress, Prosper
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Send registration confirmation email via Brevo SMTP
const sendRegistrationEmail = async (data) => {
  try {
    console.log('=== EMAIL FUNCTION CALLED ===');
    console.log('BREVO_SMTP_USER:', process.env.BREVO_SMTP_USER);
    console.log('BREVO_FROM_EMAIL:', process.env.BREVO_FROM_EMAIL);

    const transporter = createTransporter();

    const fromEmail = process.env.BREVO_FROM_EMAIL;
    const fromName = process.env.BREVO_FROM_NAME;

    const mailOptions = {
      from: `${fromName} <${fromEmail}>`,
      to: data.email,
      subject: `Registration Confirmed - ${data.sportName} | AAGAAZ 2026`,
      html: getRegistrationEmailHTML(data),
    };

    console.log('Sending email to:', data.email);
    console.log('From:', mailOptions.from);

    const result = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, id: result.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    console.error('Full error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendRegistrationEmail };
