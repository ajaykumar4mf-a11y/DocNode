import nodemailer from 'nodemailer';

/**
 * Creates and returns a Nodemailer transporter.
 * If SMTP credentials are missing, falls back to a development logger
 * so local development and testing never crash or block API responses.
 */
let cachedTransporter = null;

/**
 * Creates or returns a cached singleton Nodemailer transporter with connection pooling.
 * Connection pooling keeps sockets open, dramatically speeding up email delivery
 * by avoiding new TLS and authentication handshakes on every send.
 */
const getTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const { SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT } = process.env;

  if (SMTP_USER && SMTP_PASS) {
    const cleanPass = SMTP_PASS.replace(/\s+/g, '');
    const host = SMTP_HOST || 'smtp.gmail.com';
    const port = Number(SMTP_PORT) || 465;
    const isGmail = host.includes('gmail') || !SMTP_HOST;

    if (isGmail) {
      cachedTransporter = nodemailer.createTransport({
        service: 'gmail',
        pool: true, // Use pooled connections
        maxConnections: 3,
        maxMessages: 100,
        rateDelta: 1000,
        rateLimit: 5,
        auth: {
          user: SMTP_USER,
          pass: cleanPass
        }
      });
      return cachedTransporter;
    }

    cachedTransporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: port === 465,
      pool: true,
      maxConnections: 3,
      auth: {
        user: SMTP_USER,
        pass: cleanPass
      }
    });
    return cachedTransporter;
  }

  return null;
};

const defaultSender = () => {
  const user = process.env.SMTP_USER || 'no-reply@docnode.com';
  return process.env.SENDER_EMAIL || `"DocNode Healthcare" <${user}>`;
};

const getClientUrl = () => {
  return process.env.CLIENT_URL || 'http://localhost:5173';
};

/**
 * Reusable wrapper to send emails with anti-spam headers and graceful error handling.
 */
const sendMailSafe = async ({ to, subject, html, text }) => {
  try {
    if (!to) {
      console.warn('[EmailService] Recipient email is missing. Skipping send.');
      return { success: false, reason: 'No recipient' };
    }

    const transporter = getTransporter();

    if (!transporter) {
      console.warn('[EmailService] SMTP credentials missing in environment variables. Email sending skipped.');
      return { success: false, reason: 'SMTP not configured' };
    }

    const sender = defaultSender();
    const replyTo = process.env.SMTP_USER || sender;

    const info = await transporter.sendMail({
      from: sender,
      replyTo: replyTo,
      to,
      subject,
      text,
      html
    });

    console.log(`[EmailService] Email delivered to ${to}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EmailService] Failed to send email to ${to}:`, error.message);
    // Do not re-throw to ensure payment/booking APIs remain resilient
    return { success: false, error: error.message };
  }
};

/**
 * Base email layout wrapper with clean, high-deliverability HTML
 */
const emailLayout = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DocNode Healthcare</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #5f6FFF 50%, #3b82f6 100%); padding: 32px 30px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="background: rgba(255, 255, 255, 0.2); width: 44px; height: 44px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                      <span style="font-size: 24px; color: #ffffff;">🩺</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">DocNode</h1>
                    <p style="color: rgba(255, 255, 255, 0.88); margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">Trusted Patient Healthcare Portal</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 30px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                Need help or have questions regarding your appointment?<br>
                Contact our support team at <a href="mailto:${process.env.SMTP_USER || 'support@docnode.com'}" style="color: #5f6FFF; text-decoration: none; font-weight: 600;">${process.env.SMTP_USER || 'support@docnode.com'}</a>
              </p>
              <p style="margin: 12px 0 0 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} DocNode Healthcare System. All rights reserved.<br>
                Confidential medical information. Protected by patient privacy standards.
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

/**
 * 1. Payment Confirmation & Official Receipt Email
 */
