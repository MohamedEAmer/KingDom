import React, { useState, useEffect ,useContext} from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext'
import {useNavigate } from 'react-router-dom';

const RatesAndWars = () => {
  const [expRate, setExpRate] = useState(3);
  const [dropRate, setDropRate] = useState(2);
  const [goldRate, setGoldRate] = useState(1);
  const [warTimes, setWarTimes] = useState(['2:00 PM', '5:30 PM', '8:30 PM']);
  const [nextWarIndex, setNextWarIndex] = useState(2);
  const [selectedDay, setSelectedDay] = useState('');
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;
  const navigate = useNavigate()
  useEffect(()=>{
    if(!token || currentUser.role !== "Owner"){
      showToast("You Can Not Reach This Page", "warning");
      navigate('/')
    }
  }, [])

  const handleWarTimeChange = (index, value) => {
    const newTimes = [...warTimes];
    newTimes[index] = value;
    setWarTimes(newTimes);
  };

  const handleSaveRates = () => {
    console.log('Saving...', {
      expRate,
      dropRate,
      warTimes,
      nextWar: warTimes[nextWarIndex]
    });
    // TODO: Save to backend or config file
    alert('Changes saved!');
  };
  const handleSaveWars = () => {
    console.log('Saving...', {
      expRate,
      dropRate,
      warTimes,
      nextWar: warTimes[nextWarIndex]
    });
    // TODO: Save to backend or config file
    alert('Changes saved!');
  };

  return (
    <div className="bg-black/6 border border-gray-600 text-white p-20 mt-20 rounded-xl shadow-xl max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center text-blue-400">Rates & War Times</h2>

      {/* EXP and Drop Rates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 text-sm text-gray-300">EXP Rate</label>
          <input
            type="number"
            value={expRate}
            onChange={(e) => setExpRate(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-300">Drop Rate</label>
          <input
            type="number"
            value={dropRate}
            onChange={(e) => setDropRate(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-300">Gold Rate</label>
          <input
            type="number"
            value={goldRate}
            onChange={(e) => setGoldRate(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          />
        </div>

        </div>
                {/* Save Button */}
                <div className="text-center">
            <button
              onClick={handleSaveRates}
              className="bg-gradient-to-r from-blue-500 to-blue-700 cursor-pointer rounded-xl hover:scale-105 transition-all duration-300 px-6 py-2 font-semibold"
            >
              Save Rates
            </button>
          </div>

      {/* War Times */}
      <div>
        <label className="block mb-2 text-sm text-gray-300">War Times (KSA)</label>
        <div className="space-y-3">
        {/* Day Selector */}
            <select
            value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            className=" w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            >
            <option value="" disabled>
                Select The Day
            </option>
            <option value="Sunday">Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            </select>
          {warTimes.map((time, index) => (
            <div key={index} className="flex items-center gap-4">
              <input
                type="text"
                value={time}
                onChange={(e) => handleWarTimeChange(index, e.target.value)}
                className="flex-1 p-2 rounded bg-gray-800 border border-gray-600"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="nextWar"
                  checked={nextWarIndex === index}
                  onChange={() =>
                    setNextWarIndex(prev => (prev === index ? null : index))
                  }
                />
                Next
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button
          onClick={handleSaveWars}
          className="bg-gradient-to-r from-blue-500 to-blue-700 cursor-pointer rounded-xl hover:scale-105 transition-all duration-300 px-6 py-2 font-semibold"
        >
          Save Wars
        </button>
      </div>
    </div>
  );
};

export default RatesAndWars;
