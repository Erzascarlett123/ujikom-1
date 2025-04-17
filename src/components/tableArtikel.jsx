import React from "react";

export default function TableArtikel({ articles = [], onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Data Artikel</h2>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Gambar</th>
            <th className="p-2">Judul</th>
            <th className="p-2">Tanggal</th>
            <th className="p-2">Konten</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {articles.length > 0 ? (
            articles.map((article) => (
              <tr key={article.id} className="border-t align-top">
                <td className="p-2">
                  <img
                    src={
                      article.image
                        ? article.image // Pastikan artikel.image sudah berisi URL publik yang benar
                        : "/assets/image/default.jpg" // Gambar default jika tidak ada gambar
                    }
                    alt={article.title}
                    className="w-20 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-2">{article.title}</td>
                <td className="p-2">
                  {new Date(article.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="p-2 max-w-xs text-justify">
                  {article.content?.length > 100
                    ? article.content.substring(0, 100) + "..."
                    : article.content}
                </td>
                <td className="p-2 space-y-1">
                  <button
                    onClick={() => onEdit(article)}
                    className="bg-blue-500 px-3 py-1 text-white rounded hover:bg-blue-600 block"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(article.id)}
                    className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600 block"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                Tidak ada artikel.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
