import { motion } from 'framer-motion';

export default function CentreOfExcellence() {
  const centers = [
    { title: 'Heart Institute', desc: 'World-class cardiology care with advanced cath labs.', icon: '❤️' },
    { title: 'Neurosciences', desc: 'State-of-the-art brain & spine surgery facilities.', icon: '🧠' },
    { title: 'Orthopedics', desc: 'Joint replacement and sports medicine experts.', icon: '🦴' },
    { title: 'Oncology', desc: 'Comprehensive cancer care and radiation therapy.', icon: '🎗️' },
  ];

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <section className="max-w-4xl mx-auto text-center mb-14">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm uppercase tracking-[0.4em] text-medical-blue font-semibold mb-4"
        >
          Centre of Excellence
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-3xl font-extrabold text-medical-dark leading-tight"
        >
          Specialized care powered by expertise
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-gray-600 text-base md:text-lg"
        >
          Our dedicated centers bring together top medical professionals, cutting-edge technology, and research to provide the best specialized care.
        </motion.p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {centers.map((center, idx) => {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-medical-blue/10 text-4xl mb-6">
                {center.icon}
              </div>
              <h2 className="text-2xl font-bold text-medical-blue mb-3">{center.title}</h2>
              <p className="text-gray-600 leading-relaxed">{center.desc}</p>
              <button className="mt-6 inline-flex items-center text-sm font-semibold text-medical-dark hover:text-medical-blue transition-colors">
                Learn More →
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
