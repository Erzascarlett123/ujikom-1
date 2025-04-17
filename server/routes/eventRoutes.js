// public/server/routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { supabase } = require("../lib/supabase");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET: List Event
router.get("/list", async (req, res) => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  if (error) return res.status(400).json({ success: false, message: error.message });
  res.json({ success: true, data });
});

// POST: Tambah Event
router.post("/post", upload.single("image"), async (req, res) => {
  const { title, event_date, description } = req.body;
  const file = req.file;

  let imageUrl = null;
  if (file) {
    const filename = `${Date.now()}-${file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("events")
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError)
      return res.status(400).json({ success: false, message: uploadError.message });

    const { data: publicUrlData } = supabase.storage
      .from("events")
      .getPublicUrl(filename);

    imageUrl = publicUrlData?.publicUrl;
  }

  const { data, error } = await supabase
    .from("events")
    .insert({ title, event_date, description, image: imageUrl })
    .select();

  if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  res.json({ success: true, message: "Event berhasil ditambahkan", data });
});

// DELETE: Hapus Event
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) return res.status(400).json({ success: false, message: error.message });
  res.json({ success: true, message: "Event berhasil dihapus" });
});

// PUT: Update Event
router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { title, event_date, description } = req.body;

  const { error } = await supabase
    .from("events")
    .update({ title, event_date, description })
    .eq("id", id);

  if (error) return res.status(400).json({ success: false, message: error.message });
  res.json({ success: true, message: "Event berhasil diupdate" });
});

module.exports = router;
