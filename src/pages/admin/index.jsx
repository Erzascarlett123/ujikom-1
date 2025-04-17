import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../../supabaseClient";
import TableArtikel from "../../components/tableArtikel";
import Swal from "sweetalert2";

export default function AdminArtikel() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", image: null });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // Untuk reset input file

  // Fetch articles from Supabase
  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat mengambil artikel.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      setArticles(data);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Upload image and return public URL
  const uploadImage = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      Swal.fire({
        title: "Gagal!",
        text: "File bukan gambar atau tidak ada file yang dipilih.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return null;
    }

    const filename = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("image")
      .upload(filename, file);

    if (uploadError) {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal meng-upload gambar.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return null;
    }

    const { data: publicUrlData } = await supabase.storage
  .from("image")
  .getPublicUrl(filename);

return publicUrlData?.publicUrl || null;

  };

  // Submit form: insert or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image_url = null;

      if (form.image) {
        image_url = await uploadImage(form.image);
        if (!image_url) {
          setLoading(false);
          return;
        }
      }

      const articleData = {
        title: form.title,
        content: form.content,
        image: image_url || null, // tetap menggunakan gambar yang ada jika tidak diupload
      };

      if (isEdit) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", editId);
        if (error) throw error;
        Swal.fire({
          title: "Sukses!",
          text: "Artikel berhasil diperbarui.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        const { error } = await supabase.from("articles").insert(articleData);
        if (error) throw error;
        Swal.fire({
          title: "Sukses!",
          text: "Artikel berhasil ditambahkan.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }

      // Reset form
      setForm({ title: "", content: "", image: null });
      setIsEdit(false);
      setEditId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input file
      }
      fetchArticles(); // Re-fetch articles to show the updated list
    } catch (err) {
      console.error("Error saving article:", err);
      Swal.fire({
        title: "Terjadi Kesalahan!",
        text: "Terjadi kesalahan saat menyimpan artikel.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    const { value } = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Artikel ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (value) {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) {
        Swal.fire({
          title: "Gagal!",
          text: "Gagal menghapus artikel.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Sukses!",
          text: "Artikel berhasil dihapus.",
          icon: "success",
          confirmButtonText: "OK",
        });
        fetchArticles();
      }
    }
  };

  // Handle edit
  const handleEdit = (article) => {
    setForm({
      title: article.title,
      content: article.content,
      image: article.image || null, // mempertahankan gambar yang ada saat edit
    });
    setIsEdit(true);
    setEditId(article.id);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Kosongkan file input juga saat mulai edit
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-900">
      <div className="p-2"></div>
      <h1 className="text-3xl font-semibold text-white text-center">Manajemen Artikel</h1>

      {/* Form untuk tambah/edit artikel */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-xl mx-auto"
      >
        <input
          name="title"
          type="text"
          placeholder="Judul Artikel"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          name="content"
          placeholder="Isi Artikel"
          value={form.content}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          ref={fileInputRef}
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : isEdit ? "Update Artikel" : "Tambah Artikel"}
        </button>
      </form>

      {/* Tabel daftar artikel */}
      <TableArtikel
        articles={articles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
