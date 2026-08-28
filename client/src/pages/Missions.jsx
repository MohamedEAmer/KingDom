import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircleCheck, ListChecks } from 'lucide-react';
import { UserContext } from '../context/userContext';
import { useToast } from '../context/ToastContext';

const Missions = () => {
  const location = useLocation();
  const char = location.state?.Char;
  const charId = location.state?.CharId ?? location.state?.charId;

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      showToast('You need to login', 'warning');
      navigate('/');
      return;
    }
    if (!charId) {
      showToast('You must choose a character first.', 'warning');
      navigate('/profile');
    }
  }, []);

  // Fetch available categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3000/char/missions/categories');
        setCategories(res.data.categories ?? []);
      } catch (err) {
        console.error('Failed to load mission categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch missions whenever the category filter changes
  useEffect(() => {
    if (!charId || !token) return;

    const fetchMissions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/char/missions/${charId}`,
          {
            params: selectedCategory !== 'All' ? { category: selectedCategory } : {},
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMissions(res.data.rows ?? []);
      } catch (err) {
        console.error('Failed to load missions:', err);
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [selectedCategory, charId, token]);

  const filters = ['All', ...categories];

  if (loading && missions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading your missions...
      </div>
    );
  }

  return (
    <div className="relative mt-30 mb-6 px-4 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] border border-gray-600 rounded-2xl">
      <div className="flex items-center justify-between my-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-yellow-400" />
          {char ? `${char}'s Missions` : 'Your Missions'}
        </h2>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              selectedCategory === cat
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-900 text-gray-300 hover:bg-gray-700 border border-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-300">
          Loading missions...
        </div>
      ) : missions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-2xl font-bold text-center text-gray-300">
            No missions found for this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {missions.map((mission) => {
            const progress = Number(mission.Progress) || 0;
            const target = Number(mission.Target) || 1;
            const percent = Math.min(100, Math.round((progress / target) * 100));
            const isDone = Number(mission.Status) === 1;

            return (
              <div
                key={mission.MissionId}
                className="bg-gray-900 p-5 rounded-xl shadow-lg flex flex-col justify-between border border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wide font-semibold px-2 py-1 rounded-full bg-gray-800 text-yellow-300">
                    {mission.Category || 'Once'}
                  </span>
                  {isDone && (
                    <CircleCheck className="w-5 h-5 text-green-400" />
                  )}
                </div>

                <h3 className="text-white font-semibold mb-2">
                  {mission.MissionName}
                </h3>

                <div className="text-gray-300 text-sm mb-2">
                  Progress: {Math.min(progress, target)} / {target}
                </div>

                <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDone ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <span
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    isDone ? 'text-green-400' : 'text-gray-400'
                  }`}
                >
                  {isDone ? 'Completed' : 'In Progress'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Missions;
