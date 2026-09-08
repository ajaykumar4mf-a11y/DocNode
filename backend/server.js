import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoutes.js";


//app configuration
const app = express();
const port = process.env.PORT || 9000;

// Connect to MongoDB
connectDB();
connectCloudinary();

//middlewares
app.use(cors());  //allows to connect to the backend from the frontend
app.use(express.json());


import { getTransporter, sendMailSafe } from "./config/emailService.js";

// api endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

app.get("/", (req, res) => res.send("API is running!"));

// Diagnostic endpoint to test email configuration and connectivity
app.get("/api/test-email", async (req, res) => {
    try {
        const { SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT, SENDER_EMAIL } = process.env;
        
        const envStatus = {
            SMTP_USER: SMTP_USER ? `${SMTP_USER.trim().slice(0, 4)}***` : 'NOT SET',
            SMTP_PASS: SMTP_PASS ? `SET (${SMTP_PASS.replace(/\s+/g, '').length} chars)` : 'NOT SET',
            SMTP_HOST: SMTP_HOST || 'default (smtp.gmail.com)',
            SMTP_PORT: SMTP_PORT || 'default (465)',
            SENDER_EMAIL: SENDER_EMAIL || 'default'
        };

        if (!SMTP_USER || !SMTP_PASS) {
            return res.status(400).json({
                success: false,
                message: "SMTP_USER or SMTP_PASS is missing in Render environment variables!",
                envStatus
            });
        }

        const transporter = getTransporter();
        if (!transporter) {
            return res.status(500).json({
                success: false,
                message: "Could not create transporter. Please verify credentials.",
                envStatus
            });
        }

        // Test SMTP connection handshake
        await transporter.verify();

        const targetEmail = (req.query.to || SMTP_USER).trim().replace(/^["']|["']$/g, '');
        const sendResult = await sendMailSafe({
            to: targetEmail,
            subject: "DocNode Email Service Live Diagnostic",
            text: "Hello! This test confirms that your deployed DocNode backend on Render can successfully connect and send emails via Gmail.",
            html: `
                <div style="font-family: sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 500px;">
                    <h2 style="color: #4f46e5; margin-top: 0;">DocNode Email System Verified</h2>
                    <p style="color: #334155; line-height: 1.5;">Your deployed DocNode backend on Render has successfully authenticated with Gmail SMTP and sent this verification email.</p>
                    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin-top: 16px;">
                        <span style="color: #16a34a; font-weight: bold;">Status: All systems operational</span>
                    </div>
                </div>
            `
        });

        return res.json({
            success: sendResult.success,
            message: sendResult.success ? `Verification email delivered to ${targetEmail}` : "Failed to deliver email",
            details: sendResult,
            envStatus
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "SMTP Diagnostic Failed: " + error.message,
            error: error.message
        });
    }
});

app.listen(port, () => console.log(`listening on localhost:${port}`));