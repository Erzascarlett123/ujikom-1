import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

export default function GalleryAdmin() {
  const [gallery, setGallery] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [editingImageId, setEditingImageId] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const bucketName = 'gallery';

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setGallery(data);
      setLoading(false);
    };
    fetchGallery();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      Swal.fire('Gagal', 'Gambar belum dipilih!', 'error');
      return;
    }

    setLoading(true);
    const fileExt = image.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, image);

    if (uploadError) {
      setLoading(false);
      Swal.fire('Gagal', 'Upload gambar gagal.', 'error');
      return;
    }

    const { data, error: insertError } = await supabase
      .from('gallery')
      .insert([{ title, description, image_url: filePath }])
      .select();

    setLoading(false);

    if (!insertError) {
      setGallery([data[0], ...gallery]);
      setTitle('');
      setDescription('');
      setImage(null);
      Swal.fire('Berhasil', 'Gambar berhasil ditambahkan!', 'success');
    } else {
      Swal.fire('Gagal', 'Gagal menambahkan gambar.', 'error');
    }
  };

  const handleDelete = async (id, image_url) => {
    const confirm = await Swal.fire({
      title: 'Yakin hapus?',
      text: 'Gambar akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (confirm.isConfirmed) {
      setLoading(true);
      await supabase.from('gallery').delete().eq('id', id);
      await supabase.storage.from(bucketName).remove([image_url]);
      setGallery(gallery.filter((g) => g.id !== id));
      setLoading(false);
      Swal.fire('Berhasil', 'Gambar telah dihapus.', 'success');
    }
  };

  const handleEdit = (id) => {
    setEditingImageId(id);
    setNewImageFile(null);
  };

  const handleUpdate = async (e, item) => {
    e.preventDefault();
    let updatedImagePath = item.image_url;
    setLoading(true);

    try {
      if (newImageFile) {
        const fileExt = newImageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        await supabase.storage.from(bucketName).upload(filePath, newImageFile);
        await supabase.storage.from(bucketName).remove([item.image_url]);
        updatedImagePath = filePath;
      }

      const { data } = await supabase
        .from('gallery')
        .update({
          title: item.title,
          description: item.description,
          image_url: updatedImagePath,
        })
        .eq('id', item.id)
        .select();

      setGallery(gallery.map((g) => (g.id === item.id ? data[0] : g)));
      setEditingImageId(null);
      setNewImageFile(null);
      setLoading(false);
      Swal.fire('Berhasil', 'Gambar berhasil diperbarui!', 'success');
    } catch (err) {
      setLoading(false);
      Swal.fire('Gagal', 'Terjadi kesalahan saat memperbarui.', 'error');
    }
  };

  const getImageUrl = (path) => {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    return data?.publicUrl || '';
  };
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen text-white p-6">
            <div className="p-2"></div>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center tracking-wide">
          🖼️ Galeri Admin
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-xl shadow-xl mb-8 space-y-4"
        >
          <input
            type="text"
            placeholder="Judul"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg text-black"
          />
          <textarea
            placeholder="Deskripsi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg text-black"
          />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg"
          >
            {loading ? 'Mengupload...' : 'Tambah Gambar'}
          </button>
        </form>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 p-4 rounded-2xl shadow-xl"
            >
              {editingImageId === item.id ? (
                <form onSubmit={(e) => handleUpdate(e, item)} className="space-y-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      setGallery(
                        gallery.map((g) =>
                          g.id === item.id ? { ...g, title: e.target.value } : g
                        )
                      )
                    }
                    className="w-full px-3 py-2 rounded text-black"
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) =>
                      setGallery(
                        gallery.map((g) =>
                          g.id === item.id ? { ...g, description: e.target.value } : g
                        )
                      )
                    }
                    className="w-full px-3 py-2 rounded text-black"
                  />
                  <input type="file" onChange={(e) => setNewImageFile(e.target.files[0])} />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-yellow-500 hover:bg-yellow-600 px-4 py-1 rounded"
                    >
                      {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingImageId(null)}
                      className="bg-gray-600 px-4 py-1 rounded"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <img
                    src={getImageUrl(item.image_url)}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="text-lg font-semibold text-center">{item.title}</h3>
                  <p className="text-sm text-gray-300 text-center italic">{item.description}</p>
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.image_url)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="w-12 h-12 border-t-4 border-b-4 border-green-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
