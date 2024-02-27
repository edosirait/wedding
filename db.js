const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '192.168.100.5',
    database: 'comments', // Nama database yang telah Anda buat
    password: 'admin123', // Ganti dengan password database Anda
    port: 5433
});

module.exports = pool;
