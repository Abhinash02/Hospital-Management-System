import { motion } from 'framer-motion';

export default function Doctors() {
  const doctors = [
    { name: 'Dr. Sarah Jenkins', spec: 'Cardiologist', exp: '15 Years', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80' },
    { name: 'Dr. Michael Chen', spec: 'Neurologist', exp: '12 Years', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80' },
    { name: 'Dr. Emily Watson', spec: 'Pediatrician', exp: '10 Years', img: 'https://res.cloudinary.com/alumniimages/image/upload/v1781590474/alumni/rpjckqjnewnv20ybakzs.jpg' },
    { name: 'Dr. Robert Smith', spec: 'Orthopedic Surgeon', exp: '20 Years', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80' },
  ];

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <section className="max-w-4xl mx-auto text-center mb-14">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-[0.4em] text-medical-blue font-semibold mb-4"
        >
          Meet the specialists
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-3xl font-extrabold text-medical-dark leading-tight"
        >
          Our Doctors Deliver Compassionate, Expert Care
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-gray-600 text-base md:text-lg"
        >
          Trusted specialists across cardiology, neurology, pediatrics and orthopedics. Every physician brings years of experience, innovation, and personalized care.
        </motion.p>
      </section>

      <div className="flex flex-wrap justify-center gap-8">
        {doctors.map((doc, idx) => (
          <motion.article
            key={idx}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ duration: 0.4 }}
            className="group overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-xl min-w-[280px] max-w-[280px]"
          >
            <div className="relative overflow-hidden h-64">
              <img
                src={doc.img}
                alt={doc.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-200">Specialist</p>
                <h2 className="mt-2 text-2xl font-bold">{doc.name}</h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-medical-blue font-semibold text-lg">{doc.spec}</p>
                <p className="mt-2 text-gray-600">{doc.exp} of experience</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-3xl bg-medical-light p-3 text-center">
                  <p className="text-xs uppercase tracking-[0.1em] text-gray-500">Availability</p>
                  <p className="mt-2 text-lg font-semibold text-medical-dark">Mon-Fri</p>
                </div>
                <div className="rounded-3xl bg-medical-light p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Rating</p>
                  <p className="mt-2 text-lg font-semibold text-medical-dark">4.9/5</p>
                </div>
              </div>

              <button className="w-full rounded-3xl bg-medical-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-medical-blue/10 transition hover:bg-medical-dark">
                Book Appointment
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
