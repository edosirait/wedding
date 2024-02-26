const admin = require('firebase-admin');

module.exports = (req, res) => {
    const commentId = req.params.id; // Pastikan 'id' dikirim melalui parameter request
    const commentRef = admin.database().ref(`comments/${commentId}`);

    commentRef.remove()
        .then(() => {
            res.json({ message: 'Komentar dihapus' });
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};