export const sendPaymentConfirmationEmail = async ({ appointment, paymentId = 'N/A', orderId = 'N/A' }) => {
  const patientName = appointment?.userData?.name || 'Patient';
  const patientEmail = appointment?.userData?.email;
  const doctorName = appointment?.docData?.name || 'Your Doctor';
  const doctorSpeciality = appointment?.docData?.speciality || 'General Medicine';
  const slotDate = appointment?.slotDate ? appointment.slotDate.split('_').join('/') : 'Scheduled Date';
  const slotTime = appointment?.slotTime || 'Scheduled Time';
  const amount = appointment?.amount || 0;
  const currency = process.env.CURRENCY || 'INR';
  const clinicAddress = appointment?.docData?.address
    ? `${appointment.docData.address.line1 || ''}, ${appointment.docData.address.line2 || ''}`
    : 'DocNode Health Center';
  const clientUrl = getClientUrl();

  const textContent = `Hello ${patientName},\n\nYour consultation fee payment has been confirmed.\n\nReceipt Summary:\n- Doctor: ${doctorName} (${doctorSpeciality})\n- Date & Time: ${slotDate} at ${slotTime}\n- Amount Paid: ${currency === 'INR' ? '₹' : '$'}${amount}\n- Transaction Reference: ${paymentId !== 'N/A' ? paymentId : orderId}\n- Location: ${clinicAddress}\n\nPlease arrive 10 minutes prior to your appointment time.\n\nDocNode Healthcare Team`;

  const content = `
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: #ecfdf5; color: #059669; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; border: 1px solid #a7f3d0; margin-bottom: 12px;">
          ✓ Payment Received & Confirmed
        </div>
        <h2 style="margin: 0; color: #0f172a; font-size: 20px; font-weight: 700;">Consultation Fee Receipt</h2>
        <p style="margin: 6px 0 0 0; color: #64748b; font-size: 13px;">
          Hello <strong>${patientName}</strong>, your payment has been successfully verified.
        </p>
      </div>

      <!-- Receipt Card -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Amount Paid:</td>
          <td style="padding: 6px 0; font-size: 16px; font-weight: 700; color: #0f172a; text-align: right;">${currency === 'INR' ? '₹' : '$'}${amount}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Transaction Reference:</td>
          <td style="padding: 6px 0; font-size: 12px; font-family: monospace; color: #334155; text-align: right;">${paymentId !== 'N/A' ? paymentId : orderId}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Payment Status:</td>
          <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #059669; text-align: right;">Paid (Razorpay)</td>
        </tr>
      </table>

      <!-- Appointment Details Card -->
      <div style="border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 14px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; font-weight: 700;">
          Confirmed Appointment Details
        </h3>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Doctor:</td>
            <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #0f172a; text-align: right;">${doctorName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Speciality:</td>
            <td style="padding: 6px 0; font-size: 13px; color: #334155; text-align: right;">${doctorSpeciality}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Date & Time:</td>
            <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #5f6FFF; text-align: right;">${slotDate} at ${slotTime}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Location:</td>
            <td style="padding: 6px 0; font-size: 13px; color: #334155; text-align: right;">${clinicAddress}</td>
          </tr>
        </table>
      </div>

      <!-- Quick Guidelines -->
      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px 16px; border-radius: 8px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 12px; color: #1e40af; line-height: 1.5;">
          <strong>Helpful Tip:</strong> Please arrive 10 minutes prior to your scheduled time slot. Have any prior medical test records and identification ready for check-in.
        </p>
      </div>

      <div style="text-align: center;">
        <a href="${clientUrl}/my-appointments" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #5f6FFF 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-size: 13px; font-weight: 600; box-shadow: 0 4px 12px rgba(95, 111, 255, 0.3);">
          View My Appointments
        </a>
      </div>
    `;

  return sendMailSafe({
    to: patientEmail,
    subject: `Payment Receipt: Appointment Confirmed with ${doctorName}`,
    text: textContent,
    html: emailLayout(content, `Your payment for ${doctorName} on ${slotDate} has been confirmed.`)
  });
};

/**
 * 2. Appointment Booking Confirmation Email
 */
