import nodemailer from "nodemailer";

//blood request post notification
export const sendEmailNotification = async (
  userEmails: string[],
  blood_group: string,
  location: string,
  contact: string
) => {
  if (
    !userEmails ||
    userEmails.length === 0 ||
    !blood_group ||
    !location ||
    !contact
  ) {
    throw new Error("Missing required parameters");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASS,
    },
  });

  const mailOptions = (email: string) => ({
    from: `"Blood Donation Platform" <${process.env.EMAIL_USER}>`, // Better sender name
    to: email,
    subject: "Urgent: Blood Request Needed in Your Area",
    text: `Dear donor,

A blood donation request has been made for blood group ${blood_group}.

Location: ${location}
Contact: ${contact}

If you are available to donate, please reach out to the provided contact.

Thank you for your support.

Best Regards,
Blood Donation Team`,
    html: `
    <p>Dear donor,</p>
    <p>A blood donation request has been made for blood group <strong>${blood_group}</strong>.</p>
    <p><strong>Location:</strong> ${location}</p>
    <p><strong>Contact:</strong> ${contact}</p>
    <p>If you are available to donate, please reach out to the provided contact.</p>
    <p>Thank you for your support.</p>
    <p>Best Regards,<br>Blood Donation Team</p>
  `,
  });

  try {
    await Promise.all(
      userEmails.map((email) => transporter.sendMail(mailOptions(email)))
    );
    console.log(`Emails sent successfully to: ${userEmails.join(", ")}`);
  } catch (error) {
    console.error("Failed to send some emails:", error);
    throw new Error("Some emails failed to send");
  }
};


//new appointment request notification
export const sendAppointmentNotification = async (
  donorEmail: string,
) => {
  if (!donorEmail) {
    throw new Error("Donor email is required");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASS,
    },
  });

  const mailOptions = {
    from: `"Blood Donation Platform" <${process.env.EMAIL_USER}>`,
    to: donorEmail,
    subject: "New Blood Donation Appointment Request",
    text: `Dear donor,

You have a new appointment request for blood donation.


Please visit your appointment page to view details and confirm your availability.

Thank you for your help in saving lives!

Best Regards,
Blood Donation Team`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #e53e3e;">New Appointment Request</h2>
      </div>
      
      <p>Dear donor,</p>
      
      <p>You have a new appointment request for blood donation.</p>
      
      <p>Please visit your appointment page to view details and confirm your availability.</p>
      
      <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; text-align: center; font-style: italic;">Thank you for your help in saving lives!</p>
      </div>
      
      <p>Best Regards,<br>Blood Donation Team</p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Appointment notification sent successfully to: ${donorEmail}`);
    return true;
  } catch (error) {
    console.error("Failed to send appointment notification:", error);
    throw new Error("Failed to send appointment notification");
  }
};