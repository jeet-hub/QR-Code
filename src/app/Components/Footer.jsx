import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-black text-orange-300">
      <div className="container mx-auto px-4 py-12">
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"> */}
          {/* About Section */}
          {/* <div>
            <h3 className="text-orange-500 font-bold text-lg mb-4">QR Code Generator</h3>
            <p className="text-sm text-orange-200">
              Fast, secure, and easy-to-use QR code generator. Create QR codes in seconds.
            </p>
          </div> */}

          {/* Quick Links */}
          {/* <div>
            <h4 className="text-orange-500 font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Features</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Pricing</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">FAQ</a></li>
            </ul>
          </div> */}

          {/* Contact Info */}
          {/* <div>
            <h4 className="text-orange-500 font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: info@qrcode.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Tech Street, Tech City</li>
            </ul>
          </div>
        </div> */}

        {/* Bottom Section */}
        <div className="border-t border-orange-600 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-orange-300">
          <p>&copy; 2026 QR Code Generator. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-orange-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-orange-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-orange-400 transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
