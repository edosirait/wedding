const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const path = require('path');
const pool = require('./db'); // Menggunakan koneksi pool PostgreSQL dari db.js

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint untuk menambahkan komentar baru
app.post('/api/comment', (req, res) => {
    const { nama, hadir, komentar } = req.body;
    const hadirBoolean = hadir === true || hadir === 'true';

    const sql = 'INSERT INTO comments (nama, hadir, komentar) VALUES ($1, $2, $3) RETURNING *';
    const values = [nama, hadirBoolean, komentar];

    pool.query(sql, values, (error, result) => {
        if (error) {
            res.status(400).json({ error: error.message });
        } else {
            const { id, nama, hadir, komentar } = result.rows[0];
            res.status(201).json({
                message: 'Komentar ditambahkan',
                data: { id, nama, hadir, komentar }
            });
        }
    });
});

// Endpoint untuk mendapatkan semua komentar
app.get('/api/comment', (req, res) => {
    const sql = `SELECT * FROM comments`;
    pool.query(sql)
        .then(result => {
            res.json({
                message: 'Berhasil mendapatkan semua komentar',
                data: result.rows
            });
        })
        .catch(error => {
            console.error("Gagal mendapatkan komentar:", error);
            res.status(500).json({ error: 'Gagal mendapatkan komentar' });
        });
});

// Endpoint untuk menghapus komentar
app.delete('/api/comment/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM comments WHERE id = $1`;
    pool.query(sql, [id])
        .then(result => {
            res.json({ message: 'Komentar dihapus', changes: result.rowCount });
        })
        .catch(error => {
            console.error("Gagal menghapus komentar:", error);
            res.status(500).json({ error: 'Gagal menghapus komentar' });
        });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 4200;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
