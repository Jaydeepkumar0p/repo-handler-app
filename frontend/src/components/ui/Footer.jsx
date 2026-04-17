import { Link } from "react-router-dom";
import { Layers, Github, Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 mt-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-6">

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Layers size={14} className="text-indigo-500" />
            </div>
            <span className="text-sm font-semibold">
              folio<span className="text-indigo-500">.</span>
            </span>
          </Link>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-gray-600">

            <a
              href="https://github.com/your-username"
              target="_blank"
              className="flex items-center gap-1 hover:text-indigo-500 transition"
            >
              <Github size={16} /> GitHub
            </a>

            <a
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              className="flex items-center gap-1 hover:text-indigo-500 transition"
            >
              <Linkedin size={16} /> LinkedIn
            </a>

            <a
              href="mailto:your@email.com"
              className="flex items-center gap-1 hover:text-indigo-500 transition"
            >
              <Mail size={16} /> Email
            </a>

            <a
              href="tel:+919142803194"
              className="flex items-center gap-1 hover:text-indigo-500 transition"
            >
              <Phone size={16} /> Call
            </a>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 border-t pt-4">
          <p>© {new Date().getFullYear()} Jaydeep Kumar. All rights reserved.</p>
          <p>Built with React + Node.js + MongoDB</p>
        </div>

      </div>
    </footer>
  );
}
