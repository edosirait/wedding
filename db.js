const { Pool } = require('pg');

const pool = new Pool({
    user: 'agvzemkh',
    host: 'rain.db.elephantsql.com',
    database: 'agvzemkh', // Nama database yang telah Anda buat
    password: 'KP7XzKwSbZEyfnRiIY8QQUbKUZ9bsBeD', // Ganti dengan password database Anda
    port: ''
});

module.exports = pool;
