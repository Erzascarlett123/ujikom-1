const express = require("express");
const router = express.Router();
const multer = require("multer");
const { supabase } = require("../../src/lib/supabase.js");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET: List artikel
router.get("/list", async (req, res) => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ success: false, message: error.message });
  res.json({ success: true, data });
});

// POST: Tambah artikel
router.post("/post", upload.single("image"), async (req, res) => {
  const { title, content } = req.body;
  const file = req.file;

  let imageUrl = null;
  if (file) {
    const filename = `${Date.now()}-${file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("image")
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError)
      return res.status(400).json({ success: false, message: uploadError.message });

    const { data: publicUrlData } = supabase.storage
      .from("image")
      .getPublicUrl(filename);

    imageUrl = publicUrlData?.publicUrl;
  }

  const { data, error } = await supabase
    .from("articles")
    .insert({ title, content, image: imageUrl })
    .select();

  if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  res.json({ success: true, message: "Artikel berhasil ditambahkan", data });
});

// DELETE: Hapus artikel
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) return res.status(400).json({ success: false, message: error.message });
  res.json({ success: true, message: "Artikel berhasil dihapus" });
});

// PUT: Update artikel
router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const { error } = await supabase
    .from("articles")
    .update({ title, content })
    .eq("id", id);

  if (error) return res.status(400).json({ success: false, message: error.message });
  res.json({ success: true, message: "Artikel berhasil diupdate" });
});

module.exports = router;
