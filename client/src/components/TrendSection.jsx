import { ArrowRight, CircleDollarSign,CircleFadingArrowUp , X,CrownIcon, FlameIcon, GemIcon, ArrowBigDownDash , SwordsIcon, Coins } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import OffersItem from './OffersItem';
import { useEffect, useState } from 'react';
import axios from 'axios';


const TrendSection = () => {
  const [topRanks, setTopRanks] = useState([]);
  const [hotItems, setHotItems] = useState([]);
  const [king, setKing] = useState(null);
  const [error,setError]= useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data ={
          category : "2"
        }
        const [ranksRes, hotRes, kingRes] = await Promise.all([
          axios.get('http://localhost:3000/player/ranks'),
          axios.get('http://localhost:3000/shop/category' , {params : data}),
          axios.get('http://localhost:3000/player/king')
        ]);
        setTopRanks(ranksRes.data.data);
        setHotItems(hotRes.data);
        setKing(kingRes.data.king);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
  
    fetchData();
  }, []);
  
  const navigate = useNavigate();
  return (
    <div className='text-center pt-10 bg-black/60 border border-gray-600 rounded-2xl'>
    <h2 className="text-gray-300 font-medium text-2xl">In Game Trending</h2>
    <div className="flex flex-col lg:flex-row justify-between gap-10 px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden pt-10">
      {/* Left Section */}
      <div className="w-full lg:flex-1 flex flex-col gap-6">
        {/* Top Cards Container */}
        <div className="flex flex-col gap-6 w-full">
          {/* Card 1: Town Occupation */}
          <div className="bg-gray-800 backdrop-blur rounded-xl p-6 shadow-lg w-full">
            <div className="flex justify-center items-center gap-2 mb-6">
              <h2 className="text-lg font-semibold text-white">Town Occupation & Wars</h2>
              <SwordsIcon className="w-8 h-8 text-gray-400 drop-shadow-md animate-bounce" />
            </div>
            <p className="text-sm text-gray-400 text-center mb-4">
              <span className="text-primary">Updated Daily at 12:00 AM</span>
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-separate border-spacing-y-2 min-w-[600px]">
                <thead>
                  <tr className="text-xs uppercase text-gray-400">
                    <th className="px-4 py-2">Town</th>
                    <th className="px-4 py-2">War Level</th>
                    <th className="px-4 py-2">Faction</th>
                    <th className="px-4 py-2">Guild</th>
                    <th className="px-4 py-2">Guild Leader</th>
                  </tr>
                </thead>
                <tbody className="text-white font-medium">
                  <tr className="bg-gray-900 hover:bg-gray-700 transition">
                    <td className="px-4 py-3 rounded-l-xl">Alpen</td>
                    <td className="px-4 py-3">10 ~ 29</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src="../faction_1.png" alt="Dark" className="w-5 h-5" />
                        <span>Dark</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">Owners</td>
                    <td className="px-4 py-3 rounded-r-xl">Prime</td>
                  </tr>
                  <tr className="bg-gray-900 hover:bg-gray-700 transition">
                    <td className="px-4 py-3 rounded-l-xl">Silaris</td>
                    <td className="px-4 py-3">30 ~ 49</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src="../faction_2.png" alt="Chaos" className="w-5 h-5" />
                        <span>Chaos</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">Kings</td>
                    <td className="px-4 py-3 rounded-r-xl">Wolf</td>
                  </tr>
                  <tr className="bg-gray-900 hover:bg-gray-700 transition">
                    <td className="px-4 py-3 rounded-l-xl">Flamio</td>
                    <td className="px-4 py-3">50 ~ 69</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src="../faction_1.png" alt="Dark" className="w-5 h-5" />
                        <span>-</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">-</td>
                    <td className="px-4 py-3 rounded-r-xl">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-gray-900 rounded-xl p-4 text-sm text-white ">
              <h3 className="text-base font-semibold mb-2 text-center ">Upcoming Wars</h3>
              <p className="text-sm text-gray-400 text-center mb-4">
                <span className="text-primary">These times are in KSA.</span>
              </p>
              <ul className="flex flex-col md:flex-row justify-center gap-4 text-center">
                <li className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">2:00 PM</li>
                <li className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">5:30 PM</li>
                <li className="bg-blue-600 px-4 py-2 rounded-lg border border-blue-400 font-bold shadow-lg">
                  8:30 PM (Next)
                </li>
              </ul>
            </div>
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => {navigate('/war');
                scrollTo(0,0)
              }} 
                className="group cursor-pointer rounded-full px-5 py-2 hover:bg-blue-600 flex items-center gap-2 bg-blue-500 transition"
              >
                View More
                <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Card 2: Rates */}
          <div className="bg-gray-800 backdrop-blur rounded-xl p-6 shadow border border-gray-600/40 w-full">
            <div className="flex justify-center items-center gap-2 mb-6 ">
              <h2 className="text-lg font-semibold text-white ">Rats</h2>
              <GemIcon className="w-8 h-8 text-blue-500 animate-flipY drop-shadow-md" />
            </div>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <CircleFadingArrowUp className="w-5 h-5 text-red-400" />
                <span>Experience:</span>
                <span className="text-white font-semibold ml-auto">×1</span>
              </li>
              <li className="flex items-center gap-2">
                <ArrowBigDownDash  className="w-5 h-5 text-green-400" />
                <span>Drop Rate:</span>
                <span className="text-white font-semibold ml-auto">×1</span>
              </li>
              <li className="flex items-center gap-2">
                <CircleDollarSign className="w-5 h-5 text-yellow-400" />
                <span>Gold Rate:</span>
                <span className="text-white font-semibold ml-auto">×1</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Hot Items Section Below Cards */}
        <div className="py-10 bg-gray-800 backdrop-blur rounded-xl mb-6 shadow border border-gray-600/40 w-full ">
          <div className="flex justify-center items-center gap-2 mb-6">
            <h2 className="text-lg font-semibold text-white">Hot Items</h2>
            <FlameIcon className="w-8 h-8 text-red-500 drop-shadow-md animate-pulse" />
          </div>
          <div className="flex flex-wrap justify-center max-sm:justify-center gap-8">
            {hotItems.map((item ,index) => (
              <OffersItem key={index} item={item} setError = {setError}  />
            ))}
          </div>
          {error && (
            <div
              className="w-fit px-4 my-4 py-2 rounded-md bg-red-500/10 border border-red-500/30
                        text-red-400 text-sm flex items-center gap-2 mx-auto"
            >
              <span>{error}</span>

              <button
                onClick={() => setError("")}
                className="text-red-300 hover:text-red-500 transition"
              >
                <X className="w-5 h-5 border border-red-500/60" />
              </button>
            </div>
          )}
          <div className="flex justify-center my-10">
            <button 
              onClick={() => { 
                  navigate('/shopitem');
                  scrollTo(0, 0);
              }}
              className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'
            >
              Show more Items
            </button>
          </div>
        </div>
      </div>

      {/* Right Section: Top 10 */}
      <div className="w-full lg:max-w-sm mt-10 lg:mt-0">
        <div className="bg-gray-800 rounded-2xl shadow-md px-6 py-6">
          <div className="flex justify-center items-center gap-2 mb-6">
            <h2 className="text-lg font-semibold text-white">Top 10 Ranks</h2>
            <CrownIcon className="w-8 h-8 text-yellow-500 " />
          </div>
          <p className="text-sm text-gray-400 text-center mb-6">
            <span className="text-primary">Updated Daily at 12:00 AM</span>
          </p>
          <ul className="space-y-3">
            {topRanks.map((player, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-900 rounded-xl px-4 py-2 text-white hover:bg-gray-700 transition"
              >
                <span className="text-sm font-medium">{player.Name}</span>
                <span className="text-xl font-bold text-primary">
                  {player.Name ? (
                    <img
                      src={`../${idx + 1}.png`}
                      alt="Rank"
                      className="h-8 w-8"
                    />
                  ) : (
                    idx + 1
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card: The Game King */}
        <div className="bg-gray-800 rounded-2xl shadow-md px-6 py-6 mt-6">
          <div className="flex justify-center items-center gap-2 mb-6">
            <h2 className="text-lg font-semibold text-white">The Game King Is</h2>
            <CrownIcon className="w-8 h-8 text-yellow-500" />
          </div>

          {king ? (
            <div className="flex flex-col items-center gap-2 bg-gray-900 rounded-xl px-4 py-4">
              <span className="text-xl font-bold text-yellow-400">{king.Name}</span>
              <span className="flex items-center gap-2 text-sm text-gray-300">
                <Coins className="w-4 h-4 text-yellow-400" />
                {king.Tokens} Tokens Delivered
              </span>
            </div>
          ) : (
            <p className="text-center text-gray-400 font-medium py-4">
              There is no King yet
            </p>
          )}

          <button
            onClick={() => { navigate('/royals'); scrollTo(0, 0); }}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg transition"
          >
            All Royals
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    </div>

  );
  
}

export default TrendSection
