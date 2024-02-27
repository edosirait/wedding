import db from './db.js';

module.exports = (req, res) => {
    const commentId = req.params.id; // Pastikan 'id' dikirim melalui parameter request

    const sql = 'DELETE FROM comments WHERE id = $1';
    const values = [commentId];

    db.query(sql, values)
        .then(result => {
            if (result.rowCount > 0) {
                res.json({ message: 'Komentar dihapus' });
            } else {
                res.status(404).json({ error: 'Komentar tidak ditemukan' });
            }
        })
        .catch(error => {
            console.error("Gagal menghapus komentar:", error);
            res.status(500).json({ error: 'Gagal menghapus komentar' });
        });
};
