import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();

/* ----- CORS (this is what was breaking your POST) ----- */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());

/* ----- Resend ----- */
const resend = new Resend(process.env.RESEND_API_KEY);

/* ----- Mail endpoint ----- */
app.post("/send", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await resend.emails.send({
      from: "Automata <no-reply@automataa.tech>",
      to: ["org.automata@gmail.com"],
      replyTo: email,
      subject: `New Lead from ${name}`,
      html: `
        <h2>New Automata Lead</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });

    console.log("Email sent:", result);
    res.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ success: false, error: "Email failed" });
  }
});

/* ----- Health check ----- */
app.get("/", (req, res) => {
  res.send("Automata Mail API is running");
});

/* ----- Start server ----- */
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
