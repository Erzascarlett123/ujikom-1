// public/server/routes/clientRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { supabase } = require("../lib/supabase.js");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET: List Client
router.get("/list", async (req, res) => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ success: false, message: error.message });
  res.json({ success: true, data });
});

// POST: Tambah Client
router.post("/post", upload.single("image"), async (req, res) => {
  const { name, info } = req.body;
  const file = req.file;

  let imageUrl = null;
  if (file) {
    const filename = `${Date.now()}-${file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("clients")
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError)
      return res.status(400).json({ success: false, message: uploadError.message });

    const { data: publicUrlData } = supabase.storage
      .from("clients")
      .getPublicUrl(filename);

    imageUrl = publicUrlData?.publicUrl;
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({ name, info, image: imageUrl })
    .select();

  if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  res.json({ success: true, message: "Client berhasil ditambahkan", data });
});

// DELETE: Hapus Client
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) return res.status(400).json({ success: false, message: error.message });
  res.json({ success: true, message: "Client berhasil dihapus" });
});

// PUT: Update Client
router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { name, info } = req.body;

  const { error } = await supabase
    .from("clients")
    .update({ name, info })
    .eq("id", id);

  if (error) return res.status(400).json({ success: false, message: error.message });
  res.json({ success: true, message: "Client berhasil diupdate" });
});

module.exports = router;
