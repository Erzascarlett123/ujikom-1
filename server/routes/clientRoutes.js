const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let gallery = [];
let nextId = 1;

app.get('/gallery/list', (req, res) => {
  res.json(gallery);
});

app.post('/gallery/post', (req, res) => {
  const { title, image } = req.body;
  if (!title || !image) {
    return res.status(400).json({ error: 'title dan image URL wajib diisi' });
  }

  const newItem = { id: nextId++, title, image };
  gallery.push(newItem);
  res.status(201).json(newItem);
});

app.delete('/gallery/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = gallery.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Data tidak ditemukan' });
  }

  gallery.splice(index, 1);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server gallery jalan di http://localhost:${PORT}`);
});
