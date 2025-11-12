import React from 'react';

const members = [
    { name: 'Wafda Azka Ananda', nim: '2310953043' },
    { name: 'Maulana hisyam Ramadhan', nim: '2310952008' },
    { name: 'Zikri Ahmad Syaifullah', nim: '2310952062' },
    { name: 'Rahmat Azhim Gemilang', nim: '2310953001' },
    { name: 'Muhammad Rhaka Aulia', nim: '2310953009' }
];

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 mt-12 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <h3 className="text-xl font-bold text-white text-center mb-4">Anggota Kelompok</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                    {members.map((member) => (
                        <div key={member.nim} className="bg-gray-700 p-3 rounded-lg">
                            <p className="font-semibold text-gray-200">{member.name}</p>
                            <p className="text-sm text-teal-400 font-mono">{member.nim}</p>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;