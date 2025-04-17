// src/components/Auth.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // toggle antara login & register
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setMessage(error.message);
      setMessage('Berhasil login!');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return setMessage(error.message);
      setMessage('Berhasil daftar! Silakan cek email untuk verifikasi.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">{isLogin ? 'Login' : 'Register'}</h2>

      <form onSubmit={handleAuth} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-600">
        {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{' '}
        <button
          className="text-blue-500 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Daftar di sini" : "Login di sini"}
        </button>
      </p>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}
