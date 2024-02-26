const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Inisialisasi database SQLite
const db = new sqlite3.Database('./comments.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});


// Endpoint untuk menambahkan komentar baru
app.post('/api/comment', (req, res) => {
    const { nama, hadir, komentar } = req.body;

    // Pastikan nilai hadir dikonversi ke tipe data yang benar
    const hadirBoolean = hadir === true || hadir === 'true';

    const sql = `INSERT INTO comments (nama, hadir, komentar) VALUES (?, ?, ?)`;
    const params = [nama, hadirBoolean ? 1 : 0, komentar]; // Simpan sebagai 1 atau 0

    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(201).json({
            message: 'Komentar ditambahkan',
            data: { id: this.lastID, nama, hadir: hadirBoolean, komentar }
        });
    });
});


// Endpoint untuk mendapatkan semua komentar
app.get('/api/comment', (req, res) => {
    const sql = `SELECT * FROM comments`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Berhasil mendapatkan semua komentar',
            data: rows
        });
    });
});

// Endpoint untuk menghapus komentar
app.delete('/api/comment/:id', (req, res) => {
    const sql = `DELETE FROM comments WHERE id = ?`;
    db.run(sql, req.params.id, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Komentar dihapus', changes: this.changes });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server static files from 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
