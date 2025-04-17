import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { motion } from 'framer-motion';

const MySwal = withReactContent(Swal);

const AdminPanel = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [shopLink, setShopLink] = useState('');

  const uploadImage = async () => {
    if (!imageFile) return null;
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('store')
      .upload(fileName, imageFile);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const publicUrl = supabase.storage
      .from('store')
      .getPublicUrl(fileName).data.publicUrl;

    return publicUrl;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!imageFile || !imageFile.type.startsWith('image/')) {
      MySwal.fire({
        icon: 'warning',
        title: 'File Gambar Tidak Valid',
        text: 'Silakan upload file gambar yang benar!',
      });
      return;
    }

    const imageUrl = await uploadImage();

    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price, image_url: imageUrl, shop_link: shopLink }]);

    if (error) {
      console.error('Error adding product:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Gagal Menambahkan Produk',
        text: 'Ada kesalahan saat menambahkan produk. Silakan coba lagi.',
      });
    } else {
      MySwal.fire({
        icon: 'success',
        title: 'Produk Berhasil Ditambahkan!',
        showConfirmButton: false,
        timer: 2000,
      });

      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      setShopLink('');
    }
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="container mx-auto px-4 py-12 bg-gray-900 min-h-screen"
  >
    <motion.h1
      className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-gray-300 to-gray-100 text-transparent bg-clip-text"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      Admin Produk
    </motion.h1>
  
    <motion.form
      onSubmit={handleAddProduct}
      className="max-w-xl mx-auto bg-gray-800 p-8 shadow-xl rounded-2xl border border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300">Nama Produk</label>
          <input
            type="text"
            className="w-full mt-2 p-3 border border-gray-600 bg-white text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
  
        <div>
          <label className="block text-sm font-semibold text-gray-300">Deskripsi</label>
          <textarea
            className="w-full mt-2 p-3 border border-gray-600 bg-white text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
  
        <div>
          <label className="block text-sm font-semibold text-gray-300">Harga</label>
          <input
            type="number"
            className="w-full mt-2 p-3 border border-gray-600 bg-white text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
  
        <div>
          <label className="block text-sm font-semibold text-gray-300">Upload Gambar</label>
          <input
            type="file"
            accept="image/*"
            className="w-full mt-2 p-2 border border-gray-600 bg-white text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            required
          />
        </div>
  
        <div>
          <label className="block text-sm font-semibold text-gray-300">Link Shopee</label>
          <input
            type="url"
            className="w-full mt-2 p-3 border border-gray-600 bg-white text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={shopLink}
            onChange={(e) => setShopLink(e.target.value)}
            required
          />
        </div>
  
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition duration-300 shadow-md"
        >
          Tambahkan Produk
        </motion.button>
      </div>
    </motion.form>
  </motion.div>
  
  );
};

export default AdminPanel;
