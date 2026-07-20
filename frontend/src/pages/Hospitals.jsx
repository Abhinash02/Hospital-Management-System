import React from 'react';

export default function Hospitals() {
  const hospitals = [
    { name: 'Medpark Hospital Mohali', beds: '500+', img: 'https://placehold.co/500x300/eff6ff/1e40af?text=Medpark+Mohali', loc: 'Phase 8, Mohali, PB' },
    { name: 'Medpark City Center', beds: '250+', img: 'https://placehold.co/500x300/eff6ff/1e40af?text=Medpark+City+Center', loc: 'Sector 17, Chandigarh' },
    { name: 'Medpark South Clinic', beds: '100+', img: 'https://placehold.co/500x300/eff6ff/1e40af?text=Medpark+South+Clinic', loc: 'Zirakpur Road, PB' },
  ];

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-4xl md:text-5xl font-extrabold text-medical-dark text-center mb-4">Our Hospital Network</h1>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
        Find a Medpark facility near you. We operate multiple state-of-the-art hospitals and clinics across the region.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {hospitals.map((hospital, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <img src={hospital.img} alt={hospital.name} className="w-full h-56 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-medical-dark mb-2">{hospital.name}</h2>
              <p className="text-gray-600 mb-4 flex items-center gap-2"><span>📍</span> {hospital.loc}</p>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="font-semibold text-medical-blue">{hospital.beds} Beds</span>
                <button className="bg-medical-dark text-white px-4 py-2 rounded shadow hover:bg-medical-blue transition-colors text-sm font-bold">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
