const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./comments.db', sqlite3.OPEN_READWRITE);

module.exports = (req, res) => {
    if (req.method === 'GET') {
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
    } else if (req.method === 'POST') {
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
    }
};
