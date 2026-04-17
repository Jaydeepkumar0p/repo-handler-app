import { Link } from "react-router-dom";
import { Layers, Github, Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20 bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6">

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition">
              <Layers size={14} className="text-indigo-400" />
            </div>
            <span className="text-sm font-semibold">
              folio<span className="text-indigo-400">.</span>
            </span>
          </Link>

          {/* Contact Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">

            <a
              href="https://github.com/Jaydeepkumar0p"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-indigo-400 transition"
            >
              <Github size={14} />
              GitHub
            </a>

            <a
              href="https://linkedin.com/in/jaydeep-kumar-000b5424b"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-indigo-400 transition"
            >
              <Linkedin size={14} />
              LinkedIn
            </a>

            <a
              href="mailto:jaideepkr.0123@gmail.com"
              className="flex items-center gap-1 hover:text-indigo-400 transition"
            >
              <Mail size={14} />
              Email
            </a>

            <a
              href="tel:+919142803194"
              className="flex items-center gap-1 hover:text-indigo-400 transition"
            >
              <Phone size={14} />
              +91-9142803194
            </a>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border pt-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Jaydeep Kumar. All rights reserved.</p>
          <p>
            Built with <span className="text-indigo-400">React</span> +{" "}
            <span className="text-indigo-400">Node.js</span> +{" "}
            <span className="text-indigo-400">MongoDB</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
