import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { supabase } from '../supabaseClient';  // pastikan sudah mengonfigurasi Supabase Client

const Store = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from Supabase
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
        <Navbar/>
      <h1 className="text-4xl font-bold text-center mb-8">Store</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-700 mt-2">{product.description}</p>
              <p className="text-gray-800 font-bold mt-4">Rp {product.price}</p>
              <a
                href={product.shop_link}  // link menuju Shopee atau marketplace lain
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 text-center bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                Beli Sekarang
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
