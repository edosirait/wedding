const pool = require('/db'); // Menggunakan path yang sesuai

module.exports = (req, res) => {
    if (req.method === 'POST') {
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
                    id,
                    nama,
                    hadir,
                    komentar
                });
            }
        });
    } else if (req.method === 'GET') {
        const sql = 'SELECT * FROM comments';

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
    }
};
