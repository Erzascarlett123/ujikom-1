import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Logout otomatis saat masuk ke halaman login
    const logoutUser = async () => {
      await supabase.auth.signOut();
      localStorage.removeItem("user");
    };

    logoutUser();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Swal.fire({
        title: "Login Gagal",
        text: error.message || "Email atau password salah.",
        icon: "error",
      });
    } else if (data.session) {
      const userId = data.session.user.id;

      // Ambil data tambahan dari tabel users berdasarkan auth_id
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", userId)
        .single();

      if (userError || !userData) {
        Swal.fire({
          title: "Login Berhasil",
          text: "Namun data tambahan user tidak ditemukan.",
          icon: "warning",
        });
      } else {
        // Simpan ke localStorage jika diperlukan
        localStorage.setItem("user", JSON.stringify(userData));

        Swal.fire({
          title: "Login Berhasil!",
          text: `Halo, ${userData.full_name || 'User'} 👋`,
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md transition-transform duration-300 transform hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Welcome Back!
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Masukkan email dan password untuk login
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
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
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Daftar sekarang
          </a>
        </p>
      </div>
    </div>
  );
}
