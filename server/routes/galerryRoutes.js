const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const router = express.Router();
const db = new sqlite3.Database('./gallery.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to database (gallery)');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET: /gallery/list
router.get('/list', (req, res) => {
  db.all('SELECT * FROM gallery', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: rows });
  });
});

// POST: /gallery/post
router.post('/post', upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;

  db.run('INSERT INTO gallery (title, description, imageUrl) VALUES (?, ?, ?)',
    [title, description, imageUrl],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM gallery WHERE id = ?', [this.lastID], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: [row] });
      });
    });
});

// DELETE: /gallery/delete/:id
router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM gallery WHERE id = ?', [id], (err, row) => {
    if (row) {
      const filePath = path.join(__dirname, '../uploads', path.basename(row.imageUrl));
      fs.unlink(filePath, (err) => err && console.log('File not found:', filePath));
    }
  });

  db.run('DELETE FROM gallery WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;
