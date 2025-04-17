import React, { useState } from "react";
import { supabase } from "../supabaseClient"; // Pastikan path sesuai
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      Swal.fire({
        title: "Oops!",
        text: signUpError.message,
        icon: "error",
        confirmButtonText: "Tutup",
      });
      setError(signUpError.message);
    } else if (data.user) {
      const auth_id = data.user.id;

      // Simpan data user ke tabel 'users'
      const { error: insertError } = await supabase.from("users").insert([
        {
          auth_id,
          email,
          full_name: null, // atau bisa kasih input tambahan kalau mau
        },
      ]);

      if (insertError) {
        console.error("Gagal menyimpan ke tabel users:", insertError.message);
      }

      Swal.fire({
        title: "Akun Berhasil Dibuat!",
        text: "Cek email Anda untuk verifikasi. Mengarahkan ke Gmail...",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        willClose: () => {
          window.location.href = "https://mail.google.com";
        },
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md transition-transform duration-300 transform hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Buat Akun
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Daftarkan akun baru untuk mulai bergabung
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition-all ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login sekarang
          </a>
        </p>
      </div>
    </div>
  );
}
