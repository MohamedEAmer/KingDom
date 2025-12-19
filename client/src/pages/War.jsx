import React, { useState ,useEffect,useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext'
import { useToast } from "../context/ToastContext";
import axios from 'axios';



const War = () => {
  const { showToast } = useToast();
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;
  const navigate = useNavigate()
  useEffect(()=>{
    if(!token){
      showToast("You need to login", "warning");
      navigate('/')
    }
  }, [])

  const [townAllWars, setTownAllWars] = useState(1);
  const [oneWarResult, setOneWarResult] = useState('');
  const [selectedTown, setSelectedTown] = useState("1");
  const Towns = ["Alpen", "Silaris", "Flamio"];
  const factionColors = {
    0: "text-blue-500",
    1: "text-red-500",
    2: "text-green-500",
  };


  const handleOneWarResult = async (e) => {
    e.preventDefault();
    console.log(selectedTown)
    try {
      const response = await axios.get(`http://localhost:3000/war/one/${selectedTown}`,
      {withCredentials: true , headers:{Authorization: `Bearer ${token}`}});
      if(response.status == 200 || response.status == 201 ){
      setTownAllWars('');
      setOneWarResult(response.data.participants)
      }
      else
      {
        setTownAllWars('');
        setOneWarResult('')
      }

    } catch (err) {
      setOneWarResult('');
    }
  };
  const handleTownAllWars = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:3000/war/all/${selectedTown}`,
      {withCredentials: true , headers:{Authorization: `Bearer ${token}`}});
      if(response.status == 200 || response.status == 201 ){
      setTownAllWars(response.data);
      setOneWarResult('')
      }
      else
      {
        setTownAllWars('');
        setOneWarResult('')
      }
    } catch (err) {
      setTownAllWars('');
    }
  };

  return (
    
    <div className="relative my-20 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <div className='flex flex-wrap justify-center md:justify-around items-center mt-10
        backdrop-blur bg-white/10 border border-gray-500/30 
        rounded-full p-4'>
        {Towns.map((town , i) => (
          <button
            key={i}
            onClick={() => setSelectedTown(i)}
            className={`px-4 py-2 rounded-full transition font-semibold ${
              selectedTown === i
                ? "bg-green-600 text-white"
                : "hover:bg-white/10 text-white"
            }`}
          >
            {town}
          </button>
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 my-8">
        <button
          onClick={handleOneWarResult}
          className="px-4 py-2 rounded-md bg-green-600 text-sm text-white font-medium transition duration-300 hover:bg-green-700 shadow"
        >
          Last War Result
        </button>

        <button
        onClick={handleTownAllWars}
          className="px-4 py-2 rounded-md bg-red-600 text-sm text-white font-medium transition duration-300 hover:bg-red-700 shadow"
        >
          All Wars Result
        </button>
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold my-4 sm:my-6 text-center sm:text-left">War Results</h2>
      {townAllWars && townAllWars.length > 0 && (
        <div className="w-full overflow-x-auto mt-6">
          <table className="w-full text-sm text-left text-gray-300 border-separate border-spacing-y-4">
            <thead>
              <tr className="text-gray-300 font-semibold bg-gray-900">
                <th className="p-2 sm:p-4 text-center rounded-l-xl">#</th>
                <th className="p-2 sm:p-4 text-center">MVP</th>
                <th className="p-2 sm:p-4 text-center">Light Scores</th>
                <th className="p-2 sm:p-4 text-center rounded-r-xl">Dark Scores</th>
              </tr>
            </thead>
            <tbody>
              {townAllWars.map((war, index) => (
                <tr
                  key={war.Guid}
                  className="bg-gray-800 hover:bg-gray-700 transition"
                >
                  <td className="p-2 sm:p-4 text-center font-medium rounded-l-xl text-white">
                    {index + 1}
                  </td>
                  <td className="p-2 sm:p-4 text-center font-semibold text-yellow-400">
                    {war.MvpCharacterName}
                  </td>
                  <td className="p-2 sm:p-4 text-center font-medium text-blue-400">
                    {war.LightScores}
                  </td>
                  <td className="p-2 sm:p-4 text-center font-medium text-red-400 rounded-r-xl">
                    {war.DarkScores}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {oneWarResult && oneWarResult.length > 0 &&(
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
            {oneWarResult.map((player, index) => (
              <tr
                key={index}
                className="bg-gray-800 hover:bg-gray-700 transition"
              >
                <td className="p-2 sm:p-4 text-center font-medium rounded-l-xl text-white">
                  {index + 1}
                </td>
                <td
                  className={`p-2 sm:p-4 text-center font-semibold ${factionColors[player.Asda2FactionId]}`}
                >
                  {player.CharacterName} {player.CharacterName === oneWarResult[0].CharacterName && (
                      <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded ml-2">
                        MVP
                      </span>)}
                </td>
                <td className="p-2 sm:p-4 text-center">
                  <img
                    src={`faction_${player.Asda2FactionId}.png`}
                    alt={`Faction ${player.Asda2FactionId}`}
                    className="w-8 sm:w-10 h-auto mx-auto"
                  />
                </td>
                <td className="p-2 sm:p-4 text-center font-medium text-white">
                  {player.Kills}
                </td>
                <td className="p-2 sm:p-4 text-center font-medium text-white">
                  {player.Deathes}
                </td>
                <td className="p-2 sm:p-4 text-center text-green-400 font-medium rounded-r-xl">
                  {player.ActScores}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

    </div>
  );
};

export default War;
