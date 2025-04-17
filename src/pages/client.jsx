import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import { supabase } from '../supabaseClient';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setClients(data);
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    const { data } = supabase.storage.from('client').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8 text-center" data-aos="fade-down">
          Daftar Klien
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl shadow-md p-6 text-center"
              data-aos="zoom-in-up"
            >
              <img
                src={
                  c.photo_url?.startsWith('http')
                    ? c.photo_url
                    : getImageUrl(c.photo_url)
                }
                alt={c.name}
                className="w-32 h-32 mx-auto object-cover rounded-full mb-4"
              />
              <h2 className="font-semibold text-lg">{c.name}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
