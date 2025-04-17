import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Transition } from '@headlessui/react';
import Swal from 'sweetalert2';

function Client() {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', comment: '' });
  const [clientPhoto, setClientPhoto] = useState(null);
  const [editingClientId, setEditingClientId] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading
  const bucketName = 'client';

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true); // Start loading
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setClients(data);
      setLoading(false); // Stop loading
    };

    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientPhoto) {
      Swal.fire('Gagal', 'Foto client belum dipilih!', 'error');
      return;
    }

    setLoading(true); // Show loading spinner

    const fileExt = clientPhoto.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, clientPhoto);

    if (uploadError) {
      setLoading(false);
      Swal.fire('Gagal', 'Upload foto gagal.', 'error');
      return;
    }

    const { data, error: insertError } = await supabase
      .from('clients')
      .insert([
        {
          name: newClient.name,
          comment: newClient.comment,
          photo_url: filePath,
        },
      ])
      .select();

    setLoading(false); // Stop loading

    if (!insertError) {
      setClients([data[0], ...clients]);
      setNewClient({ name: '', comment: '' });
      setClientPhoto(null);
      Swal.fire('Berhasil', 'Client berhasil ditambahkan!', 'success');
    } else {
      Swal.fire('Gagal', 'Gagal menambahkan client.', 'error');
    }
  };

  const handleDelete = async (id, photo_url) => {
    const confirm = await Swal.fire({
      title: 'Yakin hapus?',
      text: 'Data akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (confirm.isConfirmed) {
      setLoading(true); // Show loading spinner

      const { error: deleteError } = await supabase.from('clients').delete().eq('id', id);
      const { error: removeError } = await supabase.storage.from(bucketName).remove([photo_url]);

      setLoading(false); // Stop loading

      if (!deleteError && !removeError) {
        setClients(clients.filter((c) => c.id !== id));
        Swal.fire('Berhasil', 'Client telah dihapus.', 'success');
      } else {
        Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus.', 'error');
      }
    }
  };

  const handleEdit = (id) => {
    setEditingClientId(id);
    setClientPhoto(null);
  };

  const handleUpdate = async (e, client) => {
    e.preventDefault();
    let updatedPhotoPath = client.photo_url;

    try {
      setLoading(true); // Show loading spinner

      if (clientPhoto) {
        const fileExt = clientPhoto.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        await supabase.storage.from(bucketName).upload(filePath, clientPhoto);
        await supabase.storage.from(bucketName).remove([client.photo_url]);
        updatedPhotoPath = filePath;
      }

      const { data } = await supabase
        .from('clients')
        .update({
          name: client.name,
          comment: client.comment,
          photo_url: updatedPhotoPath,
        })
        .eq('id', client.id)
        .select();

      setClients(clients.map((c) => (c.id === client.id ? data[0] : c)));
      setEditingClientId(null);
      setClientPhoto(null);

      setLoading(false); // Stop loading
      Swal.fire('Berhasil', 'Client berhasil diperbarui!', 'success');
    } catch (err) {
      setLoading(false); // Stop loading
      Swal.fire('Gagal', 'Terjadi kesalahan saat memperbarui.', 'error');
    }
  };

  const getImageUrl = (path) =>
    supabase.storage.from(bucketName).getPublicUrl(path).data.publicUrl;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen text-white p-6">
      <div className='p-2'></div>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center tracking-wide">
          💬 Testimoni Client
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-xl shadow-xl mb-8 space-y-4 transition-all duration-300 animate-fade-in"
        >
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nama Client"
              value={newClient.name}
              onChange={(e) =>
                setNewClient({ ...newClient, name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              placeholder="Komentar Client"
              value={newClient.comment}
              onChange={(e) =>
                setNewClient({ ...newClient, comment: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="file"
              onChange={(e) => setClientPhoto(e.target.files[0])}
              className="w-full text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg transition duration-200"
          >
            {loading ? 'Menambahkan...' : 'Tambah Client'}
          </button>
        </form>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Transition
              key={client.id}
              appear
              show={true}
              enter="transition ease-out duration-300 transform"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
            >
              <div className="bg-gray-800 hover:scale-[1.02] transition-transform p-4 rounded-2xl shadow-xl">
                {editingClientId === client.id ? (
                  <form
                    onSubmit={(e) => handleUpdate(e, client)}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      value={client.name}
                      onChange={(e) =>
                        setClients(
                          clients.map((c) =>
                            c.id === client.id
                              ? { ...c, name: e.target.value }
                              : c
                          )
                        )
                      }
                      className="w-full px-3 py-2 rounded text-black"
                    />
                    <textarea
                      value={client.comment}
                      onChange={(e) =>
                        setClients(
                          clients.map((c) =>
                            c.id === client.id
                              ? { ...c, comment: e.target.value }
                              : c
                          )
                        )
                      }
                      className="w-full px-3 py-2 rounded text-black"
                    />
                    <input
                      type="file"
                      onChange={(e) => setClientPhoto(e.target.files[0])}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-yellow-500 hover:bg-yellow-600 px-4 py-1 rounded"
                      >
                        {loading ? 'Memperbarui...' : 'Simpan'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingClientId(null)}
                        className="bg-gray-600 px-4 py-1 rounded"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <img
                      src={getImageUrl(client.photo_url)}
                      alt={client.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-white shadow-md"
                    />
                    <h3 className="text-lg font-semibold text-center">
                      {client.name}
                    </h3>
                    <p className="text-xs text-center text-gray-400">
                      {new Date(client.created_at).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-sm text-center italic text-gray-300">
                      “{client.comment}”
                    </p>
                    <div className="flex justify-center gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(client.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(client.id, client.photo_url)
                        }
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                      >
                        Hapus
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Transition>
          ))}
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="w-12 h-12 border-t-4 border-b-4 border-green-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default Client;
  