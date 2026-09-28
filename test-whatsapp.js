const axios = require('axios');
const fs = require('fs');

// Read .env manually without extra dependencies
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
});

const token = env.META_WA_ACCESS_TOKEN;
const phoneNumberId = env.META_WA_PHONE_NUMBER_ID;

async function testWhatsApp(recipient) {
  if (!recipient) {
    console.error("Please provide a recipient phone number");
    return;
  }

  const cleanPhone = recipient.replace(/[^0-9]/g, '');
  console.log(`\n========================================`);
  console.log(`Target Phone: +${cleanPhone}`);
  console.log(`Phone Number ID: ${phoneNumberId}`);
  console.log(`========================================\n`);

  // Test 1: Template hello_world
  try {
    console.log("1. Sending 'hello_world' template...");
    const resTemplate = await axios.post(
      `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: cleanPhone,
        type: "template",
        template: {
          name: "hello_world",
          language: { code: "en_US" }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("✅ SUCCESS! Template sent! Message ID:", resTemplate.data.messages?.[0]?.id);
  } catch (err) {
    console.error("❌ Template Error:", JSON.stringify(err.response?.data || err.message, null, 2));
  }

  // Test 2: Custom text
  try {
    console.log("\n2. Sending custom text message...");
    const resText = await axios.post(
      `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanPhone,
        type: "text",
        text: {
          preview_url: true,
          body: "👋 Salam! Notification de test mn MediAppoint WA CRM. Système dyalek khddam 100%!"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("✅ SUCCESS! Text message sent! Message ID:", resText.data.messages?.[0]?.id);
  } catch (err) {
    console.error("❌ Text Error:", JSON.stringify(err.response?.data || err.message, null, 2));
  }
}

const target = process.argv[2] || "212622186541";
testWhatsApp(target);
