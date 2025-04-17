import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function GalleryPage() {
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setGalleries(data);
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    const { data } = supabase.storage.from('gallery').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8 text-center" data-aos="fade-down">
          Galeri Lengkap
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleries.map((g, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden shadow-md"
              data-aos="zoom-in-up"
            >
              <img
                src={getImageUrl(g.image_url)}
                alt={g.title || 'Gallery'}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
