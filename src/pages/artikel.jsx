import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setArticles(data);
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    const { data } = supabase.storage.from('image').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8 text-center" data-aos="fade-down">
          Daftar Artikel
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              data-aos="fade-up"
            >
              <img
                src={a.image?.startsWith('http') ? a.image : getImageUrl(a.image)}
                alt={a.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{a.title}</h2>
                <p className="text-gray-700">{a.content.substring(0, 150)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
