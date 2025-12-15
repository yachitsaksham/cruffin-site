export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ reply: "No message received." });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are Cruffin, a premium bakery concierge.

Menu:
- Chocolate Truffle ₹1200
- Red Velvet ₹1350
- Blueberry Cheesecake ₹1650

Be concise, friendly, and helpful.

User: ${text}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't respond right now.";

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ reply: "AI service unavailable. Try again later." });
  }
}
