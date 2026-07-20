import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const practiceAreas = [
    { title: "Neurology", img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=400&q=80", desc: "Brain & nervous system." },
    { title: "Orthopedics", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80", desc: "Bone & joint treatments." },
    { title: "Pediatrics", img: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&w=400&q=80", desc: "Child health specialists." },
    { title: "Oncology", img: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=400&q=80", desc: "Comprehensive cancer care." }
  ];

  return (
    <div className="bg-white">
      {/* Top Image / Video Banner Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        {/* Placeholder for a video or large hospital image */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80"
          alt="Medpark Hospital Exterior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-lg"
          >
            The Global Standard for <br className="hidden md:block" /> Precision Healthcare
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex gap-4"
          >
            <Link
              to="/dashboard"
              className="bg-medical-blue hover:bg-medical-dark text-white font-bold py-4 px-10 rounded-full shadow-2xl transition-transform transform hover:scale-105 text-lg"
            >
              Book An Appointment
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white relative z-30 -mt-10 mx-4 md:mx-auto max-w-5xl rounded-2xl shadow-xl">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="p-4">
              <h2 className="text-4xl font-extrabold text-medical-blue mb-2">100+</h2>
              <p className="text-md font-semibold text-gray-700">Expert Doctors & Medical Staff</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-4">
              <h2 className="text-4xl font-extrabold text-medical-blue mb-2">99%</h2>
              <p className="text-md font-semibold text-gray-700">Patient Satisfaction is Our Success</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-4">
              <h2 className="text-4xl font-extrabold text-medical-blue mb-2">12+</h2>
              <p className="text-md font-semibold text-gray-700">Specialized Medical Departments</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Practice Areas Marquee Section */}
      <section className="py-20 bg-medical-light overflow-hidden">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-medical-dark">Our Practice Areas & Expertise</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Comprehensive Healthcare Services under one roof. Your health, our priority.</p>
        </div>

        <div className="w-full relative">
          <marquee behavior="scroll" direction="left" scrollamount="8" className="py-4">
            <div className="flex gap-8 px-4">
              {practiceAreas.map((area, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden min-w-[280px] w-[280px] flex-shrink-0 border border-gray-100">
                  <img src={area.img} alt={area.title} className="w-full h-40 object-cover" />
                  <div className="p-5 text-center">
                    <h3 className="text-xl font-bold text-medical-dark mb-2">{area.title}</h3>
                    <p className="text-gray-600 text-sm">{area.desc}</p>
                  </div>
                </div>
              ))}
              {/* Duplicate for infinite feel in marquee */}
              {practiceAreas.map((area, idx) => (
                <div key={idx + 5} className="bg-white rounded-xl shadow-md overflow-hidden min-w-[280px] w-[280px] flex-shrink-0 border border-gray-100">
                  <img src={area.img} alt={area.title} className="w-full h-40 object-cover" />
                  <div className="p-5 text-center">
                    <h3 className="text-xl font-bold text-medical-dark mb-2">{area.title}</h3>
                    <p className="text-gray-600 text-sm">{area.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </marquee>
        </div>
      </section>

      {/* Attractive About Us Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Image Grid Side */}
            <motion.div
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80" alt="Hospital interior" className="rounded-2xl shadow-lg w-full h-64 object-cover mt-8" />
                <img src="https://images.unsplash.com/photo-1538108149393-cebb60e513ce?w=800&q=80" alt="Surgeons" className="rounded-2xl shadow-lg w-full h-64 object-cover" />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-medical-blue text-white p-6 rounded-full shadow-2xl text-center border-4 border-white h-32 w-32 flex flex-col justify-center items-center">
                <span className="text-3xl font-bold">20+</span>
                <span className="text-xs uppercase tracking-wider font-semibold">Years Exp</span>
              </div>
            </motion.div>

            {/* Text Side */}
            <motion.div
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h3 variants={fadeUp} className="text-medical-blue font-extrabold uppercase tracking-widest mb-3 text-sm">
                About Medpark Hospital
              </motion.h3>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-medical-dark mb-6 leading-tight">
                Dedicated to Saving Lives & Enhancing Health
              </motion.h2>

              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <motion.p variants={fadeUp}>
                  At <strong className="text-medical-dark">Medpark Hospital</strong>, the best hospital in Mohali, our mission is to provide exceptional,
                  patient-centered healthcare with compassion, integrity, and medical excellence.
                </motion.p>
                <motion.p variants={fadeUp}>
                  We strive to make advanced treatments accessible, affordable, and effective. Our team of highly skilled doctors
                  ensures the highest standards of care through cutting-edge technology, and a commitment to wellness
                  and prevention.
                </motion.p>

                <motion.div variants={fadeUp} className="bg-medical-gray p-6 rounded-xl border-l-4 border-medical-blue mt-6">
                  <p className="font-semibold text-medical-dark italic">
                    "Our goal is to heal, serve, and improve lives by delivering comprehensive and
                    innovative healthcare solutions for all."
                  </p>
                </motion.div>
              </div>

              <motion.div variants={fadeUp} className="mt-8">
                <Link
                  to="#contact"
                  className="inline-flex items-center gap-2 bg-medical-dark hover:bg-medical-blue text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all"
                >
                  Contact Us Today
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
