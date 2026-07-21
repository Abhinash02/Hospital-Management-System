import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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

  const bannerImages = [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=1920&q=80",
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1920&q=80",
    
  ];

  const practiceAreas = [
    { title: "Neurology", img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=400&q=80", desc: "Brain & nervous system." },
    { title: "Orthopedics", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80", desc: "Bone & joint treatments." },
    { title: "Pediatrics", img: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&w=400&q=80", desc: "Child health specialists." },
    { title: "Oncology", img: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=400&q=80", desc: "Comprehensive cancer care." }
  ];

  const healthPackages = [
    {
      title: 'Healthy Heart Package',
      desc: 'Heart-focused screening to assess key risk markers and heart health.',
      img: 'https://stgaccinwbsprdlrs02.blob.core.windows.net/corporatewebsite/health-packages/January2026/kTxGxHcreRtQkmEspAyE.webp'
    },
    {
      title: 'Wellness 360 Health Check Package',
      desc: 'Comprehensive health check covering major systems and key markers.',
      img: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Special Screening Packages',
      desc: 'Renal/kidney, diabetes, rheumatology, urology, liver, spine and stroke-risk screening packages.',
      img: 'https://stgaccinwbsprdlrs02.blob.core.windows.net/corporatewebsite/health-packages/January2026/i8AH8LC43wNogsE0xP1N.webp'
    }
  ];

  const testimonials = [
    {
      name: 'Priyanka',
      text: 'Best cosmetic surgeon in Chandigarh. Highly recommend Mukat Hospital for Cosmetic surgery.',
      stars: 5
    },
    {
      name: 'Arun',
      text: 'Doctors at Mukat Hospital are dedicated to their work. Excellent healthcare services.',
      stars: 5
    },
    {
      name: 'Rohit',
      text: 'Excellent hospital centre with highly experienced team of specialist doctors and complete medical diagnosis facilities.',
      stars: 5
    }
  ];

  const marqueeTestimonials = [...testimonials, ...testimonials];
  const [practiceIndex, setPracticeIndex] = useState(0);
  const practiceSliderData = [...practiceAreas, ...practiceAreas];
  const practiceCardWidth = 280;
  const practiceGap = 32; // tailwind gap-8
  const practiceStep = practiceCardWidth + practiceGap;

  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((current) => (current + 1) % testimonials.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPracticeIndex((current) => (current + 1) % practiceAreas.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [practiceAreas.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((current) => (current + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <div className="bg-white">
      {/* Top Image / Video Banner Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        {/* Placeholder for a video or large hospital image */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src={bannerImages[bannerIndex]}
          alt="Medpark Hospital Exterior"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          key={bannerIndex}
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

      {/* Practice Areas Slider Section */}
      <section className="py-20 bg-medical-light overflow-hidden">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-3xl font-bold text-medical-dark">Our Practice Areas & Expertise</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Comprehensive Healthcare Services under one roof. Your health, our priority.</p>
        </div>

        <div className="w-full relative">
          <div className="relative overflow-hidden py-4">
            <div
              className="flex gap-8 px-4"
              style={{
                transform: `translateX(-${practiceIndex * practiceStep}px)`,
                transition: 'transform 0.5s ease',
                width: `${practiceSliderData.length * practiceStep}px`
              }}
            >
              {practiceSliderData.map((area, idx) => (
                <div key={idx} className="min-w-[280px] max-w-[280px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex-shrink-0">
                  <img src={area.img} alt={area.title} className="w-full h-40 object-cover" />
                  <div className="p-5 text-center">
                    <h3 className="text-xl font-bold text-medical-dark mb-2">{area.title}</h3>
                    <p className="text-gray-600 text-sm">{area.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Health Packages Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm uppercase tracking-[0.35em] text-medical-blue font-semibold mb-3"
            >
              Recommended Health Packages
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-3xl font-bold text-medical-dark"
            >
              Designed by doctors for your care
            </motion.h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {healthPackages.map((packageItem, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 200, damping: 16 }}
                className="bg-medical-light rounded-3xl overflow-hidden shadow-xl border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={packageItem.img} alt={packageItem.title} className="h-full w-full object-cover transition-transform duration-700 ease-in-out hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-medical-dark mb-2">{packageItem.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{packageItem.desc}</p>
                  <button className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-medical-dark text-white text-sm font-semibold hover:bg-medical-blue transition-colors">
                    View All
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
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
                <motion.img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80"
                  alt="Hospital interior"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6 }}
                  className="rounded-2xl shadow-lg w-full h-64 object-cover mt-8"
                />
                <motion.img
                  src="https://stgaccinwbsprdlrs02.blob.core.windows.net/corporatewebsite/speciality-coe-contents/December2025/v7JGRjVsgAbroRXeBAa1.webp"
                  alt="Surgeons"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="rounded-2xl shadow-lg w-full h-64 object-cover"
                />
              </div>
              <motion.div
                animate={{ rotate: [10, 50, -40, 10] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-medical-blue text-white p-6 rounded-full shadow-2xl text-center border-4 border-white h-32 w-32 flex flex-col justify-center items-center"
              >
                <span className="text-3xl font-bold">20+</span>
                <span className="text-xs uppercase tracking-wider font-semibold">Years Exp</span>
              </motion.div>
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
              <motion.h2 variants={fadeUp} className="text-3xl md:text-3xl font-bold text-medical-dark mb-6 leading-tight">
                Dedicated to Saving Lives & Enhancing Health
              </motion.h2>

              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
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
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-medical-dark hover:bg-medical-blue text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all"
                >
                  Contact Us Today
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-15 bg-medical-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-5">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-3xl font-bold text-medical-dark">What Patients Say About Us</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Trusted patient feedback from across our hospital network.</p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white py-8">
            <motion.div
              className="flex gap-6 px-6"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            >
              {marqueeTestimonials.map((item, idx) => (
                <div key={idx} className="min-w-[250px] max-w-[300px] w-[30.666%] bg-medical-light rounded-3xl border border-gray-100 shadow-sm p-4 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-medical-dark">{item.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(item.stars)].map((_, starIndex) => (
                        <span key={starIndex}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">“{item.text}”</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
