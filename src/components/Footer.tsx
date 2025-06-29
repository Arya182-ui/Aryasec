import React from 'react';
import { Shield, Heart, Github, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-green-400" />
              <span className="text-white font-bold text-lg">Arya Security</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Professional cybersecurity platform developed by Arya. Advanced tools for penetration testing, 
              vulnerability assessment, and security analysis. Built by security professionals, for security professionals.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Crafted with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>by Developer Arya for the cybersecurity community</span>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">Arya Security Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Arya Subdomain Finder</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Arya Port Scanner</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Arya Header Analyzer</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Arya SSL/TLS Tester</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Arya CORS Tester</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Arya CVE Dashboard</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Security Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://owasp.org" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-400 hover:text-green-400 transition-colors flex items-center space-x-1">
                  <span>OWASP</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://cve.mitre.org" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-400 hover:text-green-400 transition-colors flex items-center space-x-1">
                  <span>CVE Database</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://nvd.nist.gov" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-400 hover:text-green-400 transition-colors flex items-center space-x-1">
                  <span>NVD</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://portswigger.net" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-400 hover:text-green-400 transition-colors flex items-center space-x-1">
                  <span>PortSwigger</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Arya Security Platform. Developed by Arya for educational and professional security testing purposes.
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Arya182-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/ayush-gangwar-3b3526237/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:arya119000@gmail.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;