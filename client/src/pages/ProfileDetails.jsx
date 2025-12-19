import React, { useState, useEffect, useContext } from 'react';
import { Link,useLocation ,useNavigate} from "react-router-dom";
import axios from 'axios';
import { CircleCheck, Mailbox  } from "lucide-react";
import SpriteImage from '../components/SpriteImage';
import { UserContext } from '../context/userContext';
import BattlePassSlider from '../components/BattlePassSlider';
import { useToast } from "../context/ToastContext";

const ProfileDetails = () => {
    const location = useLocation();
    const char = location.state?.Char;
    const charId = location.state?.CharId;
    console.log(location.state)
    const [streak, setStreak] = useState(0);
    const [items, setItems] = useState([]);
    const [charStats, setCharStats] = useState([]);
    const [usedGacha ,setUsedGacha] = useState()
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const { currentUser } = useContext(UserContext);
    const token = currentUser?.token;
    const { showToast } = useToast();

    useEffect(()=>{
      if(!token){
        showToast("You need to login", "warning");
        navigate('/')
      }
    }, [])

    const handleGacha = async (e) => {
      e.preventDefault();
      if(usedGacha < 500 ){
          showToast("You Must use 500 Gems To Get a Gift", "error");
          return;
      }
      try {

        const gachaGiftRes = await axios.post(`http://localhost:3000/char/gacha/${charId}/${usedGacha}`,
        {withCredentials: true , headers:{Authorization: `Bearer ${token}`}})
        if(gachaGiftRes.status == 200 ){
          showToast("You Got Your Gift", "success");
          setUsedGacha(usedGacha - 500);
        }

      } catch (error) {
        console.error("Failed to give gacha gift:", err);
      }

    };
  
    useEffect(() => {
        if (!char || !charId) return;

        const fetchDailyData = async () => {
          try {
            // Fetch both endpoints concurrently
            const [streakRes, itemsRes ,GachaUsedRes ] = await Promise.all([
              axios.get(`http://localhost:3000/char/daily/${char}/${charId}`),
              axios.get(`http://localhost:3000/char/day/data`),
              axios.get(`http://localhost:3000/char/gacha/${charId}`)
            ]);
      
            // Set streak
            setStreak(streakRes.data.streak ?? 0);
            setItems(itemsRes.data.rows ?? []);
            setUsedGacha(GachaUsedRes.data)
          } catch (err) {
            console.error("Failed to load daily data:", err);
          } finally {
            setLoading(false);
          }
        };
      
        fetchDailyData();
    }, []);
  
    if (loading) return <p className="text-gray-300">Loading...</p>;
  
    // Create an array of 28 boxes
    const boxes = Array.from({ length: 28 }, (_, i) => i + 1);
  
    return (
        <>
          <div className="mt-30 text-center text-gray-300 text-lg font-semibold">
            Hello {char}
          </div>
      
          <div className="w-full flex flex-col md:flex-row justify-center my-5 p-10 gap-6  border border-gray-600 rounded-2xl">
            {/* Left Column: Daily Streak */}
            <div className="flex-1 bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg">
                <h2 className="text-center font-semibold text-white mb-4">Daily Attendance</h2>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2">
                    {items.map((item, i) => (
                    <div
                        key={i}
                        className="w-full aspect-square flex items-center justify-center bg-gray-800 rounded-lg relative"
                    >
                        {/* Item image */}
                        <SpriteImage
                        code={item.item_img}
                        className="mx-auto mt-4 mb-4"
                        scale={2}
                        />

                        {/* Green check overlay */}
                        {streak >= i + 1 && (
                        <CircleCheck
                            className="absolute w-full h-full text-green-400 opacity-50 z-20"
                        />
                        )}
                    </div>
                    ))}
                </div>
            </div>


      
            {/* Right Column: Stats & Gacha stacked */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Character Stats Box */}
              <div className="bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col justify-between">
                <h2 className="text-center font-semibold text-white mb-4">Character Stats</h2>
                <div className="text-gray-300 space-y-2 text-sm">
                  <div>Coming Soon: {charStats?.level ?? '-'}</div>
                  <div>Coming Soon: {charStats?.className ?? '-'}</div>
                  <div>Coming Soon: {charStats?.titles ?? '-'}</div>
                  <div>Coming Soon: {charStats?.points ?? "-"}</div>
                  <div>Coming Soon: {charStats?.points ?? "-"}</div>
                </div>
              </div>
      
              {/* Gacha Box */}
              <div className="bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col justify-between">
                    <h2 className="text-center font-semibold text-white mb-4">Gacha</h2>

                    <div className="text-gray-300 space-y-2 text-sm mb-4">
                        <div>Gacha Target: {usedGacha} / 500</div>
                        <div>You Will Receive a Gift When You Hit The Target </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 h-4 rounded-full mb-4 overflow-hidden">
                        <div
                        className="bg-green-500 h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${( usedGacha / 500) * 100}%`, // calculate percentage
                        }}
                        ></div>
                    </div>

                    <button onClick={handleGacha} className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded transition">
                        Collect Award
                    </button>
              </div>
              <Link
                to="/myMail"
                state={{ charId: charId }}
                className="block mt-4 w-full bg-red-500 text-center py-2 rounded-lg 
                hover:bg-red-700 hover:text-white transition font-semibold"
              >
                <span className="text-white flex items-center justify-center gap-2">
                My Mail <Mailbox className="inline-block" />
                </span>
              </Link>

            </div>
          </div>
          <BattlePassSlider missions={new Array(100).fill(0)} />

        </>
      );
      
      
      
        
};

export default ProfileDetails
