const admin = require('firebase-admin');


module.exports = (req, res) => {
    if (req.method === 'POST') {
        const { nama, hadir, komentar } = req.body;
        const commentsRef = admin.database().ref('comments');
        const newCommentRef = commentsRef.push();

        newCommentRef.set({ nama, hadir, komentar }, error => {
            if (error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(201).json({
                    message: 'Komentar ditambahkan',
                    id: newCommentRef.key,
                    nama,
                    hadir,
                    komentar
                });
            }
        });
    } else if (req.method === 'GET') {
        const commentsRef = admin.database().ref('comments');
        commentsRef.once('value', (snapshot) => {
            const comments = snapshot.val();
            if (comments) {
                const commentsArray = Object.keys(comments).map(key => ({
                    id: key,
                    ...comments[key]
                }));
                res.json({
                    message: 'Berhasil mendapatkan semua komentar',
                    data: commentsArray
                });
            } else {
                res.status(400).json({ error: 'Tidak ada komentar' });
            }
        });
    }
};
