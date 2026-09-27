const { Client } = require('pg');

async function testConnection() {
  const url = 'postgresql://postgres.givryysaejhioezikosk:DF_3eus%2F-dTtEt9AM@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';
  
  console.log('Testing connection to Supabase (Transaction Pooler)...');
  const client = new Client({ 
    connectionString: url,
    connectionTimeoutMillis: 15000,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log(`✅ SUCCESS! Server time: ${res.rows[0].now}`);
    await client.end();
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
  }
}

testConnection();
