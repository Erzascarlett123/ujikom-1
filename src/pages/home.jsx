import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import AboutUs from '../components/aboutUs'
import { supabase } from '../supabaseClient';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchArticles();
    fetchEvents();
    fetchClients();
    fetchGalleries();
    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    setScrollProgress((scrollTop / docHeight) * 100);
  };

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching articles:', error);
    else setArticles(data);
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching events:', error);
    else setEvents(data);
  };

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching clients:', error);
    else setClients(data);
  };

  const fetchGalleries = async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching galleries:', error);
    else setGalleries(data);
  };

  const getImageUrl = (bucket, path) => {
    if (!path) return '';
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  // ambil 3 teratas
  const topArticles = articles.slice(0, 3);
  const topEvents   = events.slice(0, 3);
  const topClients  = clients.slice(0, 3);
  const topGalleries= galleries.slice(0, 3);

  return (
    <div className="bg-gray-400 min-h-screen">
      {/* Scroll Progress */}
      <div
        className="fixed top-0 left-0 h-1 bg-green-500 z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      {/* Hero */}
      <section
        className="relative h-screen bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: 'url("/assets/image/bg-biker.png")' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="z-10 text-center" data-aos="fade-down">
          <h1 className="text-5xl font-bold">Selamat Datang di MotorClub</h1>
          <p className="mt-4 text-xl">Komunitas Otomotif Terbesar di Indonesia</p>
        </div>
      </section>

      <AboutUs />

      <div className='p-8 bg-white'></div>

      {/* Galeri */}
<section className="py-12 px-6 bg-gray-100">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-6" data-aos="zoom-in">
      Galeri Kegiatan
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {topGalleries.map((g, i) => (
        <div key={i} className="relative group rounded-xl overflow-hidden shadow-md" data-aos="zoom-in-up">
          <img
            src={getImageUrl('gallery', g.image_url)}
            alt={g.title || 'Gallery'}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-lg">
            {g.title || 'Galeri'}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* Artikel */}
<section className="py-12 px-6 bg-white border-t border-gray-200">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-6" data-aos="zoom-in">
      Artikel Terbaru
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topArticles.map((a, i) => {
        const src = a.image?.startsWith('http') ? a.image : getImageUrl('image', a.image);
        return (
          <div key={i} className="relative bg-white rounded-lg shadow-xl border border-2 overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-lg" data-aos="fade-up">
            <img src={src} alt={a.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
              <p className="text-gray-700">{a.content.substring(0, 100)}...</p>
            </div>
            <div className="absolute -top-2 -right-2 bg-black text-white px-3 py-1 text-xs rounded-bl-lg">
              Artikel
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

{/* Event */}
<section className="py-12 px-6 bg-gradient-to-br from-blue-50 to-blue-100 border-t border-gray-300">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-6" data-aos="zoom-in">
      Event Mendatang
    </h2>
    <div className="flex flex-col gap-6">
      {topEvents.map((e, i) => {
        const src = e.photo_url?.startsWith('http') ? e.photo_url : getImageUrl('event', e.photo_url);
        return (
          <div key={i} className="flex flex-col md:flex-row gap-4 items-start bg-white border border-2 rounded-xl shadow-xl p-4" data-aos="fade-up">
            <img src={src} alt={e.title} className="w-full md:w-1/3 h-40 object-cover rounded-md" />
            <div className="md:ml-4 mt-2 md:mt-0">
              <h3 className="text-xl font-bold mb-2">{e.title}</h3>
              <p className="text-gray-700">{e.description.substring(0, 100)}...</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

{/* Klien */}
<section className="py-12 px-6 bg-white border-t border-gray-200">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-6" data-aos="zoom-in">
      Klien Kami
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {topClients.map((c, i) => {
        const src = c.photo_url?.startsWith('http') ? c.photo_url : getImageUrl('client', c.photo_url);
        return (
          <div key={i} className="bg-white rounded-xl shadow-xl border border-2 p-4 text-center grayscale hover:grayscale-0 transition-all" data-aos="zoom-in-up">
            <img
              src={src}
              alt={c.name}
              className="w-24 h-24 mx-auto object-cover rounded-full mb-2"
            />
            <p className="font-medium text-sm">{c.name}</p>
          </div>
        );
      })}
    </div>
  </div>
</section>
<div className='p-8 bg-white'></div>
    </div>
  );
}
