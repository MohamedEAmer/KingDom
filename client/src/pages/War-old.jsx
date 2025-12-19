import React, { useState } from "react";
import { dummyPlayers } from "../../public/assets";


const War = () => {
  const playersPerPage = 20;
  const sortedPlayers = [...dummyPlayers].sort((a, b) => b.totalPoints - a.totalPoints);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sortedPlayers.length / playersPerPage);

  const startIndex = (currentPage - 1) * playersPerPage;
  const currentPlayers = sortedPlayers.slice(startIndex, startIndex + playersPerPage);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["Alpen", "Silaris", "Flamio"];
  const factionColors = {
    0: "text-blue-500",
    1: "text-red-500",
    2: "text-green-500",
  };


  return (
    
    <div className="relative my-20 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <div className='flex flex-wrap justify-center md:justify-around items-center mt-10
        backdrop-blur bg-white/10 border border-gray-500/30 
        rounded-full p-4'>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full transition font-semibold ${
              selectedCategory === cat
                ? "bg-green-600 text-white"
                : "hover:bg-white/10 text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 my-8">
        <button
          className="px-4 py-2 rounded-md bg-green-600 text-sm text-white font-medium transition duration-300 hover:bg-green-700 shadow"
        >
          Last War Result
        </button>

        <button
          className="px-4 py-2 rounded-md bg-red-600 text-sm text-white font-medium transition duration-300 hover:bg-red-700 shadow"
        >
          All Wars Result
        </button>
      </div>

      <h1 className="text-xl sm:text-2xl font-semibold my-4 sm:my-6 text-center sm:text-left">War Results</h1>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300 border-separate border-spacing-y-4">
          <thead>
            <tr className="text-gray-300 font-semibold bg-gray-900">
              <th className="p-2 sm:p-4 text-center rounded-l-xl">#</th>
              <th className="p-2 sm:p-4 text-center">Name</th>
              <th className="p-2 sm:p-4 text-center">Faction</th>
              <th className="p-2 sm:p-4 text-center">Kills</th>
              <th className="p-2 sm:p-4 text-center">Deaths</th>
              <th className="p-2 sm:p-4 text-center rounded-r-xl">Total Points</th>
            </tr>
          </thead>
          <tbody>
            {currentPlayers.map((player, index) => (
              <tr
                key={player.name + index}
                className="bg-gray-800 hover:bg-gray-700 transition"
              >
                <td className="p-2 sm:p-4 text-center font-medium rounded-l-xl text-white">
                  {startIndex + index + 1}
                </td>
                <td
                  className={`p-2 sm:p-4 text-center font-semibold ${factionColors[player.faction]}`}
                >
                  {player.name} {player.name === sortedPlayers[0].name && (
                      <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded ml-2">
                        MVP
                      </span>)}
                </td>
                <td className="p-2 sm:p-4 text-center">
                  <img
                    src={player.factionImg}
                    alt={`Faction ${player.faction}`}
                    className="w-8 sm:w-10 h-auto mx-auto"
                  />
                </td>
                <td className="p-2 sm:p-4 text-center font-medium text-white">
                  {player.kills}
                </td>
                <td className="p-2 sm:p-4 text-center font-medium text-white">
                  {player.deaths}
                </td>
                <td className="p-2 sm:p-4 text-center text-green-400 font-medium rounded-r-xl">
                  {player.totalPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-lg border border-gray-600 transition-all duration-200
              ${
                currentPage === i + 1
                  ? "bg-primary text-white font-bold"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default War;
