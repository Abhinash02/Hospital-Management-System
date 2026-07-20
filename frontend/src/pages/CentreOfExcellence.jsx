import React from 'react';

export default function CentreOfExcellence() {
  const centers = [
    { title: 'Heart Institute', desc: 'World-class cardiology care with advanced cath labs.', icon: '❤️' },
    { title: 'Neurosciences', desc: 'State-of-the-art brain & spine surgery facilities.', icon: '🧠' },
    { title: 'Orthopedics', desc: 'Joint replacement and sports medicine experts.', icon: '🦴' },
    { title: 'Oncology', desc: 'Comprehensive cancer care and radiation therapy.', icon: '🎗️' },
  ];

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-4xl md:text-5xl font-extrabold text-medical-dark text-center mb-4">Centre of Excellence</h1>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
        Our dedicated centers bring together top medical professionals, cutting-edge technology, and research to provide the best specialized care.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {centers.map((center, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex gap-6">
            <div className="text-5xl">{center.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-medical-blue mb-2">{center.title}</h2>
              <p className="text-gray-600">{center.desc}</p>
              <button className="mt-4 text-sm font-bold text-medical-dark hover:text-medical-blue transition-colors">
                Learn More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