export const sendBookingConfirmationEmail = async ({ appointment }) => {
  const patientName = appointment?.userData?.name || 'Patient';
  const patientEmail = appointment?.userData?.email;
  const doctorName = appointment?.docData?.name || 'Your Doctor';
  const doctorSpeciality = appointment?.docData?.speciality || 'General Medicine';
  const slotDate = appointment?.slotDate ? appointment.slotDate.split('_').join('/') : 'Scheduled Date';
  const slotTime = appointment?.slotTime || 'Scheduled Time';
  const amount = appointment?.amount || 0;
  const currency = process.env.CURRENCY || 'INR';
  const clientUrl = getClientUrl();

  const textContent = `Hello ${patientName},\n\nYour appointment with ${doctorName} (${doctorSpeciality}) has been reserved for ${slotDate} at ${slotTime}.\n\nConsultation Fee: ${currency === 'INR' ? '₹' : '$'}${amount}\nPayment Status: ${appointment?.payment ? 'Paid Online' : 'Pending (Pay Online / At Clinic)'}\n\nThank you for choosing DocNode Healthcare.`;

  const content = `
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: #eff6ff; color: #2563eb; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; border: 1px solid #bfdbfe; margin-bottom: 12px;">
          Appointment Reserved
        </div>
        <h2 style="margin: 0; color: #0f172a; font-size: 20px; font-weight: 700;">Booking Acknowledgment</h2>
        <p style="margin: 6px 0 0 0; color: #64748b; font-size: 13px;">
          Hello <strong>${patientName}</strong>, your appointment slot has been successfully reserved.
        </p>
      </div>

      <div style="border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px; background-color: #ffffff;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Consultant:</td>
            <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #0f172a; text-align: right;">${doctorName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Department:</td>
            <td style="padding: 6px 0; font-size: 13px; color: #334155; text-align: right;">${doctorSpeciality}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Scheduled For:</td>
            <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #5f6FFF; text-align: right;">${slotDate} at ${slotTime}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Consultation Fee:</td>
            <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #0f172a; text-align: right;">${currency === 'INR' ? '₹' : '$'}${amount}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Payment Status:</td>
            <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: ${appointment?.payment ? '#059669' : '#d97706'}; text-align: right;">
              ${appointment?.payment ? '✓ Paid Online' : 'Pending (Pay Online / At Clinic)'}
            </td>
          </tr>
        </table>
      </div>

      ${!appointment?.payment ? `
      <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 8px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 12px; color: #92400e; line-height: 1.5;">
          <strong>Payment Note:</strong> You can pay online anytime from your dashboard or settle your consultation fees upon arriving at the clinic.
        </p>
      </div>` : ''}

      <div style="text-align: center;">
        <a href="${clientUrl}/my-appointments" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #5f6FFF 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-size: 13px; font-weight: 600;">
          Manage Your Appointment
        </a>
      </div>
    `;

  return sendMailSafe({
    to: patientEmail,
    subject: `Appointment Reserved with ${doctorName} on ${slotDate}`,
    text: textContent,
    html: emailLayout(content, `Your appointment slot with ${doctorName} has been reserved.`)
  });
};

/**
 * 3. Appointment Cancellation Email
 */
export const sendAppointmentCancelledEmail = async ({ appointment, cancelledBy = 'System' }) => {
  const patientName = appointment?.userData?.name || 'Patient';
  const patientEmail = appointment?.userData?.email;
  const doctorName = appointment?.docData?.name || 'Your Doctor';
  const slotDate = appointment?.slotDate ? appointment.slotDate.split('_').join('/') : 'Scheduled Date';
  const slotTime = appointment?.slotTime || 'Scheduled Time';
  const wasPaid = appointment?.payment;
  const amount = appointment?.amount || 0;
  const currency = process.env.CURRENCY || 'INR';
  const clientUrl = getClientUrl();

  const textContent = `Hello ${patientName},\n\nYour appointment with ${doctorName} on ${slotDate} at ${slotTime} has been cancelled.\n\n${wasPaid ? `Refund Notice: A full refund of ${currency === 'INR' ? '₹' : '$'}${amount} has been initiated to your original payment method (5-7 business days).\n\n` : ''}DocNode Healthcare Team`;

  const content = `
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: #fef2f2; color: #dc2626; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; border: 1px solid #fecaca; margin-bottom: 12px;">
          Appointment Cancelled
        </div>
        <h2 style="margin: 0; color: #0f172a; font-size: 20px; font-weight: 700;">Cancellation Confirmation</h2>
        <p style="margin: 6px 0 0 0; color: #64748b; font-size: 13px;">
          Hello <strong>${patientName}</strong>, your appointment with <strong>${doctorName}</strong> on ${slotDate} at ${slotTime} has been cancelled.
        </p>
      </div>

      ${wasPaid ? `
      <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <h4 style="margin: 0 0 6px 0; color: #065f46; font-size: 13px; font-weight: 700;">Refund Processing</h4>
        <p style="margin: 0; font-size: 12px; color: #047857; line-height: 1.5;">
          A full refund of <strong>${currency === 'INR' ? '₹' : '$'}${amount}</strong> has been initiated to your original payment method. Most bank refunds reflect within 5 to 7 business days.
        </p>
      </div>` : ''}

      <div style="text-align: center;">
        <a href="${clientUrl}/doctors" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-size: 13px; font-weight: 600;">
          Book Another Doctor
        </a>
      </div>
    `;

  return sendMailSafe({
    to: patientEmail,
    subject: `Cancelled: Appointment with ${doctorName} on ${slotDate}`,
    text: textContent,
    html: emailLayout(content, `Cancellation notice for your appointment with ${doctorName}.`)
  });
};

