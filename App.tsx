import React from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Section from './components/Section';
import Simulator from './components/Simulator';
import Calculator from './components/Calculator';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <Navbar />
      <div className="lg:ml-64">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl space-y-12">
          
          <Section title="1. Konsep Dasar Tegangan Tinggi Impuls" id="bab-1">
            <h3 className="text-lg font-semibold text-teal-400 mb-2">A. Definisi:</h3>
            <p>Tegangan tinggi impuls (Impulse Voltage) adalah suatu bentuk gelombang tegangan transien yang naik dengan sangat cepat ke nilai puncaknya dan kemudian meluruh secara lebih lambat ke nilai nol. Gelombang ini mensimulasikan fenomena alam seperti sambaran petir dan gangguan surja di sistem tenaga listrik.</p>
            
            <h3 className="text-lg font-semibold text-teal-400 mt-4 mb-2">B. Standar Gelombang Impuls (Menurut IEC 60060-1 dan IEEE Std 4):</h3>
            <p>Bentuk gelombang impuls distandarisasi untuk memastikan konsistensi dalam pengujian. Bentuk gelombang dinyatakan dengan waktu hadap (front time) dan waktu setengah peluruhan (time to half-value).</p>
            <ul className="list-disc list-inside mt-2 space-y-2 pl-4">
              <li><b>Gelombang Impuls Petir Standar (Lightning Impulse):</b> Simbol: 1.2/50 µs. Artinya gelombang naik ke puncak dalam waktu 1.2 mikrodetik dan meluruh hingga setengah nilai puncaknya dalam waktu 50 mikrodetik.</li>
              <li><b>Gelombang Impuls Sambaran (Switching Impulse):</b> Simbol: 250/2500 µs. Artinya gelombang naik ke puncak dalam waktu 250 mikrodetik dan meluruh hingga setengah nilai puncaknya dalam waktu 2500 mikrodetik.</li>
            </ul>

             <h3 className="text-lg font-semibold text-teal-400 mt-4 mb-2">C. Parameter Penting:</h3>
             <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                <li><b>Puncak Tegangan (Vp):</b> Nilai maksimum tegangan.</li>
                <li><b>Waktu Hadap (Front Time, T1):</b> Waktu yang dibutuhkan untuk naik dari 30% ke 90% dari Vp, dikalikan 1.67 (secara teoritis).</li>
                <li><b>Waktu Setengah Peluruhan (Tail Time, T2):</b> Waktu dari saat awal gelombang hingga tegangan meluruh ke 50% dari Vp.</li>
             </ul>
          </Section>

          <Section title="2. Prinsip Pembangkitan: Rangkaian Pengganda Marx" id="bab-2">
            <p>Rangkaian Marx adalah metode yang paling umum dan efisien untuk menghasilkan tegangan impuls tinggi. Prinsip kerjanya adalah "Charge in Parallel, Discharge in Series" (Mengisi secara paralel, Melepaskan secara seri).</p>
            <h3 className="text-lg font-semibold text-teal-400 mt-4 mb-2">A. Komponen Utama Rangkaian Marx:</h3>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                <li><b>Kapasitor Tahapan (C):</b> Sejumlah kapasitor yang identik.</li>
                <li><b>Resistor Pengisi (Rc):</b> Untuk membatasi arus saat pengisian kapasitor.</li>
                <li><b>Resistor Depan & Ekor (Rf & Rt):</b> Untuk membentuk gelombang impuls (mengontrol T1 dan T2).</li>
                <li><b>Celah Percikan (Spark Gap, G):</b> Berfungsi sebagai saklar berkecepatan tinggi.</li>
                <li><b>Sumber Tegangan DC (Vdc):</b> Sumber pengisian awal.</li>
            </ul>
             <h3 className="text-lg font-semibold text-teal-400 mt-4 mb-2">B. Prinsip Kerja:</h3>
             <p>Pertama, semua kapasitor diisi secara paralel oleh sumber DC. Kemudian, celah percikan pertama dipicu, yang menyebabkan efek domino di mana semua celah percikan lainnya menyala. Hal ini secara efektif menghubungkan semua kapasitor secara seri, sehingga tegangan di setiap kapasitor dijumlahkan dan dilepaskan ke beban sebagai satu pulsa tegangan tinggi.</p>
          </Section>

          <Section title="3. Analisis Rangkaian Pembentuk Gelombang" id="bab-3">
            <p>Setelah semua celah Marx menyala, rangkaian dapat disederhanakan menjadi rangkaian ekuivalen untuk analisis.</p>
             <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                <li><b>C1:</b> Kapasitansi total dari bank kapasitor Marx yang terhubung seri.</li>
                <li><b>C2:</b> Kapasitansi beban (object under test).</li>
                <li><b>R1 (Rf):</b> Resistor depan, mengontrol kemiringan naik gelombang (T1).</li>
                <li><b>R2 (Rt):</b> Resistor ekor, mengontrol kemiringan turun gelombang (T2).</li>
            </ul>
            <p className="mt-2">Dengan memilih nilai C1, C2, R1, dan R2 yang tepat, bentuk gelombang 1.2/50 µs atau 250/2500 µs dapat dihasilkan.</p>
          </Section>

          <Section title="4. Faktor yang Mempengaruhi Kinerja" id="bab-4">
            <ul className="list-disc list-inside mt-2 space-y-2 pl-4">
                <li><b>Induktansi Parasitik:</b> Kabel, kapasitor, dan celah percikan memiliki induktansi yang dapat memperlambat waktu naik dan menyebabkan osilasi.</li>
                <li><b>Konsistensi Celah Percikan:</b> Waktu tunda penyalaan yang tidak konsisten dapat menyebabkan bentuk gelombang yang tidak stabil.</li>
                <li><b>Korona (Corona Discharge):</b> Pelepasan muatan ke udara dapat menyebabkan kehilangan energi dan distorsi gelombang.</li>
                <li><b>Jumlah Tahapan:</b> Semakin banyak tahapan, semakin tinggi tegangan, tetapi juga semakin kompleks.</li>
            </ul>
          </Section>

          <Section title="5. Aplikasi dan Penggunaan" id="bab-5">
            <p>Pembangkit tegangan tinggi impuls sangat penting dalam:</p>
            <ul className="list-disc list-inside mt-2 space-y-2 pl-4">
                <li><b>Pengujian Isolasi (Insulation Testing):</b> Menguji kekuatan dielektrik dari transformator, pemutus tenaga, kabel, dan isolator.</li>
                <li><b>Riset dan Pengembangan:</b> Mempelajari fenomena breakdown pada material isolasi baru.</li>
                <li><b>Simulasi Sambaran Petir:</b> Memvalidasi desain sistem proteksi petir.</li>
            </ul>
          </Section>

          <Section title="6. Keselamatan Kerja" id="bab-6">
            <p>Bekerja dengan tegangan tinggi sangat berbahaya dan memerlukan protokol keselamatan yang ketat:</p>
            <ul className="list-disc list-inside mt-2 space-y-2 pl-4">
                <li><b>Penguncian dan Pemberian Tag (Lockout-Tagout):</b> Pastikan sumber daya dimatikan sebelum mendekati peralatan.</li>
                <li><b>Pembumian (Grounding):</b> Gunakan batang pembumian untuk menghilangkan muatan residual setelah pengujian.</li>
                <li><b>Jarak Aman (Safe Distance):</b> Selalu jaga jarak aman dari peralatan yang beroperasi.</li>
            </ul>
          </Section>
          
          <Section title="7. Simulasi Interaktif" id="bab-7">
            <Simulator />
          </Section>

          <Section title="8. Kalkulator Komponen" id="bab-8">
            <Calculator />
          </Section>

        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;