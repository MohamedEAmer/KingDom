import React from 'react';
import DBSideBar from '../components/DBSideBar';
import {useNavigate } from 'react-router-dom';
import { Box, Users, Sparkle, DollarSign } from 'lucide-react';
import { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext'
import { useToast } from "../context/ToastContext";



const AdminDashboard = () => {
  const { showToast } = useToast();
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;
  const navigate = useNavigate()

  useEffect(()=>{
    if(!token || currentUser.role !== "Owner"){
      showToast("You Can Not Reach This Page", "warning");
      navigate('/')
    }
  }, [])

  const [dashboardData, setDashboardData] = useState([
    {
      title: 'Total Items',
      value: 0,
      icon: <Box className="w-8 h-8 text-blue-500" />,
      color: 'bg-black/60',
    },
    {
      title: 'Total Revenue',
      value: '$23,700',
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
      color: 'bg-black/60',
    },
    {
      title: 'Total Events',
      value: 12,
      icon: <Sparkle className="w-8 h-8 text-purple-500" />,
      color: 'bg-black/60',
    },
    {
      title: 'Total Players',
      value: 874,
      icon: <Users className="w-8 h-8 text-red-500" />,
      color: 'bg-black/60',
    },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [shopRes, playersRes] = await Promise.all([
          axios.get(`http://localhost:3000/shop/items`),
          axios.get(`http://localhost:3000/player/all`)
        ]);
  
        setDashboardData(prev =>
          prev.map((box, i) => {
            if (i === 0) return { ...box, value: shopRes.data.length };
            if (i === 3) return { ...box, value: playersRes.data.totalPlayers };
            return box;
          })
        );
        
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };
  
    fetchDashboardData();
  }, []);
  
  return (
    <div className="flex flex-col md:flex-row">
      <DBSideBar />

      <div className="flex-1 p-4 my-6 mx-0 lg:ml-70 md:ml-70 border border-gray-600 rounded-xl min-h-screen text-white">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData.map((card, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl shadow border border-gray-700 flex items-center gap-4 ${card.color}`}
            >
              <div>{card.icon}</div>
              <div>
                <p className="text-white text-sm font-semibold">{card.title}</p>
                <h2 className="text-lg text-white font-bold">{card.value}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
