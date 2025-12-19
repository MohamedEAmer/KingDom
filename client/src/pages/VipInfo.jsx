import React from 'react'
import { useState ,useEffect,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext'
import axios from 'axios';

const VipInfo = () => {
  const [vipInfo, setVipInfo] = useState([]);
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;
  const navigate = useNavigate()
  useEffect(()=>{
    if(!token){
      showToast("You need to login", "warning");
      navigate('/')
    }
  }, [])
    const levels = Array.from({ length: 20 }, (_, i) => i + 1);
    const getVipIncrease = (lvl) => {
      if (lvl <= 10) return (lvl * 1.5).toFixed(1);
      if (lvl < 20) return (lvl * 2);
      return (lvl * 2.5); // VIP 20 → 50%
    };

    useEffect(() => {
      const getVipInfo = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/player/vip",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
    
          setVipInfo(response.data.levels || []);
        } catch (err) {
          console.error("Failed to fetch VIP info:", err);
        }
      };
        getVipInfo();
    }, []);
    
  
    return (
      <div className="overflow-x-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-23 py-25">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-yellow-400 mb-8 drop-shadow-lg">
          VIP System Info
        </h2>
    
        <div className="overflow-auto rounded-lg shadow-lg border border-gray-700">
          <table className="min-w-full border-collapse text-center text-sm bg-gray-900">
            <thead>
              <tr className="bg-gray-800 text-gray-200 uppercase tracking-wide">
                <th className="border border-gray-700 px-3 py-2">Effect</th>
                {levels.map((lvl) => (
                  <th
                    key={lvl}
                    className="border border-gray-700 px-3 py-2 bg-gradient-to-b from-gray-700 to-gray-800"
                  >
                    Lv.{lvl}
                  </th>
                ))}
              </tr>
            </thead>
    
            <tbody className="text-gray-300">
              {/* Target For VIP Level */}
              <tr className="bg-gradient-to-r from-green-900/40 via-green-800/30 to-green-900/40 hover:bg-green-700/20 transition-colors duration-200">
                <td className="border border-green-600 px-3 py-2 font-bold text-green-300">
                  Target For VIP Level
                </td>

                {vipInfo.map((vip, index) => {
                  const prevPoints = index === 0 ? 0 : vipInfo[index - 1].TargetPoints;
                  const pointsNeeded = vip.TargetPoints - prevPoints;

                  return (
                    <td
                      key={vip.VipLevel}
                      className="border border-green-700 px-3 py-2 text-green-200 font-semibold hover:bg-green-700/30 transition-colors duration-200"
                    >
                      {pointsNeeded.toLocaleString()}
                    </td>
                  );
                })}
              </tr>
    
              {/* All Capabilities */}
              <tr className="hover:bg-gray-800/30 transition-colors duration-200">
                <td className="border border-gray-700 px-3 py-2 font-medium">
                  Increase All Capabilities
                </td>
                {levels.map((lvl) => (
                  <td
                    key={lvl}
                    className="border border-gray-700 px-3 py-2"
                  >
                    {lvl * 5}%
                  </td>
                ))}
              </tr>
    
              {/* Increase Gold */}
              <tr className="hover:bg-gray-800/30 transition-colors duration-200">
                <td className="border border-gray-700 px-3 py-2 font-medium">
                  Increase Gold
                </td>
                {levels.map((lvl) => (
                  <td key={lvl} className="border border-gray-700 px-3 py-2">
                    {lvl * 5}%
                  </td>
                ))}
              </tr>
    
              {/* Increase Drop rate */}
              <tr className="hover:bg-gray-800/30 transition-colors duration-200">
                <td className="border border-gray-700 px-3 py-2 font-medium">
                  Increase Drop rate
                </td>
                {levels.map((lvl) => (
                  <td key={lvl} className="border border-gray-700 px-3 py-2">
                    {lvl * 5}%
                  </td>
                ))}
              </tr>
    
              {/* Increase Dig rate */}
              <tr className="hover:bg-gray-800/30 transition-colors duration-200">
                <td className="border border-gray-700 px-3 py-2 font-medium">
                  Increase Dig rate
                </td>
                {levels.map((lvl) => (
                  <td key={lvl} className="border border-gray-700 px-3 py-2">
                    {lvl * 2}%
                  </td>
                ))}
              </tr>
    
              {/* Increase Fishing rate */}
              <tr className="hover:bg-gray-800/30 transition-colors duration-200">
                <td className="border border-gray-700 px-3 py-2 font-medium">
                  Increase Fishing rate
                </td>
                {levels.map((lvl) => (
                  <td key={lvl} className="border border-gray-700 px-3 py-2">
                    {lvl * 2}%
                  </td>
                ))}
              </tr>
    
              {/* Increase EXP */}
              <tr className="hover:bg-gray-800/30 transition-colors duration-200">
                <td className="border border-gray-700 px-3 py-2 font-medium">
                  Increase EXP
                </td>
                {levels.map((lvl) => (
                  <td key={lvl} className="border border-gray-700 px-3 py-2">
                    {lvl * 2}%
                  </td>
                ))}
              </tr>
    
              {/* Increase P.Attack */}
              <tr className="hover:bg-gray-800/30 transition-colors duration-200">
                <td className="border border-gray-700 px-3 py-2 font-medium">
                  Increase P.Attack
                </td>
                {levels.map((lvl) => (
                  <td key={lvl} className="border border-gray-700 px-3 py-2">
                    {lvl}%
                  </td>
                ))}
              </tr>
    
              {/* Increase M.Attack */}
              <tr className="hover:bg-gray-800/30 transition-colors duration-200">
                <td className="border border-gray-700 px-3 py-2 font-medium">
                  Increase M.Attack
                </td>
                {levels.map((lvl) => (
                  <td key={lvl} className="border border-gray-700 px-3 py-2">
                    {lvl}%
                  </td>
                ))}
              </tr>
    
              {/* Increase Move Speed */}
              <tr className="hover:bg-gray-800/30 transition-colors duration-200">
                <td className="border border-gray-700 px-3 py-2 font-medium">
                  Increase Move Speed
                </td>
                {levels.map((lvl) => (
                  <td key={lvl} className="border border-gray-700 px-3 py-2">
                    {lvl}%
                  </td>
                ))}
              </tr>
    
              {/* Increase Craft rate */}
              <tr className="hover:bg-gray-800/30 transition-colors duration-200">
                <td className="border border-gray-700 px-3 py-2 font-medium">
                  Increase Craft rate
                </td>
                {levels.map((lvl) => (
                  <td key={lvl} className="border border-gray-700 px-3 py-2">
                    {lvl}%
                  </td>
                ))}
              </tr>
    
              {/* Increase Upgrade (VIP bonus) */}
              <tr className="hover:bg-gray-800/30 transition-colors duration-200">
                <td className="border border-gray-700 px-3 py-2 font-medium">
                  Increase Upgrade
                </td>
                {levels.map((lvl) => (
                  <td
                    key={lvl}
                    className="border border-gray-700 px-3 py-2"
                  >
                    {getVipIncrease(lvl)}%
                  </td>
                ))}
              </tr>
    
              {/* Decrease Upgrade Cost */}
              <tr className="hover:bg-gray-800/30 transition-colors duration-200">
                <td className="border border-gray-700 px-3 py-2 font-medium">
                  Decrease Upgrade Cost
                </td>
                {levels.map((lvl) => (
                  <td key={lvl} className="border border-gray-700 px-3 py-2">
                    {lvl * 2}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
    
  };
  
  export default VipInfo;
  
