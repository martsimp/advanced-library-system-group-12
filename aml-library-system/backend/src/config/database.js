const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

// Testing the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error details:', {
      code: err.code,
      message: err.message,
      stack: err.stack
    });
    return console.error('Error acquiring client');
  }
  console.log('Successfully connected to database');
  release();
});

// Error test
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool; 