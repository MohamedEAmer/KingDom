import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Crown, Shield, Landmark, Gem, Sparkles, Coins } from 'lucide-react';

const ROYAL_TABS = [
  { level: 1, title: 'Knight', arabic: 'فارس', icon: Shield, seatLimit: 20 },
  { level: 2, title: 'Duke', arabic: 'دوق', icon: Landmark, seatLimit: 15 },
  { level: 3, title: 'Count', arabic: 'كونت', icon: Gem, seatLimit: 10 },
  { level: 4, title: 'Prince', arabic: 'أمير', icon: Sparkles, seatLimit: 4 },
  { level: 5, title: 'King', arabic: 'ملك', icon: Crown, seatLimit: 1 },
];

const Royals = () => {
  const [selectedLevel, setSelectedLevel] = useState(5); // default: King
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoyals = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/player/royals/${selectedLevel}`
        );
        setData(res.data);
      } catch (err) {
        console.error('Failed to load royal roles:', err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRoyals();
  }, [selectedLevel]);

  const activeTab = ROYAL_TABS.find((tab) => tab.level === selectedLevel);
  const king = selectedLevel === 5 ? data?.players?.[0] : null;

  return (
    <div className="relative mt-30 mb-6 px-4 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] border border-gray-600 rounded-2xl">
      <div className="text-center my-6">
        <h2 className="text-2xl font-semibold flex items-center justify-center gap-2">
          <Crown className="w-7 h-7 text-yellow-500" />
          The Game Royals
        </h2>
        <p className="text-sm text-gray-400 mt-2">
          The five royal ranks — climb the pyramid by delivering royal tokens.
        </p>
      </div>

      {/* Role tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {ROYAL_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.level === selectedLevel;
          return (
            <button
              key={tab.level}
              onClick={() => setSelectedLevel(tab.level)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition border ${
                isActive
                  ? 'bg-yellow-500 text-black border-yellow-500'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-700 border-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.title}
              <span className="text-xs opacity-70">({tab.seatLimit})</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-300">
          Loading {activeTab?.title}...
        </div>
      ) : selectedLevel === 5 ? (
        // Special King showcase
        <div className="flex flex-col items-center justify-center py-10">
          <div className="relative bg-gradient-to-b from-yellow-500/20 to-gray-900 border border-yellow-500/40 rounded-2xl px-10 py-10 shadow-2xl flex flex-col items-center gap-4 max-w-md w-full">
            <Crown className="w-16 h-16 text-yellow-400 drop-shadow-lg" />
            {king ? (
              <>
                <h3 className="text-3xl font-extrabold text-yellow-300 tracking-wide text-center">
                  {king.Name}
                </h3>
                <p className="text-sm text-gray-300 uppercase tracking-widest">
                  ملك — King of the Realm
                </p>
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full mt-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold">
                    {king.Tokens} Tokens Delivered
                  </span>
                </div>
              </>
            ) : (
              <p className="text-xl font-bold text-gray-300 text-center">
                There is no King yet
              </p>
            )}
          </div>
        </div>
      ) : data?.players?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
          {data.players.map((player, idx) => (
            <div
              key={player.EntityLowId ?? idx}
              className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 hover:bg-gray-800 transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-800 text-yellow-400 text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="text-white font-semibold">{player.Name}</span>
              </div>
              <span className="flex items-center gap-1 text-sm text-gray-300">
                <Coins className="w-4 h-4 text-yellow-400" />
                {player.Tokens}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-2xl font-bold text-center text-gray-300">
            No {activeTab?.title}s yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Royals;
