import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setEvents(data);
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    const { data } = supabase.storage.from('event').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8 text-center" data-aos="fade-down">
          Daftar Event
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((e) => (
            <div
              key={e.id}
              className="bg-gray-100 rounded-lg shadow-md overflow-hidden"
              data-aos="fade-up"
            >
              <img
                src={
                  e.photo_url?.startsWith('http')
                    ? e.photo_url
                    : getImageUrl(e.photo_url)
                }
                alt={e.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{e.title}</h2>
                <p className="text-gray-700 mb-2">{e.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(e.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
