import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    await resend.emails.send({
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

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get("/", (req, res) => {
  res.send("Automata Mail API is running");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port " + port));
