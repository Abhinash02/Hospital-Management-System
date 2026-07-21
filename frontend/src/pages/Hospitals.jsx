import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const hospitalImages = [
    'https://ihttps://gomtithaparhospital.com/wp-content/uploads/2025/05/Gomti-Thapar-Hospital-Punjab.webp',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1200&q=80',
    'https://gomtithaparhospital.com/wp-content/uploads/2025/05/Gomti-Thapar-Hospital-Punjab.webp'
  ];

  const getHospitalImage = (index) => hospitalImages[index % hospitalImages.length];

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/hospitals');
        const data = await res.json();
        setHospitals(data);
      } catch (err) {
        setHospitals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto min-h-screen">
      <section className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm uppercase tracking-[0.4em] text-medical-blue font-semibold mb-4">
            Trusted Care Everywhere
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-medical-dark leading-tight">
            Our Hospital Network
          </h1>
          <p className="mt-5 text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
            Discover premium hospitals, cutting-edge facilities, and patient-first healthcare in every location. Explore our curated Medpark network with trusted services and modern care.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Cities served</p>
            <p className="mt-3 text-3xl font-bold text-medical-blue">12+</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Specialties</p>
            <p className="mt-3 text-3xl font-bold text-medical-blue">18</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Patient trust</p>
            <p className="mt-3 text-3xl font-bold text-medical-blue">4.9/5</p>
          </div>
        </motion.div>
      </section>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading hospitals...</div>
      ) : hospitals.length === 0 ? (
        <div className="text-center text-gray-500">No hospitals are available right now.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {hospitals.map((hospital, index) => (
            <motion.article
              key={hospital.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.4 }}
              className="group overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={getHospitalImage(index)}
                  alt={hospital.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-200">Premium Care</p>
                  <h2 className="mt-2 text-2xl font-bold">{hospital.name}</h2>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2 rounded-full bg-medical-blue/10 px-3 py-1 text-medical-blue font-semibold">
                    <span>Location</span>
                    <span className="text-white bg-medical-blue rounded-full px-2 py-0.5 text-[10px]">{hospital.location || 'Unknown'}</span>
                  </span>
                </div>

                <p className="text-gray-700 leading-relaxed min-h-[4.5rem]">
                  {hospital.description || 'Modern healthcare services with expert staff and compassionate support in every department.'}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-3xl bg-medical-light p-4 text-center">
                    <p className="text-sm text-gray-500">Beds</p>
                    <p className="mt-2 text-xl font-semibold text-medical-dark">{hospital.beds || '80+'}</p>
                  </div>
                  <div className="rounded-3xl bg-medical-light p-4 text-center">
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="mt-2 text-xl font-semibold text-medical-dark">{hospital.contact || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-full border border-medical-blue/20 bg-medical-blue/10 px-3 py-1 text-xs font-semibold text-medical-blue">24/7 Service</span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">Advanced ICU</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
