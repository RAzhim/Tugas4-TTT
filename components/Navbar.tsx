import React, { useState } from 'react';

const navItems = [
    { href: '#bab-1', label: '1. Konsep Dasar' },
    { href: '#bab-2', label: '2. Rangkaian Marx' },
    { href: '#bab-3', label: '3. Analisis Rangkaian' },
    { href: '#bab-4', label: '4. Faktor Kinerja' },
    { href: '#bab-5', label: '5. Aplikasi' },
    { href: '#bab-6', label: '6. Keselamatan' },
    { href: '#bab-7', label: '7. Simulasi' },
    { href: '#bab-8', label: '8. Kalkulator' },
];

const NavLink: React.FC<{ href: string; children: React.ReactNode; onClick?: () => void }> = ({ href, children, onClick }) => (
    <a 
      href={href} 
      onClick={onClick}
      className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
    >
        {children}
    </a>
);

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    
    const closeMenu = () => {
        setIsOpen(false);
    }

    return (
        <>
            {/* Mobile Nav - Hamburger button */}
            <div className="lg:hidden fixed top-0 right-0 p-4 z-50">
                 <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {/* Icon for hamburger */}
                    <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    {/* Icon for close */}
                    <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
             {/* Mobile Nav - Menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} lg:hidden fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-95 z-40 p-4 pt-20`}>
                 <div className="space-y-1">
                    {navItems.map(item => <NavLink key={item.href} href={item.href} onClick={closeMenu}>{item.label}</NavLink>)}
                </div>
            </div>


            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed top-0 left-0 h-screen w-64 bg-gray-800 shadow-xl z-30 overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-white">Daftar Isi</h2>
                    <p className="text-xs text-teal-400">Navigasi Cepat</p>
                </div>
                <nav className="mt-4 px-2 space-y-1">
                    {navItems.map(item => <NavLink key={item.href} href={item.href}>{item.label}</NavLink>)}
                </nav>
            </aside>
        </>
    );
};

export default Navbar;
