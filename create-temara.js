const https = require('https');

const data = JSON.stringify({
  name: "Centre Dentaire Temara",
  doctorName: "Dr. Karim El Fassi",
  specialty: "Chirurgien-Dentiste",
  phone: "+212660123456",
  email: "contact@dentaire-temara.ma",
  address: "Av. Mohammed V, Immeuble Al Baraka, 2ème étage, Témara",
  city: "Témara",
  googleMapsUrl: "https://maps.google.com/?q=Temara+Avenue+Mohammed+V",
  services: [
    { name: "Consultation & Diagnostic", durationMin: 30, price: 250, description: "Examen clinique complet avec radio panoramique." },
    { name: "Détartrage & Polissage", durationMin: 45, price: 400, description: "Nettoyage professionnel des dents et gencives." },
    { name: "Blanchiment Dentaire", durationMin: 60, price: 1500, description: "Éclaircissement professionnel en cabinet." },
    { name: "Extraction Dentaire", durationMin: 30, price: 500, description: "Extraction simple ou complexe avec anesthésie locale." },
    { name: "Soin de Carie (Obturation)", durationMin: 45, price: 350, description: "Traitement et restauration dentaire composite." },
    { name: "Prothèse Dentaire", durationMin: 60, price: 2500, description: "Couronne, bridge ou prothèse amovible." }
  ],
  workingDays: [1, 2, 3, 4, 5, 6],
  startTime: "09:00",
  endTime: "18:30"
});

const options = {
  hostname: 'whatsapp-booking-crm.vercel.app',
  path: '/api/clinics',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
  timeout: 30000
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const parsed = JSON.parse(body);
    console.log('Booking URL:', parsed.bookingUrl);
    console.log('Clinic:', parsed.clinic?.name);
    console.log('Slug:', parsed.clinic?.slug);
    console.log('Services:', parsed.clinic?.services?.length);
  });
});
req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
