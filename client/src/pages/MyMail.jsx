import React, { useState, useEffect, useContext } from 'react';
import {useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import SpriteImage from '../components/SpriteImage';
import { Gift } from 'lucide-react';
import { useToast } from "../context/ToastContext";


const MyMail = () => {
  const location = useLocation();
  const charId = location.state?.charId;
  const { currentUser , setCurrentUser} = useContext(UserContext);
  const token = currentUser?.token;
  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const navigate = useNavigate()
  useEffect(()=>{
    if(!token){
      showToast("You Need To Login", "warning");
      navigate('/')
    }
  }, [])

  const handleBetaGifts = async (e) => {
    e.preventDefault();
    if (!charId) {
      showToast("You must choose a character first.", "error");
      return;
    }
  
    try {
      setLoading(true);
  
      const res = await axios.post(`http://localhost:3000/char/beta/${charId}`,
      {withCredentials: true , headers:{Authorization: `Bearer ${token}`}});
  
      // Success response
      if (res.status === 200) {
        showToast("Beta gifts delivered successfully!", "success");
        setCurrentUser(prev => ({
            ...prev,
            isBeta: 0
        }));
          
      } else {
        showToast(res.data?.message || "Something went wrong.", "error");
      }
  
    } catch (error) {
      console.error("Error delivering beta gifts:", error);
  
      // Show specific server message if available
      if (error.response && error.response.data?.message) {
        showToast(error.response.data.message, "error");
      } else {
        showToast("Network error, please try again.", "error");
      }
  
    } finally {
      setLoading(false);
    }
  };
  
   

  useEffect(() => {
    const fetchPlayerItems = async () => {
      if (!currentUser?.AccountId) return;

      try {
        const response = await axios.get(`http://localhost:3000/char/mail/${charId}`,
        {withCredentials: true , headers:{Authorization: `Bearer ${token}`}});
        setItemsData(response.data.rows); 
        console.log(response.data.rows)
      } catch (err) {
        console.error("Error fetching player items:", err);
        setItemsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerItems();
  }, [currentUser]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen text-white'>
        Loading your items...
      </div>
    );
  }

//   if (itemsData.length === 0) {
//     return (
//       <div className='flex flex-col items-center justify-center h-screen'>
//         <p className='text-3xl font-bold text-center text-gray-300'>
//           You don't have any mail yet.
//         </p>
//       </div>
//     );
//   }

  return (
    <div className='relative mt-30 mb-6 px-4 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] border border-gray-600 rounded-2xl'>
        <div className="flex items-center justify-between my-6">
            <h2 className="text-2xl font-semibold">Your Mail</h2>
            {currentUser.isBeta === 1 &&
                <button onClick={handleBetaGifts}
                className="flex items-center gap-2 bg-yellow-300 hover:bg-yellow-500 cursor-pointer text-gray-600 font-semibold py-2 px-4 rounded-lg transition"
                >
                <span>Get Beta Gifts</span>
                <Gift className="w-5 h-5" />
                </button>
            }
        </div>

        {itemsData.length !== 0 ? (
        <div className="overflow-x-auto w-full">
            <table className="min-w-full text-sm text-left text-gray-300 border-separate border-spacing-y-4">
            <thead>
                <tr className="text-gray-300 font-semibold bg-gray-900">
                <th className="p-2 sm:p-4 text-center rounded-l-xl">Item</th>
                <th className="p-2 sm:p-4 text-center">Name</th>
                <th className="p-2 sm:p-4 text-center">Amount</th>
                <th className="p-2 sm:p-4 text-center">Created At</th>
                <th className="p-2 sm:p-4 text-center">Creator</th>
                <th className="p-2 sm:p-4 text-center rounded-r-xl">Status</th>
                </tr>
            </thead>
            <tbody>
                {itemsData.map((item, i) => (
                <tr key={i} className="bg-gray-800 hover:bg-gray-700 transition">
                    <td className="p-2 sm:p-4 text-center">
                    <SpriteImage code={item.ItemImg} scale={1} />
                    </td>
                    <td className="p-2 sm:p-4 text-center font-semibold text-white">{item.Name}</td>
                    <td className="p-2 sm:p-4 text-center font-semibold text-white">{item.Amount}</td>
                    <td className="p-2 sm:p-4 text-center text-sm text-gray-400">{item.Created}</td>
                    <td
                        className={`p-2 sm:p-4 text-center font-medium ${
                            {
                            "~WebShop System~": "text-pink-500",
                            "~GachaGift~": "text-green-500",
                            "~Beta Gifts~": "text-yellow-500",
                            "~Leveling system~": "text-red-500",
                            "~Gacha System~": "text-blue-500",
                            }[item.Creator] || "text-orange-500"
                        }`}
                        >
                        {item.Creator}
                    </td>

                    <td className={`p-2 sm:p-4 text-center font-medium rounded-r-xl ${item.Recived === 0 ? "text-red-500" : "text-green-500"}`}>
                    {item.Recived === 0 ? "Delivered" : "Received"}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>) : 
        (
            <div className='flex flex-col items-center justify-center h-screen'>
            <p className='text-3xl font-bold text-center text-gray-300'>
              You don't have any mail yet.
            </p>
          </div>
        )}
    </div>

  );
};

export default MyMail;
