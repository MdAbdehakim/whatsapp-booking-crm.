$endpoints = @(
  @{name='Landing Page'; url='https://whatsapp-booking-crm.vercel.app/'},
  @{name='API Clinics'; url='https://whatsapp-booking-crm.vercel.app/api/clinics'},
  @{name='API Health'; url='https://whatsapp-booking-crm.vercel.app/api/health'},
  @{name='API Patients'; url='https://whatsapp-booking-crm.vercel.app/api/patients'},
  @{name='API Appointments'; url='https://whatsapp-booking-crm.vercel.app/api/appointments'},
  @{name='API Services'; url='https://whatsapp-booking-crm.vercel.app/api/services'},
  @{name='Booking Page'; url='https://whatsapp-booking-crm.vercel.app/dr-amine-bennani'},
  @{name='Dashboard'; url='https://whatsapp-booking-crm.vercel.app/dashboard'},
  @{name='Patients Page'; url='https://whatsapp-booking-crm.vercel.app/dashboard/patients'},
  @{name='Settings Page'; url='https://whatsapp-booking-crm.vercel.app/dashboard/settings'},
  @{name='QR Code Page'; url='https://whatsapp-booking-crm.vercel.app/dashboard/qr-code'},
  @{name='Onboarding'; url='https://whatsapp-booking-crm.vercel.app/onboarding'}
)
foreach ($ep in $endpoints) {
  try {
    $r = Invoke-WebRequest -Uri $ep.url -UseBasicParsing -TimeoutSec 20
    Write-Host ("OK  {0} - {1}" -f $r.StatusCode, $ep.name)
  } catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Write-Host ("ERR {0} - {1}" -f $code, $ep.name)
  }
}
