import React from 'react';

export default function Doctors() {
  const doctors = [
    { name: 'Dr. Sarah Jenkins', spec: 'Cardiologist', exp: '15 Years', img: 'https://placehold.co/300x400/eff6ff/1e40af?text=Dr.+Sarah+Jenkins' },
    { name: 'Dr. Michael Chen', spec: 'Neurologist', exp: '12 Years', img: 'https://placehold.co/300x400/eff6ff/1e40af?text=Dr.+Michael+Chen' },
    { name: 'Dr. Emily Watson', spec: 'Pediatrician', exp: '10 Years', img: 'https://placehold.co/300x400/eff6ff/1e40af?text=Dr.+Emily+Watson' },
    { name: 'Dr. Robert Smith', spec: 'Orthopedic Surgeon', exp: '20 Years', img: 'https://placehold.co/300x400/eff6ff/1e40af?text=Dr.+Robert+Smith' },
  ];

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-extrabold text-medical-dark text-center mb-4">Our Expert Doctors</h1>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
        Meet our team of highly qualified and experienced medical professionals dedicated to your health.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {doctors.map((doc, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group">
            <img src={doc.img} alt={doc.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-medical-dark mb-1">{doc.name}</h2>
              <p className="text-medical-blue font-semibold mb-2">{doc.spec}</p>
              <p className="text-gray-500 text-sm mb-4">Experience: {doc.exp}</p>
              <button className="w-full bg-medical-light text-medical-dark font-bold py-2 rounded-lg hover:bg-medical-blue hover:text-white transition-colors">
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
