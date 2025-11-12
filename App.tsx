import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Section from './components/Section';
import Simulator from './components/Simulator';
import Calculator from './components/Calculator';
import CircuitDiagram from './components/CircuitDiagram';

function App() {
  const [activeSection, setActiveSection] = useState('');
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px', // Trigger when the element is in the middle of the viewport
        threshold: 0
      }
    );

    const sections = mainContentRef.current?.querySelectorAll('section[id]');
    sections?.forEach((section) => observer.observe(section));

    return () => {
      sections?.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <Navbar activeSection={activeSection} />
      <div className="lg:pl-64" ref={mainContentRef}>
        <Header />
        <main className="container mx-auto p-4 md:p-8 max-w-4xl space-y-12">
          <Section title="1. Konsep Dasar Tegangan Impuls" id="bab-1">
            <p>
              Tegangan impuls adalah tegangan lebih sesaat yang naik dengan cepat ke nilai puncak dan kemudian turun lebih lambat ke nol. Gelombang ini digunakan di laboratorium tegangan tinggi untuk menyimulasikan efek petir dan surja hubung (switching surge) pada peralatan sistem tenaga listrik. Bentuk gelombang standar biasanya didefinisikan oleh waktu muka (T1) dan waktu ekor (T2), misalnya 1.2/50 µs, yang berarti waktu muka 1.2 µs dan waktu ekor (waktu hingga setengah nilai puncak) 50 µs.
            </p>
          </Section>

          <Section title="2. Rangkaian Pembangkit Impuls - Marx Generator" id="bab-2">
             <p>
              Pembangkit impuls Marx adalah rangkaian yang paling umum digunakan untuk menghasilkan tegangan impuls tinggi. Rangkaian ini terdiri dari beberapa kapasitor yang diisi secara paralel melalui resistor pengisi. Ketika tegangan pengisian mencapai nilai tertentu, sela api (spark gap) pertama tembus (breakdown), yang secara efektif menghubungkan kapasitor pertama secara seri dengan yang kedua. Efek domino ini berlanjut ke semua tingkat, menghubungkan semua kapasitor secara seri. Hasilnya adalah tegangan keluaran yang merupakan jumlah dari tegangan setiap kapasitor.
            </p>
          </Section>

          <Section title="3. Analisis Rangkaian Ekuivalen" id="bab-3">
            <p>
              Untuk analisis, rangkaian Marx yang kompleks dapat disederhanakan menjadi rangkaian ekuivalen satu tingkat seperti yang ditunjukkan di bawah ini.
            </p>
            <div className="my-4">
              <CircuitDiagram />
            </div>
            <ul className="list-disc pl-5 space-y-1">
                <li><b>C1 (Cs):</b> Kapasitansi generator ekuivalen, merupakan kapasitansi total dari semua kapasitor tingkat yang terhubung seri.</li>
                <li><b>C2 (Ca):</b> Kapasitansi beban, mewakili kapasitansi objek uji dan kapasitansi liar lainnya.</li>
                <li><b>R1 (Rs):</b> Resistor muka (front resistor) ekuivalen, mengontrol laju kenaikan tegangan (waktu muka).</li>
                <li><b>R2 (Rt):</b> Resistor ekor (tail resistor) ekuivalen, mengontrol laju peluruhan tegangan (waktu ekor).</li>
            </ul>
             <p className="mt-4">
              Tegangan keluaran V(t) dari rangkaian ini dapat diaproksimasi dengan fungsi selisih dua eksponensial:
              <br />
              <span className="font-mono text-teal-400 block text-center my-2">V(t) = V₀ * (e<sup>-αt</sup> - e<sup>-βt</sup>)</span>
              di mana α dan β adalah konstanta yang bergantung pada nilai R1, R2, C1, dan C2.
            </p>
          </Section>
          
          <Section title="4. Faktor Kinerja" id="bab-4">
            <p>
              Dua parameter penting yang menentukan kinerja pembangkit impuls adalah efisiensi (η) dan regulasi tegangan.
            </p>
             <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><b>Efisiensi (η):</b> Didefinisikan sebagai rasio tegangan puncak impuls keluaran (V_peak) terhadap tegangan total pengisian DC (n * V_dc). Efisiensi yang lebih tinggi berarti lebih sedikit energi yang hilang.
                <br/>
                <span className="font-mono text-teal-400 block text-center my-2">η = V_peak / (n * V_dc)</span>
                </li>
                <li><b>Regulasi Tegangan:</b> Menggambarkan seberapa baik generator mempertahankan tegangan puncaknya di bawah kondisi beban yang berbeda.</li>
            </ul>
          </Section>

          <Section title="5. Aplikasi" id="bab-5">
             <p>
              Pembangkit tegangan impuls digunakan secara luas untuk:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Pengujian isolasi peralatan tegangan tinggi seperti transformator, kabel, dan isolator.</li>
                <li>Penelitian fundamental tentang fenomena pelepasan muatan listrik (electrical discharge) di udara dan media isolasi lainnya.</li>
                <li>Simulasi efek sambaran petir pada struktur dan sistem proteksi petir.</li>
            </ul>
          </Section>

          <Section title="6. Keselamatan Kerja di Laboratorium" id="bab-6">
            <p>
              Bekerja dengan tegangan tinggi sangat berbahaya. Prosedur keselamatan yang ketat harus diikuti, termasuk:
            </p>
             <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Pentanahan (grounding) yang benar untuk semua peralatan dan objek uji.</li>
                <li>Penggunaan penghalang fisik dan sistem interlock untuk mencegah akses ke area bertegangan tinggi saat beroperasi.</li>
                <li>Prosedur pembuangan muatan sisa pada kapasitor setelah pengujian.</li>
                <li>Penggunaan Alat Pelindung Diri (APD) yang sesuai.</li>
            </ul>
          </Section>

          <Section title="7. Simulasi Interaktif" id="bab-7">
              <Simulator />
          </Section>

           <Section title="8. Kalkulator Parameter Gelombang" id="bab-8">
              <Calculator />
          </Section>

        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;