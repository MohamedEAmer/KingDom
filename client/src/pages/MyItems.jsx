import React, { useState, useEffect, useContext } from 'react';
import {useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import SpriteImage from '../components/SpriteImage';

const MyItems = () => {

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  useEffect(()=>{
    if(!token){
      showToast("You Can Not Reach This Page", "warning");
      navigate('/')
    }
  }, [])

  useEffect(() => {
    const fetchCharMail = async () => {
      if (!currentUser?.token) return;

      try {
        const response = await axios.get(`http://localhost:3000/player/items/`,
        {withCredentials: true , headers:{Authorization: `Bearer ${token}`}});
        console.log(response.data)
        setItemsData(response.data); 
      } catch (err) {
        console.error("Error fetching player items:", err);
        setItemsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCharMail();
  }, [currentUser]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen text-white'>
        Loading your items...
      </div>
    );
  }

  if (itemsData.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <p className='text-3xl font-bold text-center text-gray-300'>
          You haven't purchased any items yet.
        </p>
      </div>
    );
  }

  return (
    <div className='relative mt-30 mb-6 px-4 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] border border-gray-600 rounded-2xl'>
      <h2 className='text-2xl font-semibold my-6'>Your Purchases</h2>
  
      <div className="overflow-x-auto w-full">
        <table className="min-w-full text-sm text-left text-gray-300 border-separate border-spacing-y-4">
          <thead>
            <tr className="text-gray-300 font-semibold bg-gray-900">
              <th className="p-2 sm:p-4 text-center rounded-l-xl">Item</th>
              <th className="p-2 sm:p-4 text-center">Name</th>
              <th className="p-2 sm:p-4 text-center">Character</th>
              <th className="p-2 sm:p-4 text-center">Amount</th>
              <th className="p-2 sm:p-4 text-center">History</th>
              <th className="p-2 sm:p-4 text-center rounded-r-xl">Price</th>
            </tr>
          </thead>
          <tbody>
            {itemsData.map((item, i) => (
              <tr key={i} className="bg-gray-800 hover:bg-gray-700 transition">
                <td className="p-2 sm:p-4 rounded-l-xl text-center">
                  <div className="flex justify-center items-center">
                    <SpriteImage code={item.Img} scale={1} />
                  </div>
                </td>
                <td className="p-2 sm:p-4 text-center font-semibold text-white">{item.ItemName}</td>
                <td className="p-2 sm:p-4 text-center font-semibold text-white">{item.CharName}</td>
                <td className="p-2 sm:p-4 text-center font-semibold text-white">{item.Amount}</td>
                <td className="p-2 sm:p-4 text-center text-sm text-gray-400">
                  {item.History || "Purchased recently"}
                </td>
                <td className="p-2 sm:p-4 text-center text-primary font-medium rounded-r-xl">
                  {item.Price} Points
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default MyItems;
