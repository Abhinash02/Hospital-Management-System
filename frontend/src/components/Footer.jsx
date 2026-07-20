import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-medical-dark text-white pt-16 pb-8 border-t-4 border-medical-blue">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-medical-blue font-bold text-xl">
                M
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                MEDPARK <span className="text-red-500 text-sm align-top ml-1">✚</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Delivering the global standard for precision healthcare. Your health is our top priority, and we are dedicated to saving lives and enhancing community wellness.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-medical-light transition-colors">Home</Link></li>
              <li><Link to="#about" className="hover:text-medical-light transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-medical-light transition-colors">Find a Doctor</Link></li>
              <li><Link to="#" className="hover:text-medical-light transition-colors">Book an Appointment</Link></li>
              <li><Link to="#" className="hover:text-medical-light transition-colors">Insurance</Link></li>
            </ul>
          </motion.div>

          {/* Departments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2">Departments</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="#" className="hover:text-medical-light transition-colors">Cardiology</Link></li>
              <li><Link to="#" className="hover:text-medical-light transition-colors">Neurology</Link></li>
              <li><Link to="#" className="hover:text-medical-light transition-colors">Orthopedics</Link></li>
              <li><Link to="#" className="hover:text-medical-light transition-colors">Pediatrics</Link></li>
              <li><Link to="#" className="hover:text-medical-light transition-colors">Oncology</Link></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-medical-blue mt-1">📍</span>
                <span>123 Health Avenue, Medical District,<br/>Mohali, PB 160055</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-medical-blue">📞</span>
                <span>+91 98767 69966</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-medical-blue">✉️</span>
                <span>contact@medpark.com</span>
              </li>
            </ul>
          </motion.div>

        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700 text-center md:flex md:justify-between md:items-center text-sm text-gray-400">
          <p>&copy; {currentYear} Medpark Hospital. All Rights Reserved.</p>
          <div className="flex justify-center space-x-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
