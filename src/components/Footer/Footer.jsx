import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
        <div>
          <h3 className="text-lg font-semibold mb-4">Imdad Pharma</h3>
          <p className="text-sm">Committed to providing the best pharmaceutical products.</p>
          <div className="flex justify-center sm:justify-start mt-4 space-x-4">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaGithub className="text-2xl" />
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaLinkedin className="text-2xl" />
            </a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaTwitter className="text-2xl" />
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="text-sm space-y-2">
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/services" className="hover:underline">Our Services</a></li>
            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-center justify-center sm:justify-start"><FaPhoneAlt className="mr-2" /> (123) 456-7890</li>
            <li className="flex items-center justify-center sm:justify-start"><FaEnvelope className="mr-2" /> info@imdadpharma.com</li>
            <li className="flex items-center justify-center sm:justify-start"><FaMapMarkerAlt className="mr-2" /> 123 Pharma St, Karachi, Pakistan</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Subscribe to our Newsletter</h3>
          <form>
            <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 text-gray-800 rounded-lg mb-2" />
            <button type="submit" className="w-full bg-orange-700 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-300">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-4 text-center">
        <p className="text-sm">&copy; 2024 Abdullah Khan. All rights reserved.</p>
        <p className="mt-2 text-sm">Designed with <span role="img" aria-label="love">❤️</span> by Abdullah Khan</p>
      </div>
    </footer>
  );
}

export default Footer;
