import React from "react";

const GameDetails = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6 py-20">
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center text-yellow-400 drop-shadow-lg">
        Game Links
      </h2>

      {/* Description */}
      <p className="text-center text-gray-300 mb-10 max-w-lg leading-relaxed">
        Here you can download the game using the links below. Please make sure
        your system meets the game requirements before downloading.
      </p>

      {/* Download Links */}
      <div className="flex flex-col md:flex-row flex-wrap gap-6 mb-8 w-full max-w-4xl justify-center">
        <a
          href="https://mega.nz/file/6m4UyQxB#fvqFWkhvUA9Mso-N0fE7idmT5tIYRYC1yjr2eyYRonU"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[220px] px-6 py-4 bg-red-600 hover:bg-red-700 rounded-lg shadow-lg text-center font-semibold transition-transform transform hover:scale-105"
        >
          💾 Download via MEGA
        </a>

        <a
          href="https://www.mediafire.com/file/4x0r9ea9rcp5wco/KingDomOfSecret-EvoL.rar/file"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[220px] px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg text-center font-semibold transition-transform transform hover:scale-105"
        >
          📦 Download via MediaFire
        </a>

        <a
          href="https://www.transfernow.net/dl/20260621AmBekNMt"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[220px] px-6 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg text-center font-semibold transition-transform transform hover:scale-105"
        >
          📦 Download via TransFare Now
        </a>

        <a
          href="https://drive.google.com/file/d/1bZ9uFs-toqAMBikpJNCNKuVQ7SnXzj-n/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[220px] px-6 py-4 bg-green-600 hover:bg-green-700 rounded-lg shadow-lg text-center font-semibold transition-transform transform hover:scale-105"
        >
          📦 Download via Google Drive
        </a>
      </div>
      {/* Description - 2 */}
      <p className="text-center text-gray-300 mb-5 max-w-lg leading-relaxed">
        Here you can join us in the game Social Media using the links below and be a member of our family. 
        Be ready and let the adventure begin.
      </p>

      {/* Social Media */}
      <div className="flex items-center gap-4 mt-4">
        <img
          src="/Discord button.png"
          onClick={() => window.open("https://discord.gg/mxpAXkUBvB", "_blank")}
          alt="Discord"
          className="h-12 w-auto cursor-pointer rounded-lg hover:scale-110 transition-transform"
        />
        <img
          src="/facebook3.png"
          alt="Facebook"
          onClick={() => window.open("https://www.facebook.com/profile.php?id=100090236265537", "_blank")}
          className="h-12 w-auto cursor-pointer rounded-lg hover:scale-110 transition-transform"
        />
      </div>

      {/* Footer Note */}
      <p className="text-gray-400 text-sm mt-10 max-w-md text-center leading-relaxed">
        Welcome in Asda 2 EvoL - Kingdom Of Secret Game.
      </p>
    </div>
  );
};

export default GameDetails;
