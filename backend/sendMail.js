import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/send-email', async (req, res) => {
  const {
    memberName,
    memberEmail,
    memberPhone,
    itemName,
    quantity,
    pricePerUnit,
    paymentStatus
  } = req.body;

  const total = quantity * pricePerUnit;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: memberEmail,
      subject: `Reminder: Payment Due`,
      html: `
        <h3>Hello ${memberName},</h3>
        <p>You have a pending payment:</p>
        <ul>
          <li>Item: ${itemName}</li>
          <li>Quantity: ${quantity}</li>
          <li>Price per unit: ₹${pricePerUnit}</li>
          <li>Total: ₹${total}</li>
          <li>Status: ${paymentStatus}</li>
        </ul>
        <p>Please clear your dues at the earliest.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.toString() });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
