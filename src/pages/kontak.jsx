import React, { useEffect } from 'react';
import Navbar from '../components/navbar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaInstagram,
  FaMapMarkerAlt,
} from 'react-icons/fa';

export default function Contact() {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1
          className="text-4xl font-bold text-center mb-8"
          data-aos="fade-down"
        >
          Kontak Kami
        </h1>

        <p
          className="text-center text-gray-700 mb-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Kami siap membantu Anda! Silakan hubungi kami melalui saluran berikut:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email */}
          <div
            className="flex items-center bg-white p-6 rounded-lg shadow-md"
            data-aos="zoom-in"
          >
            <FaEnvelope className="text-green-500 text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Email</h2>
              <a
                href="satriaseptian724@gmail.com"
                className="text-gray-700 hover:text-green-600"
              >
                satriaseptian724@gmail.com
            </a>
            </div>
          </div>

          {/* Telepon */}
          <div
            className="flex items-center bg-white p-6 rounded-lg shadow-md"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <FaPhone className="text-green-500 text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Telepon</h2>
              <a
                href="tel:+62 838 7972 1579"
                className="text-gray-700 hover:text-green-600"
              >
                +62 838 7972 1579
              </a>
            </div>
          </div>

          {/* WhatsApp */}
          <div
            className="flex items-center bg-white p-6 rounded-lg shadow-md"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <FaWhatsapp className="text-green-500 text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-semibold">WhatsApp</h2>
              <a
                href="https://wa.me/6283879721579"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-green-600"
              >
                Chat via WhatsApp
              </a>
            </div>
          </div>

          {/* Instagram */}
          <div
            className="flex items-center bg-white p-6 rounded-lg shadow-md"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <FaInstagram className="text-green-500 text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Instagram</h2>
              <a
                href="https://instagram.com/rezasatriaseptian._"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-green-600"
              >
                @rezasatriaseptian._
              </a>
            </div>
          </div>

          {/* Alamat */}
          <div
  className="flex items-center bg-white p-6 rounded-lg shadow-md md:col-span-2"
  data-aos="zoom-in"
  data-aos-delay="400"
>
  <FaMapMarkerAlt className="text-green-500 text-3xl mr-4" />
  <div>
    <h2 className="text-xl font-semibold">Alamat</h2>
    <a
      href="https://www.google.com/maps/search/?api=1&query=SMK%20Infokom%20Kota%20Bogor%2C%20Jl.%20Letjen%20Ibrahim%20Adjie%20No.178%2C%20RT.03%2FRW.08%2C%20Sindangbarang%2C%20Kec.%20Bogor%20Bar.%2C%20Kota%20Bogor%2C%20Jawa%20Barat%2016117"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-700 hover:text-green-600"
    >
      SMK Infokom Kota Bogor, <br />
      Jl. Letjen Ibrahim Adjie No.178, RT.03/RW.08, Sindangbarang, <br />
      Kec. Bogor Bar., Kota Bogor, Jawa Barat 16117
    </a>
  </div>
</div>

        </div>
      </div>
    </div>
  );
}
