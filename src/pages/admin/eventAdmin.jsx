import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';
import { Transition } from '@headlessui/react';

function Event() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', eventDate: '', description: '' });
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editEvent, setEditEvent] = useState({ title: '', eventDate: '', description: '', photoUrl: '' });
  const [editImage, setEditImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('events').select('*');
      setLoading(false);

      if (error) {
        Swal.fire('Error', 'Gagal mengambil data event', 'error');
      } else {
        setEvents(data);
      }
    };
    fetchEvents();
  }, []);

  const uploadImage = async (file) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('event').upload(fileName, file);
    
    if (error) {
      Swal.fire('Upload Gagal', error.message, 'error');
      return null;
    }
  
    const imageUrl = `https://jrltxpskhrqcubtxpewx.supabase.co/storage/v1/object/public/event/${fileName}`;
    return imageUrl;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return Swal.fire('Gagal', 'Pilih gambar terlebih dahulu!', 'warning');

    setLoading(true);
    const photoUrl = await uploadImage(image);
    if (!photoUrl) {
      setLoading(false);
      return;
    }

    const { title, eventDate, description } = newEvent;
    const { data, error } = await supabase.from('events').insert([
      {
        title,
        event_date: eventDate,
        description,
        photo_url: photoUrl,
      },
    ]);

    setLoading(false);

    if (error) {
      Swal.fire('Gagal', error.message, 'error');
    } else {
      Swal.fire('Berhasil', 'Event berhasil ditambahkan!', 'success');
      setEvents([data[0], ...events]);
      setNewEvent({ title: '', eventDate: '', description: '' });
      setImage(null);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Yakin hapus event ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (confirm.isConfirmed) {
      setLoading(true);
      const { error } = await supabase.from('events').delete().eq('id', id);
      setLoading(false);

      if (error) {
        Swal.fire('Error', error.message, 'error');
      } else {
        Swal.fire('Terhapus', 'Event berhasil dihapus!', 'success');
        setEvents(events.filter((event) => event.id !== id));
      }
    }
  };

  const handleEdit = (event) => {
    setEditId(event.id);
    setEditEvent({
      title: event.title,
      eventDate: event.event_date,
      description: event.description,
      photoUrl: event.photo_url,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    let photoUrl = editEvent.photoUrl;

    if (editImage) {
      const uploadedUrl = await uploadImage(editImage);
      if (uploadedUrl) photoUrl = uploadedUrl;
    }

    const { data, error } = await supabase
      .from('events')
      .update({ ...editEvent, photo_url: photoUrl })
      .eq('id', editId)
      .select();

    setLoading(false);

    if (error) {
      Swal.fire('Gagal', error.message, 'error');
    } else {
      Swal.fire('Berhasil', 'Event berhasil diperbarui!', 'success');
      setEvents(events.map((event) => (event.id === editId ? data[0] : event)));
      setEditId(null);
      setEditEvent({ title: '', eventDate: '', description: '', photoUrl: '' });
      setEditImage(null);
    }
  };

  const getImageUrl = (path) => {
    const { data, error } = supabase.storage.from('event').getPublicUrl(path);
    if (error) {
      Swal.fire('Error', 'Gagal mengambil URL gambar', 'error');
      return '';
    }
    console.log(data?.publicUrl);  // Menampilkan URL gambar di konsol
    return data?.publicUrl || '';
  };
  
  
  

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen text-white p-6">
      <div className='p-2'></div>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center tracking-wide">📅 Events</h2>

        {/* Add Event Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-xl mb-8 space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="date"
              value={newEvent.eventDate}
              onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
              className="w-full px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              placeholder="Event Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-sm"
            />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg">
            {loading ? 'Menambahkan...' : 'Tambah Event'}
          </button>
        </form>

        {/* Event List */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Transition
              key={event.id}
              appear
              show={true}
              enter="transition ease-out duration-300 transform"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
            >
              <div className="bg-gray-800 hover:scale-[1.02] transition-transform p-4 rounded-2xl shadow-xl">
                {editId === event.id ? (
                  <form onSubmit={handleUpdate} className="space-y-3">
                    <input
                      type="text"
                      value={editEvent.title}
                      onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                      className="w-full px-3 py-2 rounded text-black"
                    />
                    <input
                      type="date"
                      value={editEvent.eventDate}
                      onChange={(e) => setEditEvent({ ...editEvent, eventDate: e.target.value })}
                      className="w-full px-3 py-2 rounded text-black"
                    />
                    <textarea
                      value={editEvent.description}
                      onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
                      className="w-full px-3 py-2 rounded text-black"
                    />
                    <input
                      type="file"
                      onChange={(e) => setEditImage(e.target.files[0])}
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 px-4 py-1 rounded">
                        {loading ? 'Memperbarui...' : 'Simpan'}
                      </button>
                      <button type="button" onClick={() => setEditId(null)} className="bg-gray-600 px-4 py-1 rounded">
                        Batal
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                  <img
  src={event.photo_url}
  alt={event.title}
  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-white shadow-md"
/>


                    <h3 className="text-lg font-semibold text-center">{event.title}</h3>
                    <p className="text-xs text-center text-gray-400">{new Date(event.event_date).toLocaleDateString()}</p>
                    <p className="mt-2 text-sm text-center italic text-gray-300">“{event.description}”</p>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-green-500 hover:text-green-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Transition>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Event;
