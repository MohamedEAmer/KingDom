import React, { useState, useEffect ,useContext} from 'react';
import { EditIcon, SaveIcon } from 'lucide-react';
import axios from 'axios';
import { UserContext } from '../context/userContext'
import {useNavigate } from 'react-router-dom';

const PlayersManagement = () => {
  const [players, setPlayers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;
  const navigate = useNavigate()
  useEffect(()=>{
    if(!token || currentUser.role !== "Owner"){
      showToast("You Can Not Reach This Page", "warning");
      navigate('/')
    }
  }, [])

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/player/players',
        {withCredentials: true , headers:{Authorization: `Bearer ${token}`}});
        const formattedPlayers = res.data.accounts.map((acc, index) => ({
          id: acc.accountId,
          username: acc.accountName,
          characters: acc.characters,
          balance: acc.points,
        }));
        setPlayers(formattedPlayers);
      } catch (err) {
        console.error('Failed to fetch players:', err);
      }
    };

    fetchPlayers();
  }, []);

  const handleEdit = (player) => {
    setEditingId(player.id);
    setNewBalance(player.balance);
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:3000/player/balance/${id}`, {
        newBalance: Number(newBalance),
      },
      {withCredentials: true , headers:{Authorization: `Bearer ${token}`}});

      setPlayers((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, balance: Number(newBalance) } : p
        )
      );

      setEditingId(null);
      setNewBalance('');
    } catch (err) {
      console.error('Error updating balance:', err);
    }
  };

  return (
    <div className="p-6 my-6 mx-0 lg:ml-70 md:ml-70 border border-gray-600 rounded-xl text-white">
      <h1 className="text-2xl font-bold mb-4">Players Management</h1>

      <div className="overflow-auto rounded-xl border border-gray-700">
        <table className="min-w-full text-sm text-center bg-gray-900">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th rowSpan="2" className="px-4 py-2 border border-gray-700">#</th>
              <th rowSpan="2" className="px-4 py-2 border border-gray-700">User Name</th>
              <th colSpan="4" className="px-4 py-2 border border-gray-700">Char 1</th>
              <th colSpan="4" className="px-4 py-2 border border-gray-700">Char 2</th>
              <th colSpan="4" className="px-4 py-2 border border-gray-700">Char 3</th>
              <th rowSpan="2" className="px-4 py-2 border border-gray-700">Balance</th>
            </tr>
            <tr>
              {[...Array(3)].map((_, i) =>
                ['Name', 'Lvl', 'Proff', 'Rank'].map((label, idx) => (
                  <th key={`${i}-${idx}`} className="px-4 py-1 border border-gray-700">{label}</th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.id} className="border-t border-gray-700 hover:bg-gray-800 transition">
                <td className="px-4 py-2 border border-gray-700">{index + 1}</td>
                <td className="px-4 py-2 border border-gray-700 font-medium">{player.username}</td>

                {[...Array(3)].map((_, charIndex) => {
                  const char = player.characters[charIndex];
                  return char ? (
                    <React.Fragment key={charIndex}>
                      <td className="px-4 py-2 border border-gray-700">{char.Name}</td>
                      <td className="px-4 py-2 border border-gray-700">{char.Level}</td>
                      <td className="px-4 py-2 border border-gray-700">{char.ClassId}</td>
                      <td className="px-4 py-2 border border-gray-700">{char.Rank}</td>
                    </React.Fragment>
                  ) : (
                    [...Array(4)].map((_, i) => (
                      <td key={`empty-${charIndex}-${i}`} className="px-4 py-2 border border-gray-700 text-gray-500">—</td>
                    ))
                  );
                })}

                <td className="px-4 py-2 border border-gray-700 font-semibold text-green-400">
                  {editingId === player.id ? (
                    <div className="flex items-center gap-2 justify-center">
                      <input
                        type="number"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                        className="w-20 px-2 py-1 rounded bg-gray-800 border border-gray-600 text-white text-center"
                      />
                      <SaveIcon
                        className="w-5 h-5 text-green-500 cursor-pointer hover:text-green-400"
                        onClick={() => handleSave(player.id)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span>{player.balance} Points</span>
                      <EditIcon
                        className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-400"
                        onClick={() => handleEdit(player)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayersManagement;
