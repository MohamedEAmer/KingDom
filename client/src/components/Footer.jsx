import React from "react";
import {  Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="w-full text-gray-300 px-6 md:px-16 lg:px-36 mt-16">
      
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between gap-12 border-b border-gray-700 pb-12">

        {/* Left – Logo & Description */}
        <div className="max-w-xl">
          <img src="/AsdaLogo.png" alt="Asda 2 EvoL Logo" className="h-16 mb-3" />

          <p className="text-sm sm:text-base leading-relaxed text-justify">
            <span className="font-bold text-yellow-400">
              Asda 2 EvoL – Kingdom Of Secrets
            </span>{" "}
            is a game that blends fun, excitement, adventure, and competition.
            Bringing together memories of the past, challenges of the present,
            and a touch of the future. Join us and get ready to become the next hero!
          </p>

          {/* Social Media */}
          <div className="flex items-center gap-3 mt-5">
            <img
              src="/Discord button.png"
              alt="Discord"
              onClick={() =>
                window.open("https://discord.gg/mxpAXkUBvB", "_blank")
              }
              className="h-10 cursor-pointer rounded hover:opacity-80 transition"
            />

            <img
              src="/facebook3.png"
              alt="Facebook"
              onClick={() =>
                window.open(
                  "https://www.facebook.com/profile.php?id=100090236265537",
                  "_blank"
                )
              }
              className="h-10 cursor-pointer rounded hover:opacity-80 transition"
            />
          </div>
        </div>

        {/* Right – Info */}
        <div className="flex flex-col justify-end text-sm space-y-2">
          <p>ASDA 2 EVOL © 2025–2026</p>
          <p className="text-gray-400 flex items-center gap-1">
            The First Project For The Best Players
            <Heart className="w-4 h-4 fill-red-500 text-red-500 animate-pulse" />
          </p>
        </div>

      </div>

      {/* Bottom Section */}
      <p className="text-center text-xs sm:text-sm py-5 text-gray-400">
        Copyright © {new Date().getFullYear()}{" "}
        <a
          href="https://www.facebook.com/profile.php?id=100090277123511"
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 hover:text-yellow-300 transition"
        >
          Kingdom Of Secrets Team
        </a>
        . All Rights Reserved.
      </p>

    </footer>
  );
};

export default Footer;
