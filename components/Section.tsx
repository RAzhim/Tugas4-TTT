import React from 'react';

interface SectionProps {
    title: string;
    children: React.ReactNode;
    id?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, id }) => {
    return (
        <section id={id} className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700 scroll-margin-top-20">
            <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-teal-500 pb-2">{title}</h2>
            <div className="text-gray-300 leading-relaxed">
                {children}
            </div>
        </section>
    );
};

export default Section;