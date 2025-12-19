import {
  LayoutList, PartyPopper, BarChart3, Users, WalletCards,
    LogOut, MenuIcon, XIcon, LayoutDashboardIcon, UserCheck
  } from 'lucide-react';
  import React, { useState ,useContext} from 'react';
  import { UserContext } from '../context/userContext'

  import { useNavigate } from 'react-router-dom';
  const tabs = [
    { key: '', label: 'DashBoard', icon: <LayoutDashboardIcon className="w-5 h-5" /> },
    { key: 'items', label: 'Items', icon: <LayoutList className="w-5 h-5" /> },
    { key: 'events', label: 'Events', icon: <PartyPopper className="w-5 h-5" /> },
    { key: 'rates-wars', label: 'Rates & Wars', icon: <BarChart3 className="w-5 h-5" /> },
    { key: 'players', label: 'Players', icon: <Users className="w-5 h-5" /> },
    { key: 'payments', label: 'Payment Info', icon: <WalletCards className="w-5 h-5" /> },
  ];
  
  const DBSideBar = ({ selectedTab, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const {setCurrentUser} = useContext(UserContext)
    const handleLogout = () => {
      setCurrentUser(null)
      navigate('/');
    };
  
    return (
      <>
        {/* Mobile Toggle */}
        {!isOpen && (<MenuIcon onClick={() => setIsOpen(!isOpen)} className="md:hidden fixed top-5 left-4 z-50 w-7 h-7 text-white cursor-pointer" />)}
  
        {/* Sidebar */}
        <aside className={`
          fixed top-0 left-0 z-60 h-full w-64 bg-gradient-to-r from-gray-700 to-gray-900 p-6 border-r border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}>
          {/* Close Icon (Mobile) */}
          <XIcon onClick={() => setIsOpen(false)} className="md:hidden absolute top-6 right-6 w-6 h-6 text-gray-400 cursor-pointer" />
  
          {/* Game Logo */}
          <div className="mb-8 text-center">
            <img onClick={()=>navigate('/')} src="../../public/AsdaLogo.png" alt="Logo" className="w-24 h-24 cursor-pointer mx-auto" />
          </div>
  
          {/* Tabs */}
          <div className="flex flex-col gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {navigate(`/admin/${tab.key}`);
                  setIsOpen(false)
                }}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2 rounded-md transition font-medium
                  ${selectedTab === tab.key
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          {/* Logout Button & User Info */}
          <div className="absolute bottom-6 left-6 right-6 text-center">
            {/* User Icon */}
            <div className="flex flex-col items-center  mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <UserCheck className="w-10 h-10 text-black" />
              </div>
              <p className="mt-4 text-lg text-blue-500 font-semibold">Admin Name</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center justify-center gap-3 px-4 py-2 w-full rounded-md text-red-400 hover:text-red-500 hover:bg-gray-800 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>
      </>
    );
  };
  
  export default DBSideBar;
  