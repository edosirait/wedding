const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./comments.db', sqlite3.OPEN_READWRITE);

module.exports = (req, res) => {
    const sql = `DELETE FROM comments WHERE id = ?`;
    db.run(sql, req.params.id, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Komentar dihapus', changes: this.changes });
    });
};
