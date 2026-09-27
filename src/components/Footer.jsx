import React from 'react';
import { Music2, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Music2 className="text-violet-500 w-8 h-8" />
              <span className="font-bold text-2xl tracking-tighter text-white">reson.at</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Building a community of indie musicians, bathroom singers, and people who just love good acoustic vibes. 
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://www.instagram.com/reson.at" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-violet-500 flex items-center gap-2 transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-violet-500 flex items-center gap-2 transition-colors">
                  <Mail className="w-4 h-4" /> Email Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-3">Get notified about the next Jam Junction.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-violet-500 text-white"
              />
              <button className="bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-r-lg text-white transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} reson.at. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
