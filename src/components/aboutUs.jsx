// src/components/AboutUs.jsx
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const sections = [
  {
    title: 'Tentang Kami',
    text: 'MotorClub didirikan pada tahun 2010 dengan tujuan menjadi wadah bagi para pecinta otomotif di Indonesia. Kami terus berkembang dan kini memiliki ribuan anggota aktif yang rutin berkegiatan bersama.',
    img: '/assets/image/anjay1.jpg',
    bulletColor: 'bg-green-500',
  },
  {
    title: 'Visi',
    text: 'Menjadi komunitas otomotif terdepan di Indonesia yang menginspirasi generasi muda untuk berkendara dengan aman dan penuh semangat kebersamaan.',
    img: '/assets/image/anjay2.jpg',
    bulletColor: 'bg-blue-500',
  },
  {
    title: 'Misi',
    text: '1. Mengedukasi anggota tentang keselamatan berkendara.\n2. Mengadakan kegiatan sosial untuk membantu masyarakat.\n3. Meningkatkan kolaborasi antar-komunitas otomotif.',
    img: '/assets/image/anjay3.jpg',
    bulletColor: 'bg-yellow-500',
  },
];

export default function AboutUs() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="relative bg-white py-16">
      {/* Vertical line */}
      <div className="absolute left-1/2 transform -translate-x-1/4 h-full w-1 bg-gray-200" />

      <div className="max-w-5xl mx-auto space-y-20">
        {sections.map((sec, idx) => {
          const isEven = idx % 2 === 3; // Tentukan apakah index genap atau ganjil
          return (
            <div key={sec.title} className="flex flex-col md:flex-row items-center w-full">
              {/* Bullet */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white" style={{ backgroundColor: sec.bulletColor }} />

              {/* Gambar dan Teks */}
              <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-8' : 'md:pr-8'} mb-6 md:mb-0`} data-aos={isEven ? 'fade-right' : 'fade-left'}>
                <img
                  src={sec.img}
                  alt={sec.title}
                  className="w-full h-auto rounded-2xl shadow-lg object-cover"
                />
              </div>

              {/* Teks */}
              <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-8' : 'md:pl-8'} px-6 md:px-8`} data-aos={isEven ? 'fade-left' : 'fade-right'}>
                <h3 className="text-2xl font-bold mb-4">{sec.title}</h3>
                <p className="text-gray-700 whitespace-pre-line">{sec.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
