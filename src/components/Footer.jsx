import React from "react";
import { Heart } from "lucide-react";

const INSTAGRAM_HANDLE = "YOUR_INSTAGRAM_HANDLE"; // Replace this

const Footer = () => {
  return (
    <footer className="w-full py-4 bg-[#fcf9f5] border-t border-[#f2ede8] font-serif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Main line */}
        <div className="flex items-center justify-center text-sx">
          <span className="text-[#8c6b52]">Made with&nbsp;</span>

          {/* Smaller heart */}
          <Heart
            className="w-3.5 h-3.5 mx-1"
            fill="#e25555"
            stroke="#e25555"
            strokeWidth={1.3}
          />

          <span className="text-[#8c6b52]">&nbsp;by&nbsp;</span>

          {/* Ayush link */}
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8c6b52] hover:text-[#5b4030] no-underline transition duration-150"
            style={{ textDecoration: "none", color: "#8c6b52" }}
          >
            Ayush
          </a>
        </div>

        {/* Copyright line */}
        <p className="text-xs text-[#8c6b52] mt-1">
          © {new Date().getFullYear()} Ayush. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