/**
 * 4. Appointment Consultation Completed Email
 */
export const sendAppointmentCompletedEmail = async ({ appointment }) => {
  const patientName = appointment?.userData?.name || 'Patient';
  const patientEmail = appointment?.userData?.email;
  const doctorName = appointment?.docData?.name || 'Your Doctor';
  const slotDate = appointment?.slotDate ? appointment.slotDate.split('_').join('/') : 'Today';
  const clientUrl = getClientUrl();

  const textContent = `Hello ${patientName},\n\nYour consultation with ${doctorName} on ${slotDate} has been successfully completed.\n\nThank you for choosing DocNode Healthcare.`;

  const content = `
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: #f0fdf4; color: #16a34a; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; border: 1px solid #bbf7d0; margin-bottom: 12px;">
          Consultation Concluded
        </div>
        <h2 style="margin: 0; color: #0f172a; font-size: 20px; font-weight: 700;">Thank You for Your Visit</h2>
        <p style="margin: 6px 0 0 0; color: #64748b; font-size: 13px;">
          Hello <strong>${patientName}</strong>, your consultation with <strong>${doctorName}</strong> on ${slotDate} has been successfully completed.
        </p>
      </div>

      <div style="border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px; background-color: #ffffff; text-align: center;">
        <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.6;">
          We hope you had a satisfactory consultation. Follow any prescribed medical advice or prescription notes provided by Dr. ${doctorName}.
        </p>
      </div>

      <div style="text-align: center;">
        <a href="${clientUrl}/my-appointments" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #5f6FFF 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-size: 13px; font-weight: 600;">
          View Consultation Record
        </a>
      </div>
    `;

  return sendMailSafe({
    to: patientEmail,
    subject: `Consultation Completed with ${doctorName}`,
    text: textContent,
    html: emailLayout(content, `Consultation record with ${doctorName} is available.`)
  });
};

/**
 * 5. Appointment Rescheduling Notification Email
 */
export const sendAppointmentRescheduledEmail = async ({ appointment, previousSlot }) => {
  const patientName = appointment?.userData?.name || 'Patient';
  const patientEmail = appointment?.userData?.email;
  const doctorName = appointment?.docData?.name || 'Your Doctor';
  const newDate = appointment?.slotDate ? appointment.slotDate.split('_').join('/') : 'New Date';
  const newTime = appointment?.slotTime || 'New Time';
  const prevDate = previousSlot?.date ? previousSlot.date.split('_').join('/') : 'Previous Date';
  const prevTime = previousSlot?.time || 'Previous Time';
  const clientUrl = getClientUrl();

  const textContent = `Hello ${patientName},\n\nYour appointment with ${doctorName} has been rescheduled to ${newDate} at ${newTime}.\nPrevious Slot: ${prevDate} at ${prevTime}.\n\nThank you for choosing DocNode Healthcare.`;

  const content = `
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: #f5f3ff; color: #7c3aed; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; border: 1px solid #ddd6fe; margin-bottom: 12px;">
          Appointment Rescheduled
        </div>
        <h2 style="margin: 0; color: #0f172a; font-size: 20px; font-weight: 700;">Slot Updated Successfully</h2>
        <p style="margin: 6px 0 0 0; color: #64748b; font-size: 13px;">
          Hello <strong>${patientName}</strong>, your appointment slot has been updated.
        </p>
      </div>

      <div style="border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px; background-color: #ffffff;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Consultant:</td>
            <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #0f172a; text-align: right;">${doctorName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Previous Slot:</td>
            <td style="padding: 6px 0; font-size: 13px; color: #94a3b8; text-decoration: line-through; text-align: right;">${prevDate} at ${prevTime}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">New Slot:</td>
            <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #5f6FFF; text-align: right;">${newDate} at ${newTime}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center;">
        <a href="${clientUrl}/my-appointments" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #5f6FFF 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-size: 13px; font-weight: 600;">
          View in My Appointments
        </a>
      </div>
    `;

  return sendMailSafe({
    to: patientEmail,
    subject: `Rescheduled: Appointment with ${doctorName}`,
    text: textContent,
    html: emailLayout(content, `Your appointment slot with ${doctorName} has been updated to ${newDate} at ${newTime}.`)
  });
};

export default {
  sendPaymentConfirmationEmail,
  sendBookingConfirmationEmail,
  sendAppointmentCancelledEmail,
  sendAppointmentCompletedEmail,
  sendAppointmentRescheduledEmail
};
