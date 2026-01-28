import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 4000;

// 🔥 Middleware
app.use(cors());
app.use(express.json());

// 🔐 Termii config
const TERMII_API_KEY = "PUT_YOUR_TERMII_API_KEY_HERE";
const SENDER_ID = "KANDYSTREAT";

// ✅ Health check
app.get("/", (req, res) => {
  res.send("SMS server running ✅");
});

// ✅ SEND SMS ENDPOINT
app.post("/send-sms", async (req, res) => {
  const { phone, orderId } = req.body;

  if (!phone || !orderId) {
    return res.status(400).json({ error: "phone and orderId required" });
  }

  const cleanPhone = phone.replace(/\D/g, "");

  const message =
    `Kandy’s Treats 🍽️\n` +
    `Your order ${orderId} is on the way 🚴\n` +
    `Track here: http://127.0.0.1:5501/track.html?code=${orderId}`;

  try {
    const response = await fetch("https://api.ng.termii.com/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: cleanPhone,
        from: SENDER_ID,
        sms: message,
        type: "plain",
        channel: "generic",
        api_key: TLWNFsKWnzgQshPfMGkyHEOYEkEbbRDNMhetQIUdqVoerCFSgogKqngYUNmCka,
      }),
    });

    const data = await response.json();

    console.log("📨 Termii response:", data);

    res.json({ success: true, termii: data });
  } catch (err) {
    console.error("❌ SMS failed", err);
    res.status(500).json({ error: "SMS failed" });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 SMS server running at http://localhost:${PORT}`);
});
